const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()}); // 422 Unprocessable Entity
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