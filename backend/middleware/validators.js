const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }
    next();
};

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
    body('designation').notEmpty().withMessage('Designation is required').trim().escape(),
    body('linkedinUrl').optional({ checkFalsy: true }).isURL().withMessage('Invalid LinkedIn URL').trim(),
    handleValidationErrors,
];

exports.validateLogin = [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
];

exports.validateInstitutionCreation = [
    body('name').notEmpty().withMessage('Institution name is required').trim().escape(),
    body('instituteType').isIn([
        'Kindergarten/childcare center', 'School', 'Intermediate college(K12)', 'UG / PG University', 'Coaching centers', 'Study halls', 'Study Abroad'
    ]).withMessage('Invalid institute type'),
    body('establishmentDate').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('locationUrl').optional({ checkFalsy: true }).isURL().withMessage('Invalid Location URL'),
    body('approvedBy').optional().trim().escape(),
    body('contactInfo').optional().trim().escape(),
    body('headquartersAddress').optional().trim().escape(),
    handleValidationErrors,
]

exports.validateBranchCreation = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    body('branchName').trim().notEmpty().withMessage('Branch name is required.').isLength({ max: 100 }),
    body('contactInfo.number').trim().notEmpty().isMobilePhone('en-IN').withMessage('A valid contact number is required.'),
    body('branchAddress').trim().notEmpty().withMessage('Branch address is required.').isLength({ max: 255 }),
    body('locationUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.'),
];

exports.validateBranchUpdate = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    param('branchId').isMongoId().withMessage('Invalid branch ID.'),
    
    body('branchName').optional().trim().notEmpty().withMessage('Branch name cannot be empty.').isLength({ max: 100 }),
    body('contactInfo.number').optional().trim().notEmpty().isMobilePhone('en-IN').withMessage('A valid contact number is required.'),
    body('branchAddress').optional().trim().notEmpty().withMessage('Branch address cannot be empty.').isLength({ max: 255 }),
    body('locationUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.'),
];

exports.validateCourseCreation = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    body('courseName').trim().notEmpty().withMessage('Course name is required.').isLength({ max: 150 }),
    body('aboutCourse').trim().notEmpty().withMessage('About course is required.').isLength({ max: 2000 }),
    body('courseDuration').trim().notEmpty().withMessage('Course duration is required.').isLength({ max: 50 }),
    body('mode').isIn(['Offline', 'Online', 'Hybrid']).withMessage('Invalid mode specified.'),
    body('priceOfCourse').isNumeric().withMessage('Price must be a number.').custom(val => val >= 0).withMessage('Price cannot be negative.'),
    body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 100 }),
];

exports.validateCourseUpdate = [
    param('institutionId').isMongoId().withMessage('Invalid institution ID.'),
    param('courseId').isMongoId().withMessage('Invalid course ID.'),
    body('courseName').optional().trim().notEmpty().withMessage('Course name cannot be empty').isLength({ max: 150 }),
    body('aboutCourse').optional().trim().notEmpty().withMessage('About course cannot be empty').isLength({ max: 2000 }),
    body('courseDuration').optional().trim().notEmpty().withMessage('Duration cannot be empty').isLength({ max: 50 }),
    body('mode').optional().isIn(['Offline', 'Online', 'Hybrid']).withMessage('Invalid mode specified.'),
    body('priceOfCourse').optional().isNumeric().withMessage('Price must be a number.').custom(val => {
        if (val < 0) {
            throw new Error('Price cannot be negative.');
        }
        return true;
    }),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty').isLength({ max: 100 }),
];