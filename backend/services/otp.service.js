// const twilio = require("twilio");
// const logger = require("../config/logger");
// const AppError = require("../utils/appError");

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
// const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// const formatPhoneNumber = (number) => {
//   if (!number.startsWith("+")) {
//     return `+91${number}`;
//   }
//   return number;
// };

// /**
//  * Generates a secure random OTP.
//  * @returns {string} The generated OTP.
//  */
// exports.generateOtp = () => {
//   const otpLength = parseInt(process.env.OTP_LENGTH, 10) || 6;
//   return crypto
//     .randomInt(0, Math.pow(10, otpLength))
//     .toString()
//     .padStart(otpLength, "0");
// };

// /**
//  * Sends a verification token (OTP) to a phone number using the Twilio Verify API.
//  * @param {string} phoneNumber - The recipient's phone number in E.164 format.
//  * @returns {Promise<object>} The verification object from Twilio.
//  */
// exports.sendVerificationToken = async (phoneNumber) => {
//   try {
//     const formatNumber = formatPhoneNumber(phoneNumber);
//     const verification = await twilioClient.verify.v2
//       .services(verifyServiceSid)
//       .verifications.create({ to: formatNumber, channel: "sms" });

//     logger.info(
//       {
//         event: "verification_token_sent",
//         phoneNumber: formatNumber,
//         verificationSid: verification.sid,
//       },
//       "Verification token sent successfully."
//     );

//     return verification;
//   } catch (error) {
//     logger.error(
//       {
//         err: error,
//         event: "verification_token_failed",
//         phoneNumber: phoneNumber,
//       },
//       "Failed to send verification token via Twilio."
//     );

//     throw new AppError("Could not send verification code.", 500);
//   }
// };

// /**
//  * Checks if the OTP is valid.
//  * @param {string} phoneNumber - The user's phone number in E.164 format.
//  * @param {string} code - The OTP code provided by the user.
//  * @returns {Promise<boolean>} True if the code is valid, false otherwise.
//  */
// exports.checkVerificationToken = async (phoneNumber, code) => {
//   try {
//     const formatNumber = formatPhoneNumber(phoneNumber);
//     const verificationCheck = await twilioClient.verify.v2
//       .services(verifyServiceSid)
//       .verificationChecks.create({ to: formatNumber, code: code });

//     if (verificationCheck.status === "approved") {
//       logger.info(
//         {
//           event: "verification_check_success",
//           phoneNumber: formatNumber,
//         },
//         "Verification check approved."
//       );
//       return true;
//     } else {
//       logger.warn(
//         {
//           event: "verification_check_denied",
//           phoneNumber: formatNumber,
//           status: verificationCheck.status,
//         },
//         "Verification check was valid but not approved."
//       );
//       return false;
//     }
//   } catch (error) {
//     logger.warn(
//       {
//         err: error,
//         event: "verification_check_error",
//         phoneNumber: phoneNumber,
//       },
//       `Verification check failed, likely due to an invalid/expired code.`
//     );

//     return false;
//   }
// };

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
