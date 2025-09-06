const Course = require("../models/Course");
const { Institution } = require("../models/Institution");
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const { uploadStream } = require("../services/upload.service");

const checkOwnership = async (institutionId, userId) => {
  const institution = await Institution.findById(institutionId);
  if (!institution) {
    throw new AppError("No institution found with that ID", 404);
  }
  if (institution.owner.toString() !== userId) {
    throw new AppError(
      "You are not authorized to perform this action for this institution",
      403
    );
  }
  return institution;
};

exports.createCourse = asyncHandler(async (req, res, next) => {
  const { institutionId } = req.params;

  // Ensure the user owns the institution
  await checkOwnership(institutionId, req.userId);

  const { courses, totalCourses } = req.body;

  if (!totalCourses || !Array.isArray(courses) || courses.length < 1) {
    return next(new AppError("No courses provided", 400));
  }

  // Add institutionId and defaults to each course object
  const coursesToInsert = courses.map((course) => ({
    ...course,
    institution: institutionId,
    image: course.image || "",
    brochure: course.brochure || "",
  }));

  // Insert all courses at once
  const createdCourses = await Course.insertMany(coursesToInsert);

  res.status(201).json({
    success: true,
    count: createdCourses.length,
    data: createdCourses,
  });
});

exports.getAllCoursesForInstitution = asyncHandler(async (req, res, next) => {
  const { institutionId } = req.params;

  await checkOwnership(institutionId, req.user.id);

  const courses = await Course.find({ institution: institutionId });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const { institutionId, courseId } = req.params;
  await checkOwnership(institutionId, req.user.id);

  const course = await Course.findById(courseId);

  if (!course || course.institution.toString() !== institutionId) {
    return next(
      new AppError(
        "Course not found or does not belong to this institution",
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { institutionId, courseId } = req.params;
  await checkOwnership(institutionId, req.user.id);

  let course = await Course.findById(courseId);
  if (!course || course.institution.toString() !== institutionId) {
    return next(
      new AppError(
        "Course not found or does not belong to this institution",
        404
      )
    );
  }

  const updateData = { ...req.body };
  const folderPath = `tco_clarity/courses/${institutionId}`;

  if (req.files) {
    const uploadPromises = [];
    if (req.files.image) {
      uploadPromises.push(
        uploadStream(req.files.image[0].buffer, {
          folder: `${folderPath}/images`,
          resource_type: "image",
        }).then((result) => (updateData.image = result.secure_url))
      );
    }
    if (req.files.brochure) {
      uploadPromises.push(
        uploadStream(req.files.brochure[0].buffer, {
          folder: `${folderPath}/brochures`,
          resource_type: "auto",
        }).then((result) => (updateData.brochure = result.secure_url))
      );
    }
    await Promise.all(uploadPromises);
  }

  const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedCourse,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { institutionId, courseId } = req.params;

  await checkOwnership(institutionId, req.user.id);

  const course = await Course.findById(courseId);
  if (!course || course.institution.toString() !== institutionId) {
    return next(
      new AppError(
        "Course not found or does not belong to this institution",
        404
      )
    );
  }

  await course.remove();

  res.status(204).json({
    success: true,
    data: {},
  });
});
