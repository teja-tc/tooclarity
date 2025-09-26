const express = require('express');
const { body, query } = require('express-validator');
const { otpLimiter } = require('../middleware/rateLimiter');
const studentController = require('../controllers/student.controller');

const router = express.Router();

// Phone OTP
router.post('/auth/otp/phone/send', otpLimiter, body('phone').isString().trim(), studentController.sendPhoneOtp);
router.post('/auth/otp/phone/resend', otpLimiter, body('phone').isString().trim(), studentController.resendPhoneOtp);
router.post('/auth/otp/phone/verify', body('phone').isString().trim(), body('otp').isLength({ min: 6, max: 6 }).isString(), studentController.verifyPhoneOtp);

// Google OAuth - ID token endpoint (if still needed for backward compatibility)
router.post('/auth/google', body('idToken').optional().isString(), body('token').optional().isString(), studentController.google);

// Social placeholders
router.post('/auth/microsoft', body('token').isString(), studentController.microsoft);
router.post('/auth/apple', body('token').isString(), studentController.apple);

module.exports = router;
