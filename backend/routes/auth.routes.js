const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validators');
const { otpLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', validateLogin, authController.login);

router.use(['/register', '/verify-otp', '/verify-email'], otpLimiter);

router.post(
    '/register',
    validateRegistration,
    authController.register
);

// 📱 Phone OTP verification
// router.post(
//     '/verify-otp',
//     body('contactNumber').isMobilePhone('any', { strictMode: true }),
//     body('otp').isString().isLength({ min: 6, max: 6 }).trim(),
//     authController.verifyPhoneOtp
// );

// 📧 Email OTP verification
router.post(
    '/verify-email',
    body('email').isEmail().normalizeEmail(),
    body('otp').isString().isLength({ min: 6, max: 6 }).trim(),
    authController.verifyEmailOtp
);

module.exports = router;