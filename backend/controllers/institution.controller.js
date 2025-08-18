const mongoose = require('mongoose');
const { Institution, Kindergarten, CoachingCenter, StudyHall } = require('../models/Institution');
const InstituteAdmin = require('../models/InstituteAdmin');
const AppError = require('../utils/appError')
const asyncHandler = require('express-async-handler');
const { uploadStream } = require('../services/upload.service')

const institutionModelMap = {
    'Kindergarten/childcare center': Kindergarten,
    'Coaching centers': CoachingCenter,
    'Study halls': StudyHall,
    'School': Institution, // Default
    'Intermediate college(K12)': Institution,
    'UG / PG University': Institution,
    'Study Abroad': Institution,
};

exports.createInstitution = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { instituteType } = req.body;

    const Model = institutionModelMap[instituteType];
    if (!Model) {
        return next(new AppError('Invalid institution type provided.', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await InstituteAdmin.findById(userId).session(session);

        const institutionData = { ...req.body, owner: userId };

        if ((instituteType === 'Coaching centers' || instituteType === 'Study halls') && req.file) {
            const folderPath = `tooclarity/institutions/${userId}/${instituteType.replace(/\s+/g, '_')}`;
            const imageResult = await uploadStream(req.file.buffer, {
                folder: folderPath
            });

            if (instituteType === 'Coaching centers' && institutionData.tuitionHalls && institutionData.tuitionHalls[0]) {
                institutionData.tuitionHalls[0].image = imageResult.secure_url;
            } else if (instituteType === 'Study halls' && institutionData.halls && institutionData.halls[0]) {
                institutionData.halls[0].image = imageResult.secure_url;
            }
        }
        const newInstitution = (await Institution.create([institutionData], { session }))[0];

        user.institution = newInstitution._id;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            status: 'success',
            data: {
                institution: newInstitution,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
});