// controllers/coupon.controller.js

const Coupon = require("../models/coupon");
const Admin = require("../models/Admin"); // Import the new Admin model
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const InstitutionAdmin = require("../models/InstituteAdmin");
const PLANS = require("../config/plans");

/**
 * @desc    Create a new coupon
 * @route   POST /api/v1/admin/coupon/create
 * @access  Private/Admin
 */
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const { code, discountPercentage, validTill, planType, institutionNames, adminId } = req.body;

  if (!adminId) {
    return next(new AppError("Admin ID is required to create a coupon", 400));
  }

  const adminExists = await Admin.findById(adminId);
  if (!adminExists) {
    return next(new AppError("Admin not found with the provided ID", 404));
  }

  if (!PLANS[planType]) {
    return next(new AppError("Invalid plan type", 400));
  }

  if (!Array.isArray(institutionNames) || institutionNames.length === 0) {
    return next(new AppError("At least one institution name is required", 400));
  }

  const institutions = await InstitutionAdmin.find(
    { name: { $in: institutionNames } },
    "institution"
  );

  if (!institutions || institutions.length !== institutionNames.length) {
    return next(new AppError("One or more institution names are invalid", 404));
  }

  const institutionIds = institutions.map((admin) => admin.institution);

  try {
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      institutions: institutionIds,
      validTill,
      planType,
      createdBy: adminId,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("A coupon with this code already exists.", 409));
    }
    if (err.name === 'ValidationError') {
        return next(new AppError(err.message, 400));
    }
    console.error("[Coupon] Creation failed:", err);
    return next(new AppError("Failed to create coupon", 500));
  }
});


/**
 * @desc    Validate a coupon
 * @route   POST /api/v1/coupon/apply
 * @access  Private/InstitutionAdmin
 */
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, planType } = req.body;
  const institutionAdminId = "60c72b2f5f1b2c001f3e8b8a"; 

  if (!code || !planType) {
    return next(new AppError("Coupon code and plan type are required", 400));
  }

  const adminUser = await InstitutionAdmin.findById(institutionAdminId).select('institution');
  if (!adminUser || !adminUser.institution) {
      return next(new AppError('No institution is linked to your account.', 404));
  }
  const institutionId = adminUser.institution;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    planType,
    isActive: true,
    institutions: institutionId,
    validTill: { $gte: new Date() },
    $expr: { $lt: ["$useCount", "$maxUses"] }
  });

  if (!coupon) {
    return next(new AppError("This coupon is not valid for your account, has expired, or has been fully redeemed.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Coupon is valid",
    data: {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    },
  });
});