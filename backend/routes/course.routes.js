const express = require('express');
const courseController = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateCourseCreation, validateCourseUpdate } = require('../middleware/validators');
const { uploadCourseFiles } = require('../middleware/fileUpload.middleware'); 

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
    .post(
        uploadCourseFiles, // 1. Handle file uploads first
        validateCourseCreation, // 2. Then validate the rest of the body
        courseController.createCourse
    )
    .get(courseController.getAllCoursesForInstitution);

router.route('/:courseId')
    .get(courseController.getCourseById)
    .put(
        uploadCourseFiles,
        validateCourseUpdate,
        courseController.updateCourse
    )
    .delete(courseController.deleteCourse);

module.exports = router;