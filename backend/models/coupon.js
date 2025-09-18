// models/coupon.model.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    institutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution", // Assuming you have an Institution model
        required: true,
      },
    ],
    validTill: {
      type: Date,
      required: [true, "Valid till date is required"],
    },
    planType: {
      type: String,
      enum: ["monthly", "yearly"], // restrict only to supported plans
      required: [true, "Plan type is required"],
    },
    isActive: {
      type: Boolean,
      default: true, // helps for deactivating coupons without deleting
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
