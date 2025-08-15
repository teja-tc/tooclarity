const crypto = require('crypto');
const twilio = require('twilio');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Generates a secure random OTP.
 * @returns {string} The generated OTP.
 */
exports.generateOtp = () => {
    const otpLength = parseInt(process.env.OTP_LENGTH, 10) || 6;
    return crypto.randomInt(0, Math.pow(10, otpLength)).toString().padStart(otpLength, '0');
};

/**
 * Sends an SMS with the OTP.
 * @param {string} to - The recipient's phone number in E.164 format.
 * @param {string} otp - The one-time password to send.
 * @returns {Promise<void>}
 */
exports.sendOtpSms = async (to, otp) => {
    try {
        const message = `Your verification code for Tooclarity is: ${otp}. This code is valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`;
        
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });

        console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send OTP to ${to}:`, error);
        throw new Error('Could not send verification code.');
    }
};