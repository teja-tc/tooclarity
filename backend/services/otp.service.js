const crypto = require("crypto");
const axios = require("axios");
const logger = require("../config/logger");
const AppError = require("../utils/appError");
const RedisUtil = require("../utils/redis.util");


const sendEmail = async (to, templateId, variables = {}) => {
  try {
    const payload = {
      recipients: [
        {
          to: [{ email: to }],
          variables, // dynamic values for placeholders in template
        },
      ],
      from: {
        email: process.env.MSG91_EMAIL_FROM, // verified email
        name: process.env.MSG91_EMAIL_NAME || "TooClarity",
      },
      domain: process.env.MSG91_EMAIL_DOMAIN, // verified domain
      template_id: templateId, // required for template-based sending
    };

    const response = await axios.post(process.env.MSG91_EMAIL_URL, payload, {
      headers: {
        authkey: process.env.MSG91_API_KEY,
        "Content-Type": "application/json",
      },
    });

    logger.info({ event: "msg91_email_sent", to }, "✅ MSG91 Email Sent");
    return response.data;
  } catch (error) {
    const errData = error.response?.data;

    console.error("❌ MSG91 Email Sending Failed:");
    if (errData?.errors) {
      console.error("Detailed Errors:", JSON.stringify(errData.errors, null, 2));
    } else if (errData?.message) {
      console.error("Message:", errData.message);
    } else {
      console.error(error.message);
    }

    logger.error(
      { err: errData || error.message, event: "msg91_email_failed", to },
      "❌ MSG91 Email Sending Failed"
    );
    throw new Error("Email sending failed via MSG91");
  }
};


exports.generateOtp = () => {
  const otpLength = parseInt(process.env.OTP_LENGTH, 10) || 6;
  return crypto
    .randomInt(0, Math.pow(10, otpLength))
    .toString()
    .padStart(otpLength, "0");
};

exports.sendVerificationToken = async (email) => {
  try {
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const otp = this.generateOtp();

    // Save OTP in Redis for 15 minutes
    await RedisUtil.saveOtp(email, otp, 900);

    // Define variables to pass to MSG91 template
    const variables = [
      { name: "otp", value: otp },
      { name: "name", value: "User" },          
      { name: "validity", value: "15 minutes" }
    ];

    // Send email using MSG91 template
    await sendEmail(
      email,
      templateId,   
      variables 
    );

    logger.info({ event: "otp_sent", email }, "OTP sent successfully.");
    return true;
  } catch (error) {
    logger.error({ err: error, event: "otp_failed", email }, "OTP sending failed.");
    throw new AppError("Could not send OTP.", 500);
  }
};


exports.checkVerificationToken = async (email, code) => {
  try {
    const isValid = await RedisUtil.validateOtp(email, code);
    if (isValid) {
      logger.info({ event: "otp_verified", email }, "OTP verified successfully.");
      return true;
    } else {
      logger.warn({ event: "otp_invalid", email }, "OTP invalid or expired.");
      return false;
    }
  } catch (error) {
    logger.error({ err: error, event: "otp_check_error", email }, "OTP check failed.");
    return false;
  }
};

// ✅ Payment Confirmation Email
exports.sendPaymentSuccessEmail = async (options) => {
  const { email, planType, amount, orderId, startDate, endDate } = options;
  try {
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedAmount = (amount / 100).toFixed(2);

    const content = `Dear User,

We are happy to inform you that your payment was successful!

Plan: ${planType.charAt(0).toUpperCase() + planType.slice(1)}
Amount Paid: ₹${formattedAmount}
Order ID: ${orderId}
Start Date: ${formattedStartDate}
End Date: ${formattedEndDate}

Thank you for choosing TooClarity!`;

    await sendEmail(email, "Your Subscription is Confirmed!", content);
    logger.info({ event: "payment_success_email_sent", email, orderId }, "Payment success email sent.");
    return true;
  } catch (error) {
    logger.error({ err: error, event: "payment_email_failed", email, orderId }, "Payment email failed.");
    return false;
  }
};

// ✅ Password Change OTP
exports.sendPasswordChangeToken = async (email) => {
  try {
    const otp = this.generateOtp();
    await RedisUtil.saveOtp(`password-change:${email}`, otp, 600); // 10 minutes

    const content = `Dear User,

A password change was requested. Use the verification code below to proceed:

Verification Code: ${otp}

This code is valid for 10 minutes. If you didn’t request this, contact TooClarity Support immediately.`;

    await sendEmail(email, "Password Change Request - Verification Code", content);
    logger.info({ event: "password_otp_sent", email }, "Password change OTP sent.");
    return true;
  } catch (error) {
    logger.error({ err: error, event: "password_otp_failed", email }, "Password change OTP failed.");
    throw new AppError("Could not send verification code.", 500);
  }
};

exports.checkPasswordChangeToken = async (email, otp) => {
  try {
    const redisKey = `password-change:${email}`;
    const isValid = await RedisUtil.validateOtp(redisKey, otp);

    if (isValid) {
      await RedisUtil.deleteOtp(redisKey);
      logger.info({ event: "password_otp_verified", email }, "Password OTP verified.");
      return true;
    } else {
      logger.warn({ event: "password_otp_invalid", email }, "Password OTP invalid/expired.");
      return false;
    }
  } catch (error) {
    logger.error({ err: error, event: "password_otp_check_error", email }, "Password OTP check failed.");
    return false;
  }
};

// ✅ Password Reset Link
exports.sendPasswordResetLink = async (email, resetURL) => {
  try {
    const content = `Dear User,

You requested to reset your password. Click the link below to proceed:

${resetURL}

This link is valid for 15 minutes. Please do not share this link with anyone.`;

    await sendEmail(email, "Your Password Reset Link (Valid for 15 Mins)", content);
    logger.info({ event: "password_reset_link_sent", email }, "Password reset link sent.");
    return true;
  } catch (error) {
    logger.error({ err: error, event: "password_reset_link_failed", email }, "Password reset link failed.");
    throw new AppError("Could not send password reset link.", 500);
  }
};

// ✅ Password Changed Confirmation
exports.sendPasswordChangedConfirmation = async (email) => {
  try {
    const content = `Dear User,

Your account password has been changed successfully.

If you did NOT make this change, please contact our support team immediately.`;

    await sendEmail(email, "Your Password Has Been Changed", content);
    logger.info({ event: "password_change_confirm_sent", email }, "Password change confirmation sent.");
  } catch (error) {
    logger.error({ err: error, event: "password_change_confirm_failed", email }, "Password change confirmation failed.");
  }
};