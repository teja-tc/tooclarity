// controllers/payment.controller.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const Subscription = require("../models/Subscription");
const InstituteAdmin = require("../models/InstituteAdmin");
const Coupon = require("../models/coupon");
const RedisUtil = require("../utils/redis.util");

// CORRECT: Importing the job function
const { addPaymentSuccessEmailJob } = require('../jobs/email.job.js');

const PLANS = require("../config/plans");
const logger = require('pino')();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrder = asyncHandler(async (req, res, next) => {
  const { planType = "yearly", coupon: couponCode } = req.body;
  const userId = req.userId;

  const adminUser = await InstituteAdmin.findById(userId).select("institution");
  if (!adminUser || !adminUser.institution) {
    logger.warn({ userId }, "[Payment] Admin user or their institution not found.");
    return next(new AppError("Institution not found for your account", 404));
  }
  const institutionId = adminUser.institution;

  const plan = PLANS[planType];
  if (!plan) {
    logger.warn({ planType }, "[Payment] Invalid plan type specified.");
    return next(new AppError("Invalid plan type specified", 400));
  }

  let finalAmount = plan.price;
  let couponId = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      planType,
      isActive: true,
      institutions: institutionId,
      validTill: { $gte: new Date() },
    }).where('this.useCount < this.maxUses');

    if (!coupon) {
      logger.warn({ couponCode, institutionId }, "[Payment] Invalid, expired, or inapplicable coupon.");
      return next(new AppError("The provided coupon is invalid or has expired", 400));
    }

    couponId = coupon._id;
    const discountAmount = Math.round((plan.price * coupon.discountPercentage) / 100);
    finalAmount = Math.max(plan.price - discountAmount, 0);
    logger.info({ couponCode, discountAmount, finalAmount }, "[Payment] Coupon applied successfully.");
  }

  const options = {
    amount: finalAmount,
    currency: "INR",
    receipt: `receipt_${institutionId.toString()}_${Date.now()}`,
    notes: {
      institutionId: institutionId.toString(),
      planType,
      userId,
    }
  };

  const order = await razorpay.orders.create(options);
  logger.info({ orderId: order.id, institutionId }, "[Payment] Razorpay order created.");

  await Subscription.findOneAndUpdate(
    { institution: institutionId },
    {
      planType,
      status: "pending",
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      coupon: couponId,
      startDate: null,
      endDate: null,
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    orderId: order.id,
  });
});

exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    logger.warn("[Payment Webhook] Invalid signature received.");
    return res.status(400).json({ status: "error", message: "Invalid signature" });
  }

  const { event, payload } = req.body;
  if (event === "payment.captured") {
    const { order_id, id: payment_id, amount } = payload.payment.entity;

    const session = await mongoose.startSession();
    session.startTransaction();

    let subscriptionDataForEmail;

    try {
      const subscription = await Subscription.findOne({ razorpayOrderId: order_id }).session(session);

      if (!subscription || subscription.status !== 'pending') {
        logger.warn({ order_id }, `[Payment Webhook] No pending subscription found or already processed.`);
        await session.abortTransaction();
        session.endSession();
        return res.status(200).send("OK");
      }

      subscription.status = "active";
      subscription.razorpayPaymentId = payment_id;
      subscription.startDate = new Date();
      subscription.endDate = subscription.planType === "yearly"
        ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        : new Date(new Date().setMonth(new Date().getMonth() + 1));

      await subscription.save({ session });

      if (subscription.coupon) {
        await Coupon.updateOne({ _id: subscription.coupon }, { $inc: { useCount: 1 } }, { session });
        logger.info({ couponId: subscription.coupon, order_id }, "[Payment Webhook] Coupon usage incremented.");
      }

      await InstituteAdmin.updateOne({ institution: subscription.institution }, { $set: { isPaymentDone: true } }, { session });

      await session.commitTransaction();

      subscriptionDataForEmail = {
        institution: subscription.institution,
        planType: subscription.planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      };

      await RedisUtil.setex(`sub_status:${subscription.institution.toString()}`, 3600, "active");
      logger.info({ order_id, institutionId: subscription.institution }, "[Payment Webhook] Subscription activated successfully.");

    } catch (error) {
      await session.abortTransaction();
      logger.error({ error, order_id }, "[Payment Webhook] Transaction failed during payment verification.");
      return next(new AppError("Failed to verify payment due to a server error.", 500));
    } finally {
      session.endSession();
    }

    if (subscriptionDataForEmail) {
      const adminUser = await InstituteAdmin.findOne({ institution: subscriptionDataForEmail.institution }).select('email');

      if (adminUser && adminUser.email) {
        // CORRECT: Adding the job to the queue
        await addPaymentSuccessEmailJob({
          email: adminUser.email,
          planType: subscriptionDataForEmail.planType,
          amount: amount,
          orderId: order_id,
          startDate: subscriptionDataForEmail.startDate,
          endDate: subscriptionDataForEmail.endDate,
        });
      } else {
        logger.warn({ order_id, institutionId: subscriptionDataForEmail.institution }, "[Payment Webhook] Could not find user email to add email job.");
      }
    }
  }

  res.status(200).json({ status: "success" });
});

exports.pollSubscriptionStatus = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const adminUser = await InstituteAdmin.findById(userId).select("institution");

  if (!adminUser || !adminUser.institution) {
    return res.status(404).json({ success: false, message: "Institution not found." });
  }
  const institutionId = adminUser.institution.toString();

  const cachedStatus = await RedisUtil.get(`sub_status:${institutionId}`);
  if (cachedStatus) {
    return res.status(200).json({ success: true, message: cachedStatus, source: 'cache' });
  }

  const subscription = await Subscription.findOne(
    { institution: institutionId },
    'status'
  ).lean();

  const status = subscription ? subscription.status : "pending";

  await RedisUtil.setex(`sub_status:${institutionId}`, 3600, status);

  return res.status(200).json({ success: true, message: status, source: 'db' });
});