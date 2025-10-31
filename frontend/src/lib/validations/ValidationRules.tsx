
import Joi from "joi";

export const alphaNumericNameRule = Joi.string()
  .min(3)
  .max(100)
  .pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s.&'-]+$/) // must contain at least one letter
  .required()
  .messages({
    "string.empty": "Branch Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 100 characters",
    "string.pattern.base":
      "Branch Name must contain at least one letter and can only include letters, numbers, spaces, . & ' -",
  });

  
export const nameRule = Joi.string()
  .pattern(/^(?!\d+$)[A-Za-z][A-Za-z\s.&'-]*$/) // no numbers-only, must start with a letter
  .min(3)
  .max(100)
  .required()
  .messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 100 characters",
    "string.pattern.base":
      "Name must start with a letter and can only contain letters, spaces, dots, apostrophes, ampersands, or hyphens (not numbers only)",
  });

export const addressRule = Joi.string()
  .min(5)
  .max(200)
  .pattern(/^(?!\d+$)[A-Za-z0-9\s,.-/]*$/) // not only numbers, allow letters, digits, spaces, , . - /
  .required()
  .messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 200 characters",
    "string.pattern.base": "Address must not be only numbers and can include letters, numbers, spaces, , . - /",
  });


  // A specific rule for the categories type dropdown
// A specific rule for the categories type dropdown
export const categoriesTypeRule = Joi.string()
    .valid(
        "Academic",
        "Competitive Exam",
        "Professional",
        "Skill Development",
        "Language",
        "Arts & Crafts",
        "Sports",
        "Music & Dance"
    )
    .required()
    .messages({
        "string.empty": "Please select a categories type.",
        "any.required": "Please select a categories type.",
        "any.only": "Please select a valid categories type from the list."
    });

// A specific rule for the domain type dropdown
export const domainTypeRule = Joi.string()
    .valid(
        "Engineering",
        "Medical",
        "Management",
        "Law",
        "Banking",
        "Government Jobs",
        "IT & Software",
        "Design",
        "Marketing",
        "Finance"
    )
    .required()
    .messages({
        "string.empty": "Please select a domain type.",
        "any.required": "Please select a domain type.",
        "any.only": "Please select a valid domain type from the list."
    });

export const subDomainTypeRule = Joi.string()
    .valid(
        "Engineering",
        "Medical",
        "Management",
        "Law",
        "Banking",
        "Government Jobs",
        "IT & Software",
        "Design",
        "Marketing",
        "Finance"
    )
    .required()
    .messages({
        "string.empty": "Please select a subDomain type.",
        "any.required": "Please select a subDomain type.",
        "any.only": "Please select a valid subDomain type from the list."
    });

export const courseHighlightsRule = Joi.string()
    .min(3)
    .max(200)
    .pattern(/^(?=.*[A-Za-z])[A-Za-z0-9\s.&'-,]+$/) // must contain at least one letter
    .required()
    .messages({
      "string.empty": "Course Highlights is required",
      "string.min": "Course Highlights must be at least 3 characters",
      "string.max": "Course Highlights must be at most 200 characters",
      "string.pattern.base":
        "Course Highlights must contain at least one letter and can only include letters, numbers, spaces, . & ' - ,",
    });
  // In ValidationRules.ts

export const durationRule = Joi.string()
  .min(5)
  .max(20)
  .pattern(/^\d+ (year|month|week|day)s?$/i)
  .required()
  .messages({
    "string.empty": "Course duration is required",
    // ✅ ADD THIS LINE to customize the minimum length error message
    "string.min": "Course duration is too short, use a valid format like '6 months or 1 year'",
    "string.max": "Course duration is too long",
    "string.pattern.base": "Duration must be in a format like '6 months' or '1 year'",
    "any.required": "Course duration is required",
  });
// Phone number validation (exactly 10 digits)
export const phoneRule = Joi.string()
  // This new pattern ensures the first digit is 6, 7, 8, or 9
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    "string.empty": "Phone number is required.",
    "string.pattern.base": "Please enter a valid 10-digit Indian mobile number.",
    "any.required": "Phone number is required.",
  });

// Pincode validation (6 digits)
export const pincodeRule = Joi.string()
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    "string.empty": "Pincode is required",
    "string.pattern.base": "Pincode must be exactly 6 digits",
    "any.required": "Pincode is required",
  });

// State validation
export const stateRule = Joi.string()
  .min(2)
  .max(50)
  .required()
  .messages({
    "string.empty": "State is required",
    "string.min": "State must be at least 2 characters",
    "string.max": "State cannot exceed 50 characters",
    "any.required": "State is required",
  });

// URL validation (must start with http:// or https://)
export const urlRule = Joi.string()
  .pattern(/^https?:\/\/.+/) // This checks for "http://" or "https://"
  .required()
  .messages({
    'string.empty': 'URL is required',
    // ✅ This line provides the custom error message for the pattern
    'string.pattern.base': 'URL must start with http:// or https://', 
    'any.required': 'URL is required',
  });

  export const createdBranchRule = Joi.string().required().messages({
  "string.empty": "Please select a branch for the course.",
  "any.required": "Please select a branch for the course.",
});

// ✅ Rule for Graduation Type dropdown
export const graduationTypeRule = Joi.string().required().messages({
  "string.empty": "Please select a graduation type.",
  "any.required": "Please select a graduation type.",
});

// ✅ Rule for Stream Type dropdown
export const streamTypeRule = Joi.string().required().messages({
  "string.empty": "Please select a stream type.",
  "any.required": "Please select a stream type.",
});

// ✅ Rule for the 'Select branch' dropdown in the UG/PG form
export const selectBranchRule = Joi.string().required().messages({
  "string.empty": "Please select a branch.",
  "any.required": "Please select a branch.",
});
// -----------------------------
// Branch-specific reusable rules
// -----------------------------
export const branchNameRule = alphaNumericNameRule; // letters, numbers, spaces
export const branchPhoneRule = phoneRule;           // reuse phoneRule
export const branchUrlRule = urlRule;              // reuse urlRule
