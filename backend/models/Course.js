const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Course name is required.'],
        trim: true,
        maxlength: [150, 'Course name cannot exceed 150 characters.']
    },
    aboutCourse: {
        type: String,
        required: [true, 'About course information is required.'],
        trim: true,
        maxlength: [2000, 'About course cannot exceed 2000 characters.']
    },
    courseDuration: {
        type: String,
        required: [true, 'Course duration is required.'],
        trim: true,
        maxlength: [50, 'Course duration cannot exceed 50 characters.']
    },
    mode: {
        type: String,
        required: true,
        enum: ['Offline', 'Online', 'Hybrid'],
    },
    priceOfCourse: {
        type: Number,
        required: [true, 'Price of course is required.'],
        min: [0, 'Price cannot be negative.']
    },
    location: {
        type: String,
        required: [true, 'Location is required.'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters.']
    },
    image: {
        type: String, 
        required: [true, 'Course image is required.']
    },
    brochure: {
        type: String,
        required: [true, 'Course brochure is required.']
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
        index: true,
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;