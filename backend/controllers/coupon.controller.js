const Coupon = require("../models/coupon");
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const InstitutionAdmin = require("../models/InstituteAdmin");

const PLANS = {
  monthly: 10000, // Rs.100.00
  yearly: 118800, // Rs.118800.00
};


exports.createCoupon = asyncHandler(async (req, res, next) => {
  const { code, discountPercentage, validTill, planType, institutionNames } = req.body;

  // Validate plan type
  if (!PLANS[planType]) {
    return next(new AppError("Invalid plan type", 400));
  }

  if (!Array.isArray(institutionNames) || institutionNames.length === 0) {
    return next(new AppError("At least one institution name is required", 400));
  }

  // Fetch all institutions matching given names
  const institutions = await InstitutionAdmin.find(
    { name: { $in: institutionNames } },
    "_id"
  );

  if (!institutions || institutions.length === 0) {
    return next(new AppError("No matching institutions found", 404));
  }

  // Extract IDs
  const institutionIds = institutions.map((inst) => inst._id);

  try {
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      institutions: institutionIds, // ✅ Array of institution IDs
      validTill,
      planType,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (err) {
    console.error("[Coupon] Creation failed:", err);
    return next(new AppError("Failed to create coupon", 500));
  }
});


/**
 * Apply a coupon → return discounted amount
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const institutionAdminId = req.userId;    

  const coupon = await Coupon.findOne({
    code: code,
    institution: institutionAdminId,
  });

  if (!coupon) {
    return next(new AppError("Invalid or expired coupon", 404));
  }

  if (new Date(coupon.validTill) < new Date()) {
    return next(new AppError("Coupon has expired", 400));
  }

  const originalAmount = PLANS[coupon.planType];
  const discount = (originalAmount * coupon.discountPercentage) / 100;
  const finalAmount = Math.max(originalAmount - discount, 0);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: {
    //   coupon: coupon.code,
      discountAmount: discount,
    //   originalAmount,
    //   finalAmount,
    },
  });
});
