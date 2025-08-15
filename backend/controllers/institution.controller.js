const mongoose = require('mongoose');
const Institution = require('../models/Institution');
const InstituteAdmin = require('../models/InstituteAdmin')

exports.createInstitution = async (req, res, next) => {
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await InstituteAdmin.findById(userId).session(session);
        if (user.institution) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ status: 'fail', message: 'User has already created an institution.' });
        }

        const institutionData = { ...req.body, owner: userId };
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
};