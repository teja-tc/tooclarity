import Joi from "joi";
import { alphaNumericNameRule } from "./ValidationRules";
import {
  urlRule,
  nameRule,
  stateRule,
  createdBranchRule,
  categoriesTypeRule,
  graduationTypeRule,
  streamTypeRule,
  selectBranchRule,
  phoneRule,
  domainTypeRule,
  durationRule
} from "./ValidationRules";
import { StudyHallSchema,TuitionCenterSchema } from "./L2Schema";



const timeRule = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    "string.pattern.base": "Time must be in HH:MM (24-hour) format",
    "string.empty": "Time is required",
  });

export const operationalDaysOptions = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

// --- Schema 1: Base Course ---
export const baseCourseSchema = Joi.object({
   _id: Joi.string().optional().allow(null, ''), 
  courseName: nameRule.required(),
  aboutCourse: Joi.string().min(10).max(500).required().messages({
    "string.empty": "About Course is required",
    "string.min": "About Course must be at least 10 characters",
    "string.max": "About Course must be at most 500 characters",
  }),
  courseDuration: durationRule,
  priceOfCourse: Joi.number()
  .greater(0) // ensures value is > 0
  .required()
  .messages({
    "number.base": "Price must be a number",
    "number.greater": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  location: urlRule.required(),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "any.only": "Mode must be Offline, Online, or Hybrid",
    "string.empty": "Mode is required",
  }),
});

// --- Schema 2: Kindergarten Specifics ---
export const KindergartenSchema = Joi.object({
  schoolType: Joi.string()
    .valid("Public", "Private (For-profit)", "Private (Non-profit)", "International", "Home - based")
    .required()
    .messages({
      "any.only": "Invalid school type selected",
      "string.empty": "School type is required",
    }),
  curriculumType: Joi.string()
  .trim()
  .min(3)
  .max(100)
  .pattern(/^[A-Za-z\s]+$/) // Only letters and spaces
  .required()
  .messages({
    "string.empty": "Curriculum type is required",
    "string.min": "Curriculum type must be at least 3 characters",
    "string.max": "Curriculum type must not exceed 100 characters",
    "string.pattern.base": "Curriculum type must only contain letters and spaces",
  }),
  openingTime: timeRule,
  closingTime: timeRule,
  operationalDays: Joi.array()
    .items(Joi.string().valid(...operationalDaysOptions))
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one operational day",
      "any.required": "Operational days are required",
    }),
  extendedCare: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Extended Care",
      "string.empty": "Extended Care selection is required",
    }),
  mealsProvided: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Meals Provided",
      "string.empty": "Meals Provided selection is required",
    }),
  outdoorPlayArea: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Outdoor Play Area",
      "string.empty": "Outdoor Play Area selection is required",
    }),
});


export const schoolSchema = Joi.object({
  schoolType: Joi.string()
    .valid("Co-ed", "Boys Only", "Girls Only")
    .required()
    .messages({
      "any.only": "Invalid school type selected",
      "string.empty": "School type is required",
    }),
  schoolCategory: Joi.string()
    .valid("Public", "Private", "Charter", "International")
    .required()
    .messages({
      "any.only": "Invalid school category selected",
      "string.empty": "School category is required",
    }),
  curriculumType: Joi.string()
    .valid("State Board", "CBSE", "ICSE", "IB", "IGCSE")
    .required()
    .messages({
      "any.only": "Invalid curriculum type selected",
      "string.empty": "Curriculum type is required",
    }),
  operationalDays: Joi.array()
    .items(Joi.string().valid(...operationalDaysOptions))
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one operational day",
      "any.required": "Operational days are required",
    }),
  otherActivities: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      "string.empty": "Other activities is required",
      "string.min": "Other activities must not be empty",
      "string.max": "Other activities must not exceed 200 characters",
    }),
  hostelFacility: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Hostel facility must be Yes or No",
      "string.empty": "Hostel facility selection is required",
    }),
  playground: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Playground must be Yes or No",
      "string.empty": "Playground selection is required",
    }),
  busService: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Bus service must be Yes or No",
      "string.empty": "Bus service selection is required",
    }),
});

// ... (your existing Joi and other schemas)

// ✅ 1. ADD: The Joi schema for Intermediate College fields
export const intermediateCollegeSchema = Joi.object({
  collegeType: Joi.string().required(),
  collegeCategory: Joi.string().required(),
  curriculumType: Joi.string().required(),
  operationalDays: Joi.array().items(Joi.string()).min(1).required(),
  otherActivities: Joi.string().trim().max(200).allow(''),
  hostelFacility: Joi.string().valid("Yes", "No").required(),
  playground: Joi.string().valid("Yes", "No").required(),
  busService: Joi.string().valid("Yes", "No").required(),
});



export const combinedCoachingCenterSchema = Joi.object({
  // --- Section 1: Course Details Fields ---
  categoriesType: categoriesTypeRule,
  domainType: domainTypeRule,
  courseName: nameRule.required(),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "any.only": "Mode must be one of Offline, Online, or Hybrid",
    "string.empty": "Mode is required",
  }),
  courseDuration: durationRule.required(),
  priceOfCourse: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  location: urlRule.required(),
  classSize: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Class size must be a number",
      "number.positive": "Class size must be a positive number",
      "number.integer": "Class size must be a whole number",
      "any.required": "Class size is required",
    })
    .allow('')
    .custom((value, helpers) => {
      if (value === '') {
        return helpers.error('any.required');
      }
      return value;
    }),

  // --- Section 2: Institute Facilities & Placements Fields ---
  placementDrives: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for Placement Drives",
    "string.empty": "Placement Drives is required",
  }),
  mockInterviews: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for Mock Interviews",
    "string.empty": "Mock Interviews is required",
  }),
  resumeBuilding: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for Resume Building",
    "string.empty": "Resume Building is required",
  }),
  linkedinOptimization: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for LinkedIn Optimization",
    "string.empty": "LinkedIn Optimization is required",
  }),
  exclusiveJobPortal: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for Exclusive Job Portal access",
    "string.empty": "Exclusive Job Portal is required",
  }),
  certification: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select an option for Certification",
    "string.empty": "Certification is required",
  }),
});

// 1. Course-Specific Schema for UG/PG
export const UGPGSchema = Joi.object({
  graduationType: graduationTypeRule,
  streamType: streamTypeRule,
  selectBranch: selectBranchRule,
  aboutBranch: Joi.string().min(10).max(500).required().messages({
    "string.empty": "About branch is required.",
    "string.min": "About branch must be at least 10 characters.",
    "string.max": "About branch cannot exceed 500 characters.",
  }),
  educationType: Joi.string().valid("Full time", "part time", "Distance").required().messages({
    "string.empty": "Please select an education type.",
  }),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "string.empty": "Please select a mode.",
  }),
  courseDuration: durationRule.required(),
  priceOfCourse: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  classSize: Joi.number().positive().integer().required().messages({
    "number.base": "Class size must be a number.",
    "any.required": "Class size is required.",
  }),
  eligibilityCriteria: nameRule.required().messages({
    "string.empty": "Eligibility criteria is required.",
  }),
});

// 2. Institution-Specific Schema for UG/PG
export const UndergraduateSchema = Joi.object({
  ownershipType: Joi.string().valid("Government", "Private", "Semi-Government", "Aided", "Unaided").required(),
  collegeCategory: Joi.string().valid("Engineering", "Medical", "Arts & Science", "Commerce", "Management", "Law", "Other").required(),
  affiliationType: Joi.string().valid("University", "Autonomous", "Affiliated", "Deemed University", "Other").required(),
  placementDrives: Joi.string().valid("Yes", "No").required(),
  mockInterviews: Joi.string().valid("Yes", "No").required(),
  resumeBuilding: Joi.string().valid("Yes", "No").required(),
  linkedinOptimization: Joi.string().valid("Yes", "No").required(),
  exclusiveJobPortal: Joi.string().valid("Yes", "No").required(),
  library: Joi.string().valid("Yes", "No").required(),
  hostelFacility: Joi.string().valid("Yes", "No").required(),
  entranceExam: Joi.string().valid("Yes", "No").required(),
  managementQuota: Joi.string().valid("Yes", "No").required(),
  playground: Joi.string().valid("Yes", "No").required(),
  busService: Joi.string().valid("Yes", "No").required(),
});



// This is the new, updated way

// Create a version of the Study Hall schema that ignores 'createdBranch'
export const combinedStudyHallSchema = StudyHallSchema.keys({
    createdBranch: Joi.any().strip()
});

// Create a version of the Tuition Center schema that ignores 'createdBranch'
export const combinedTutionCenterSchema = TuitionCenterSchema.keys({
    createdBranch: Joi.any().strip()
});
// 3. The final combined schema
export const combinedUgPgSchema = UGPGSchema.concat(UndergraduateSchema);

// ✅ 2. ADD: The combined schema for a full Intermediate College program
export const combinedIntermediateCollegeSchema = baseCourseSchema.concat(intermediateCollegeSchema);
// ✅ 2. ADD: The combined schema for a full School program
export const combinedSchoolCourseSchema = baseCourseSchema.concat(schoolSchema);

export const combinedKindergartenCourseSchema = baseCourseSchema.concat(KindergartenSchema);