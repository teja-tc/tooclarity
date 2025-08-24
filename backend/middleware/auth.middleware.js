const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const InstituteAdmin = require('../models/InstituteAdmin');
const logger = require('../config/logger');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in. Please log in to get access.' });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await InstituteAdmin.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Middleware to ensure an institution has been created by the user.
 * @use-after protect
 */
exports.checkInstitutionExists = (req, res, next) => {
    if (!req.user || !req.user.institution) {
        logger.warn({ userId: req.user.id }, 'User attempted action without creating an institution (L1).');
        return res.status(400).json({
            status: 'fail',
            message: 'You must create an institution (L1) before performing this action.',
        });
    }
    next();
};