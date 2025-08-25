const Branch = require('../models/Branch');
const Institution = require('../models/Institution');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');

const checkOwnership = async (institutionId, userId) => {
    const institution = await Institution.findById(institutionId);
    if (!institution) {
        throw new AppError('No institution found with that ID', 404);
    }
    if (institution.owner.toString() !== userId) {
        throw new AppError('You are not authorized to perform this action for this institution', 403);
    }
    return institution;
};


exports.createBranch = asyncHandler(async (req, res, next) => {
    const { institutionId } = req.params;
    
    await checkOwnership(institutionId, req.user.id);

    const branch = await Branch.create({
        ...req.body,
        institution: institutionId
    });

    res.status(201).json({
        success: true,
        data: branch
    });
});

exports.getAllBranchesForInstitution = asyncHandler(async (req, res, next) => {
    const { institutionId } = req.params;
    
    await checkOwnership(institutionId, req.user.id);

    const branches = await Branch.find({ institution: institutionId });

    res.status(200).json({
        success: true,
        count: branches.length,
        data: branches
    });
});

exports.getBranchById = asyncHandler(async (req, res, next) => {
    const { institutionId, branchId } = req.params;

    await checkOwnership(institutionId, req.user.id);
    
    const branch = await Branch.findById(branchId);

    if (!branch || branch.institution.toString() !== institutionId) {
        return next(new AppError('Branch not found or does not belong to this institution', 404));
    }

    res.status(200).json({
        success: true,
        data: branch
    });
});

exports.updateBranch = asyncHandler(async (req, res, next) => {
    const { institutionId, branchId } = req.params;
    
    await checkOwnership(institutionId, req.user.id);

    let branch = await Branch.findById(branchId);

    if (!branch || branch.institution.toString() !== institutionId) {
        return next(new AppError('Branch not found or does not belong to this institution', 404));
    }
    
    branch = await Branch.findByIdAndUpdate(branchId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: branch
    });
});

// @desc    Delete a branch
// @route   DELETE /api/v1/institutions/:institutionId/branches/:branchId
// @access  Private
exports.deleteBranch = asyncHandler(async (req, res, next) => {
    const { institutionId, branchId } = req.params;

    // Authorization Check
    await checkOwnership(institutionId, req.user.id);
    
    const branch = await Branch.findById(branchId);
    
    if (!branch || branch.institution.toString() !== institutionId) {
        return next(new AppError('Branch not found or does not belong to this institution', 404));
    }
    
    await branch.remove();

    res.status(204).json({
        success: true,
        data: {}
    });
});