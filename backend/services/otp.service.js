const twilio = require('twilio');
const logger = require('../config/logger');
const AppError = require('../utils/AppError');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const formatPhoneNumber = (number) => {
  if (!number.startsWith('+')) {
    return `+91${number}`;
  }
  return number;
};

/**
 * Sends a verification token (OTP) to a phone number using the Twilio Verify API.
 * @param {string} phoneNumber - The recipient's phone number in E.164 format.
 * @returns {Promise<object>} The verification object from Twilio.
 */
exports.sendVerificationToken = async (phoneNumber) => {
    try {
        const formatNumber = formatPhoneNumber(phoneNumber);
        const verification = await twilioClient.verify.v2.services(verifyServiceSid).verifications.create({ to: formatNumber, channel: 'sms' });

        logger.info({
            event: 'verification_token_sent',
            phoneNumber: formatNumber,
            verificationSid: verification.sid
        }, 'Verification token sent successfully.');

        return verification;
    } catch (error) {
        logger.error({
            err: error,
            event: 'verification_token_failed',
            phoneNumber: phoneNumber
        }, 'Failed to send verification token via Twilio.');

        throw new AppError('Could not send verification code.', 500);
    }
};

/**
 * Checks if the OTP is valid.
 * @param {string} phoneNumber - The user's phone number in E.164 format.
 * @param {string} code - The OTP code provided by the user.
 * @returns {Promise<boolean>} True if the code is valid, false otherwise.
 */
exports.checkVerificationToken = async (phoneNumber, code) => {
    try {
        const formatNumber = formatPhoneNumber(phoneNumber);
        const verificationCheck = await twilioClient.verify.v2.services(verifyServiceSid).verificationChecks.create({ to: formatNumber, code: code });

        if (verificationCheck.status === 'approved') {
            logger.info({
                event: 'verification_check_success',
                phoneNumber: formatNumber
            }, 'Verification check approved.');
            return true;
        } else {
            logger.warn({
                event: 'verification_check_denied',
                phoneNumber: formatNumber,
                status: verificationCheck.status
            }, 'Verification check was valid but not approved.');
            return false;
        }
    } catch (error) {
        logger.warn({
            err: error,
            event: 'verification_check_error',
            phoneNumber: phoneNumber,
        }, `Verification check failed, likely due to an invalid/expired code.`);

        return false;
    }
};