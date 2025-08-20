const InstituteAdmin = require('../models/InstituteAdmin');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, contactNumber, designation, linkedinUrl } = req.body;

        const existingUser = await InstituteAdmin.findOne({ $or: [{ email }, { contactNumber }] });
        if (existingUser) {
            return res.status(409).json({ status: 'fail', message: 'Email or contact number already in use.' });
        }

        const newInstituteAdmin = await InstituteAdmin.create({
            name,
            email,
            password,
            contactNumber,
            designation,
            linkedinUrl,
        });

        // Generate, hash, and save the OTP
        const otp = otpService.generateOtp();
        newInstituteAdmin.phoneOtp = await bcrypt.hash(otp, 10);
        newInstituteAdmin.phoneOtpExpires = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) * 60 * 1000);
        await newInstituteAdmin.save();

        // Send the OTP via SMS
        await otpService.sendOtpSms(newInstituteAdmin.contactNumber, otp);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully. An OTP has been sent to your contact number for verification.',
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyPhoneOtp = async (req, res, next) => {
    try {
        const { contactNumber, otp } = req.body;

        const user = await InstituteAdmin.findOne({ contactNumber }).select('+phoneOtp +phoneOtpExpires');

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User with this contact number not found.' });
        }

        // Check if OTP exists is not expired and matches
        const isOtpValid = user.phoneOtp && user.phoneOtpExpires && user.phoneOtpExpires > new Date();
        if (!isOtpValid) {
            return res.status(400).json({ status: 'fail', message: 'OTP is invalid or has expired. Please request a new one.' });
        }

        const isMatch = await bcrypt.compare(otp, user.phoneOtp);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Incorrect OTP.' });
        }

        user.isPhoneVerified = true;
        user.phoneOtp = undefined;
        user.phoneOtpExpires = undefined;
        await user.save();
        
        const token = signToken(user._id);

        res.status(200).json({ 
            status: 'success', 
            message: 'Phone number verified successfully.',
            token 
        });

    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await InstituteAdmin.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
        }
        
        if (!user.isPhoneVerified) {
            return res.status(403).json({ status: 'fail', message: 'Account not verified. Please verify your phone number first.' });
        }

        if (user.institution) {
            return res.status(401).json({ status: 'fail', message: 'This account has already set up an institution.' });
        }

        const token = signToken(user._id);
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        next(error);
    }
};