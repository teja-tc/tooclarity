const Course = require("../models/Course");
const Subscription = require("../models/Subscription");
const asyncHandler = require("express-async-handler");

exports.getAllVisibleCourses = asyncHandler(async (req, res, next) => {
  // 1. Find all active subscriptions
  const activeSubscriptions = await Subscription.find({
    status: "active",
    endDate: { $gt: new Date() }, // Ensure subscription is not expired
  }).select("institution");

  const activeInstitutionIds = activeSubscriptions.map(sub => sub.institution);

  // 2. Find all courses that belong to these institutions
  const courses = await Course.find({
    institution: { $in: activeInstitutionIds },
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});