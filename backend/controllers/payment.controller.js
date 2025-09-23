// controllers/payment.controller.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const Subscription = require("../models/Subscription");
const { Institution } = require("../models/Institution");
const InstituteAdmin = require("../models/InstituteAdmin");
const RedisUtil = require("../utils/redis.util");
const Coupon = require("../models/coupon");
const mongoose = require("mongoose");

const PLANS = require("../config/plans");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { planType = "yearly", couponCode } = req.body;
  const userId = req.userId;

  const institution = await InstituteAdmin.findById(userId).select("institution");
  const institutionId = institution?.institution;

  console.log("[Payment] Create order request received:", {
    userId,
    institutionId,
    planType,
    couponCode,
  });

  if (!institutionId) {
    console.error("[Payment] Institution not found:", institutionId);
    return next(new AppError("Institution not found", 404));
  }

  console.log("[Payment] Institution ownership verified:", institutionId);

  // ✅ Validate plan
  let amount = PLANS[planType];
  if (!amount) {
    console.error("[Payment] Invalid plan type:", planType);
    return next(new AppError("Invalid plan type specified", 400));
  }
  console.log("[Payment] Plan validated:", { planType, baseAmount: amount });

  // ✅ Check coupon
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode,
      // institutions: institutionId, // check institution-specific coupon
    });

    if (!coupon) {
      return next(new AppError("Invalid or unauthorized coupon code", 400));
    }

    // ✅ Check expiry
    if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
      return next(new AppError("Coupon has expired", 400));
    }

    // ✅ Apply discount
    const discount = (amount * coupon.discountPercentage) / 100;
    amount = Math.max(0, amount - discount); // don’t go below 0

    console.log("[Payment] Coupon applied:", {
      couponCode,
      discountPercentage: coupon.discountPercentage,
      discount,
      finalAmount: amount,
    });
  }

  // ✅ Razorpay order creation
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  console.log("[Payment] Creating Razorpay order with options:", options);

  let order;
  try {
    order = await razorpay.orders.create(options);
    console.log("[Payment] Razorpay order created:", order);
  } catch (err) {
    console.error("[Payment] Razorpay order creation failed:", err);
    return next(new AppError("Failed to create order with Razorpay", 500));
  }

  // ✅ Save subscription record
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { institution: institutionId },
      {
        planType,
        status: "pending",
        razorpayOrderId: order.id,
        razorpayPaymentId: null,
        startDate: null,
        endDate: null,
      },
      { upsert: true, new: true }
    );
    console.log("[Payment] Subscription record updated:", subscription);
  } catch (err) {
    console.error("[Payment] Subscription DB update failed:", err);
    return next(new AppError("Failed to update subscription", 500));
  }

  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    orderId: order.id,
  });
  console.log("[Payment] Order response sent to client");
});

exports.verifyPayment = asyncHandler(async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error(
        "[Payment Webhook] ❌ Missing RAZORPAY_WEBHOOK_SECRET in environment variables"
      );
      return res
        .status(500)
        .json({ status: "error", message: "Server misconfiguration" });
    }

    console.log("[Payment Webhook] 🔔 Webhook received:", {
      headers: req.headers,
      body: req.body,
    });

    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      console.warn("[Payment Webhook] ⚠️ Invalid signature");
      return res
        .status(400)
        .json({ status: "error", message: "Invalid signature" });
    }

    console.log("[Payment Webhook] ✅ Signature verified");

    // Extract event + payload safely
    const { event, payload } = req.body || {};
    if (!event || !payload) {
      console.error("[Payment Webhook] ❌ Invalid payload structure", req.body);
      return res
        .status(400)
        .json({ status: "error", message: "Invalid payload" });
    }

    if (event === "payment.captured") {
      const { order_id, id: payment_id } = payload?.payment?.entity || {};

      if (!order_id || !payment_id) {
        console.error(
          "[Payment Webhook] ❌ Missing order_id or payment_id in payload",
          payload
        );
        return res
          .status(400)
          .json({ status: "error", message: "Invalid payment payload" });
      }

      console.log(
        `[Payment Webhook] 💰 Payment captured for order: ${order_id}, payment: ${payment_id}`
      );

      const subscription = await Subscription.findOne({
        razorpayOrderId: order_id,
      });

      if (!subscription) {
        console.warn(
          `[Payment Webhook] ⚠️ No subscription found for orderId: ${order_id}`
        );
        return res.status(200).send("OK"); // still respond 200 so Razorpay doesn't retry forever
      }

      // Update subscription
      subscription.status = "active";
      subscription.razorpayPaymentId = payment_id;
      subscription.startDate = new Date();

      if (subscription.planType === "monthly") {
        subscription.endDate = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        );
      } else if (subscription.planType === "yearly") {
        subscription.endDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
      }

      await subscription.save();
      await InstituteAdmin.findOneAndUpdate(
        { institution: subscription.institution },
        { $set: {
          isPaymentDone: true
        }}
      )
      await RedisUtil.deleteSubscription(order_id);
      await RedisUtil.addSubscription(order_id, "active");
      console.log(
        `[Payment Webhook] ✅ Subscription updated successfully for user: ${subscription.userId}`
      );
    }

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("[Payment Webhook] ❌ Error processing webhook:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

exports.pollSubscriptionStatus = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing userId" });
    }

    const subscription = await Subscription.aggregate([
      {
        $lookup: {
          from: "instituteadmins",
          localField: "institution",
          foreignField: "institution",
          as: "admin",
        },
      },
      { $unwind: "$admin" },
      {
        $match: {
          "admin._id": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          status: 1,
          planType: 1,
          startDate: 1,
          endDate: 1,
        },
      },
    ]);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "pending" });
    }

    return res
      .status(200)
      .json({ success: true, message: subscription[0].status });
  } catch (err) {
    console.error("[Poll Subscription] ❌ Error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});
