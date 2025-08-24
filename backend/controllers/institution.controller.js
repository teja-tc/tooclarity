const mongoose = require('mongoose');
const { Institution } = require('../models/Institution');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

/**
 * @desc    CREATE L1 Institution (General Info)
 * @route   POST /api/v1/institutions
 * @access  Private
 */
exports.createL1Institution = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const institutionData = { ...req.body, owner: req.user.id };
        const newInstitution = (await Institution.create([institutionData], { session }))[0];

        req.user.institution = newInstitution._id;
        await req.user.save({ session, validateBeforeSave: false });

        await session.commitTransaction();

        logger.info({ userId: req.user.id, institutionId: newInstitution._id }, 'L1 institution created successfully.');

        res.status(201).json({
            status: 'success',
            message: 'L1 completed. Institution created. Please proceed to L2.',
            data: { institution: newInstitution },
        });
    } catch (error) {
        await session.abortTransaction();
        logger.error({ err: error, userId: req.user.id }, 'Error during L1 institution creation transaction.');
        next(error);
    } finally {
        session.endSession();
    }
});

/**
 * @desc    UPDATE L2 Institution
 * @route   PUT /api/v1/institutions/details
 * @access  Private
 */
exports.updateL2InstitutionDetails = asyncHandler(async (req, res, next) => {
    const institution = await Institution.findById(req.user.institution);
    
    Object.keys(req.body).forEach(key => {
        institution[key] = req.body[key];
    });

    const updatedInstitution = await institution.save();

    logger.info({ userId: req.user.id, institutionId: institution._id }, 'L2 institution details updated successfully.');

    res.status(200).json({
        status: 'success',
        message: 'L2 completed. Institution details updated successfully.',
        data: { institution: updatedInstitution },
    });
});

/**
 * @desc    READ the institution of the logged-in admin
 * @route   GET /api/v1/institutions/me
 * @access  Private
 */
exports.getMyInstitution = asyncHandler(async (req, res, next) => {
    const institution = await Institution.findById(req.user.institution);

    if (!institution) {
        return res.status(404).json({
            status: 'fail',
            message: 'No institution found for this account.',
        });
    }

    res.status(200).json({
        status: 'success',
        data: { institution },
    });
});

/**
 * @desc    DELETE the institution of the logged-in admin
 * @route   DELETE /api/v1/institutions/me
 * @access  Private
 */
exports.deleteMyInstitution = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const institutionId = req.user.institution;
        const institution = await Institution.findById(institutionId).session(session);

        if (!institution) {
            return res.status(404).json({ status: 'fail', message: 'Institution not found.' });
        }

        await institution.remove({ session });

        req.user.institution = undefined;
        await req.user.save({ session, validateBeforeSave: false });

        await session.commitTransaction();

        logger.info({ userId: req.user.id, institutionId }, 'Institution deleted successfully.');

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        await session.abortTransaction();
        logger.error({ err: error, userId: req.user.id }, 'Error during institution deletion transaction.');
        next(error);
    } finally {
        session.endSession();
    }
});