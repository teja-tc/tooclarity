const InstituteAdmin = require('../models/InstituteAdmin');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, contactNumber, designation, linkedinUrl } = req.body;

        const existingUser = await InstituteAdmin.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: 'fail', message: 'Email already in use.' });
        }

        const newInstituteAdmin = await InstituteAdmin.create({
            name,
            email,
            password,
            contactNumber,
            designation,
            linkedinUrl,
        });

        newInstituteAdmin.password = undefined;

        res.status(201).json({
            status: 'success',
            message: 'User registered. Please log in to continue.',
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

        if (user.institution) {
            return res.status(401).json({ status: 'fail', message: 'This account has already set up an institution.' });
        }

        const token = signToken(user._id);
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        next(error);
    }
};