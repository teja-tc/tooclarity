const { body, param, validationResult } = require('express-validator');
const { Institution } = require('../models/Institution');
const logger = require('../config/logger');

// --- UTILITY FUNCTION ---
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

// --- AUTH VALIDATORS ---
const strongPasswordOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
};

exports.validateRegistration = [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('password').isStrongPassword(strongPasswordOptions).withMessage('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a symbol.'),
    // body('contactNumber').isMobilePhone('any', { strictMode: true }).withMessage('A valid 10-digit contact number is required.'),
    body('contactNumber')
  .matches(/^[0-9]{10}$/)
  .withMessage('A valid 10-digit contact number is required.'),

    body('designation').notEmpty().withMessage('Designation is required').trim().escape(),
    body('linkedinUrl').optional({ checkFalsy: true }).isURL().withMessage('Invalid LinkedIn URL').trim(),
    handleValidationErrors,
];

exports.validateLogin = [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
];


// --- L1 INSTITUTION VALIDATOR ---
exports.validateL1Creation = [
    body('instituteName').notEmpty().withMessage('Institution name is required').trim().isLength({ max: 150 }).escape(),
    body('instituteType').isIn([
        'Kindergarten/childcare center', "School's", 'Intermediate college(K12)', 'Under Graduation/Post Graduation', 'Coaching centers',"Tution Center's", 'Study Halls', 'Study Abroad'

    ]).withMessage('A valid institute type is required.'),
    // body('establishmentDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Establishment date must be a valid date.'),
    body('approvedBy').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).escape(),
    handleValidationErrors,
];


// --- L2 INSTITUTION VALIDATOR---
const kindergartenL2Rules = [
    body('schoolType').isIn(['Public', 'Private (For-profit)', 'Private (Non-profit)', 'International', 'Home - based']).withMessage('Invalid school type.'),
    body('curriculumType').trim().notEmpty().withMessage('Curriculum type is required.').isLength({ max: 100 }).escape(),
    body('operationalDays').isArray({ min: 1 }).withMessage('At least one operational day is required.'),
    body('operationalDays.*').isIn(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']),
];

const schoolRules = [
    // body('schoolType').trim().toLowerCase().isIn(['co-ed', 'boys only', 'girls only']).withMessage('Invalid school type.'),
    body('schoolType').trim().isIn(['Co-ed', 'Boys Only', 'Girls Only']).withMessage('Invalid school type.'),   
   // body('schoolType').trim().isIn(['Co-ed', 'Boys Only', 'Girls Only']).withMessage('Invalid school type.'),
    body('schoolCategory').isIn(['Public', 'Private', 'Charter', 'International']).withMessage('Invalid school category.'),
    body('curriculumType').isIn(['State Board', 'CBSE', 'ICSE', 'IB', 'IGCSE']).withMessage('Invalid curriculum type.'),
    body('operationalDays').isArray({ min: 1 }).withMessage('At least one operational day is required.'),
    body('operationalDays.*').isIn(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']),
    body('otherActivities').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).escape(),
    body('hostelFacility').isBoolean().withMessage('Hostel facility must be true or false.'),
    body('playground').isBoolean().withMessage('Playground must be true or false.'),
    body('busService').isBoolean().withMessage('Bus service must be true or false.'),
];

const intermediateCollegeL2Rules = [
  body('collegeType')
    .isIn(['Junior College', 'Senior Secondary', 'Higher Secondary', 'Intermediate', 'Pre-University'])
    .withMessage('Invalid college type.'),

  body('collegeCategory')
    .isIn(['Government', 'Semi-Government', 'Private', 'Aided', 'Unaided'])
    .withMessage('Invalid college category.'),

  body('curriculumType')
    .isIn(['State Board', 'CBSE', 'ICSE', 'IB', 'Cambridge', 'Other'])
    .withMessage('Invalid curriculum type.'),

  body('operationalDays')
    .isArray({ min: 1 })
    .withMessage('At least one operational day is required.'),

  body('operationalDays.*')
    .isIn(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'])
    .withMessage('Invalid operational day.'),

  body('otherActivities')
    .trim()
    .notEmpty()
    .withMessage('Other activities are required.')
    .isLength({ max: 500 })
    .escape(),

  body('hostelFacility')
    .isBoolean()
    .withMessage('Hostel facility must be true or false.'),

  body('playground')
    .isBoolean()
    .withMessage('Playground must be true or false.'),

  body('busService')
    .isBoolean()
    .withMessage('Bus service must be true or false.'),
];


const ugPgUniversityL2Rules = [
    body('ownershipType').isIn(['Government', 'Private', 'Public-Private Partnership']).withMessage('Invalid ownership type.'),
    body('collegeCategory').isIn(['Engineering', 'Medical', 'Arts & Science', 'Management', 'Law']).withMessage('Invalid college category.'),
    body('affiliationType').trim().notEmpty().withMessage('Affiliation type is required.').isLength({ max: 100 }).escape(),
    body('placements.placementDrives').optional().isBoolean(),
    body('placements.mockInterviews').optional().isBoolean(),
    body('placements.resumeBuilding').optional().isBoolean(),
];


const coachingCenterL2Rules = [
  body('placementDrives')
    .notEmpty().withMessage('placementDrives is required')
    .isBoolean().withMessage('placementDrives must be true or false'),

  body('mockInterviews')
    .notEmpty().withMessage('mockInterviews is required')
    .isBoolean().withMessage('mockInterviews must be true or false'),

  body('resumeBuilding')
    .notEmpty().withMessage('resumeBuilding is required')
    .isBoolean().withMessage('resumeBuilding must be true or false'),

  body('linkedinOptimization')
    .notEmpty().withMessage('linkedinOptimization is required')
    .isBoolean().withMessage('linkedinOptimization must be true or false'),

  body('exclusiveJobPortal')
    .notEmpty().withMessage('exclusiveJobPortal is required')
    .isBoolean().withMessage('exclusiveJobPortal must be true or false'),

  body('certification')
    .notEmpty().withMessage('certification is required')
    .isBoolean().withMessage('certification must be true or false'),
];


exports.validateL2Update = async (req, res, next) => {
    try {
        console.log("in l2UpdateValidators")
        const userId = req.userId;
        // const institution = await Institution.findById(req.user.institution);
        const institution = await Institution.findOne({ owner: userId });
        if (!institution) {
            logger.warn({ userId: req.userId }, 'Attempted L2 update for a non-existent institution.');
            return res.status(404).json({ status: 'fail', message: 'Institution not found for the logged-in user.' });
        }

        let validationChain = [];
        console.log("for type of "+institution.instituteType)
        switch (institution.instituteType) {
            case 'Kindergarten/childcare center': validationChain = kindergartenL2Rules; break;
            case "School's": validationChain=schoolRules; break;
            case 'Intermediate college(K12)': validationChain = intermediateCollegeL2Rules; break;
            case 'Under Graduation/Post Graduation': validationChain = ugPgUniversityL2Rules; break;
            case 'Study Abroad': return next();
            case 'Coaching centers': validationChain = coachingCenterL2Rules;break;
            case "Tution Center's" : return next();
            case 'Study Halls': return next();

            default:
                logger.error({ userId: req.userId, instituteType: institution.instituteType }, 'Unsupported institution type for L2 update.');
                return res.status(400).json({ status: 'fail', message: 'Unsupported institution type for L2 update.' });
        }

        // Run the selected validation chain
        await Promise.all(validationChain.map(validation => validation.run(req)));
        
        // Handle the results
        handleValidationErrors(req, res, next);

    } catch (error) {
        next(error);
    }
};


// --- BRANCH VALIDATORS ---
exports.validateBranchCreation = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    body('branchName').trim().notEmpty().withMessage('Branch name is required.').isLength({ max: 100 }),
    body('contactInfo.countryCode').optional().trim(),
    body('contactInfo.number').trim().notEmpty().matches(/^\d{10}$/).withMessage('A valid 10-digit contact number is required.'),
    body('branchAddress').trim().notEmpty().withMessage('Branch address is required.').isLength({ max: 255 }),
    body('locationUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.'),
    handleValidationErrors,
];

exports.validateBranchUpdate = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    param('branchId').isMongoId().withMessage('Invalid branch ID.'),
    body('branchName').optional().trim().notEmpty().withMessage('Branch name cannot be empty.').isLength({ max: 100 }),
    body('contactInfo.number').optional().trim().notEmpty().matches(/^\d{10}$/).withMessage('A valid 10-digit contact number is required.'),
    body('branchAddress').optional().trim().notEmpty().withMessage('Branch address cannot be empty.').isLength({ max: 255 }),
    body('locationUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.'),
    handleValidationErrors,
];


// --- COURSE VALIDATORS---
exports.validateCourseCreation = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    body('courseName').trim().notEmpty().withMessage('Course name is required.').isLength({ max: 150 }),
    body('aboutCourse').trim().notEmpty().withMessage('About course is required.').isLength({ max: 2000 }),
    body('courseDuration').trim().notEmpty().withMessage('Course duration is required.').isLength({ max: 50 }),
    body('mode').isIn(['Offline', 'Online', 'Hybrid']).withMessage('Invalid mode specified.'),
    body('priceOfCourse').isNumeric().withMessage('Price must be a number.').custom(val => val >= 0).withMessage('Price cannot be negative.'),
    body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 100 }),
    handleValidationErrors,
];

exports.validateCourseUpdate = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    param('courseId').isMongoId().withMessage('Invalid course ID.'),
    body('courseName').optional().trim().notEmpty().withMessage('Course name cannot be empty').isLength({ max: 150 }),
    body('aboutCourse').optional().trim().notEmpty().withMessage('About course cannot be empty').isLength({ max: 2000 }),
    handleValidationErrors,
];