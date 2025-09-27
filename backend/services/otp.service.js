const crypto = require("crypto");
const nodemailer = require("nodemailer");
const logger = require("../config/logger");
const AppError = require("../utils/appError");
const RedisUtil = require("../utils/redis.util");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.generateOtp = () => {
  const otpLength = parseInt(process.env.OTP_LENGTH, 10) || 6;
  return crypto
    .randomInt(0, Math.pow(10, otpLength))
    .toString()
    .padStart(otpLength, "0");
};

exports.sendVerificationToken = async (email) => {
  try {
    const otp = this.generateOtp();

    // save OTP to Redis with 15 min expiry
    await RedisUtil.saveOtp(email, otp, 900);

    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification - One Time Password (OTP)",
      text: `Dear User,

Your One Time Password (OTP) is: ${otp}

This code is valid for the next 15 minutes. Please do not share this code with anyone for security reasons.

Note: This is an automated message. Please do not reply to this email.

Best regards,  
The TooClarity Team`,
    };

    await transporter.sendMail(mailOptions);

    logger.info({ event: "otp_sent", email }, "OTP sent successfully.");
    return true;
  } catch (error) {
    logger.error(
      { err: error, event: "otp_failed", email },
      "OTP sending failed."
    );
    throw new AppError("Could not send OTP.", 500);
  }
};

exports.checkVerificationToken = async (email, code) => {
  try {
    const isValid = await RedisUtil.validateOtp(email, code);

    if (isValid) {
      logger.info(
        { event: "otp_verified", email },
        "OTP verified successfully."
      );
      return true;
    } else {
      logger.warn({ event: "otp_invalid", email }, "OTP invalid or expired.");
      return false;
    }
  } catch (error) {
    logger.error(
      { err: error, event: "otp_check_error", email },
      "OTP check failed."
    );
    return false;
  }
};

exports.sendPaymentSuccessEmail = async (options) => {
  const { email, planType, amount, orderId, startDate, endDate } = options;

  try {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedAmount = (amount / 100).toFixed(2);

    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Subscription is Confirmed!",
      text: `Dear User,

We are happy to inform you that your payment was successful and your subscription is now active!

Here are the details of your plan:
- Plan: ${planType.charAt(0).toUpperCase() + planType.slice(1)}
- Amount Paid: ₹${formattedAmount}
- Order ID: ${orderId}
- Subscription Start Date: ${formattedStartDate}
- Subscription End Date: ${formattedEndDate}

Thank you for choosing us!

Best regards,
The TooClarity Team`,
    };

    await transporter.sendMail(mailOptions);
    logger.info({ event: "payment_success_email_sent", email, orderId }, "Payment success email sent.");
    return true;

  } catch (error) {
    logger.error(
      { err: error, event: "payment_email_failed", email, orderId },
      "Failed to send payment success email."
    );
    return false;
  }
};