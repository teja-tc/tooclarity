import Joi from "joi";
import { alphaNumericNameRule } from "./ValidationRules";
import {
  phoneRule,
  pincodeRule,
  urlRule,
  nameRule,
  stateRule,
  createdBranchRule,
  categoriesTypeRule,
  graduationTypeRule,
  streamTypeRule,
  selectBranchRule,
  domainTypeRule,
  durationRule
} from "./ValidationRules";
import {
  branchNameRule,
  branchPhoneRule,
  branchUrlRule,
  addressRule,
} from "./ValidationRules";

// ✅ Common base
export const baseCourseSchema = Joi.object({
  courseName: nameRule.required(),
  aboutCourse: Joi.string().min(10).max(500).required().messages({
    "string.empty": "About Course is required",
    "string.min": "About Course must be at least 10 characters",
    "string.max": "About Course must be at most 500 characters",
  }),
  courseDuration: durationRule, 
  priceOfCourse: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  location: urlRule.required(),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "any.only": "Mode must be Offline, Online, or Hybrid",
    "string.empty": "Mode is required",
  }),
  createdBranch: createdBranchRule, 
});

// ✅ Coaching Centers
// export const CoachingCenterSchema = baseCourseSchema.keys({
//    categoriesType: categoriesTypeRule,
//   domainType: domainTypeRule,
//   classSize: Joi.number().required(),
// });
// 2. Create the `baseCourseSchema` from the plain object.
// export const baseCourseSchema = Joi.object(baseCourseRules);
export const CoachingCenterSchema = Joi.object({
  // --- Rules copied from baseCourseSchema (except aboutCourse) ---
  courseName: nameRule.required(),
  courseDuration: durationRule,
  priceOfCourse: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  location: urlRule.required(),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "any.only": "Mode must be Offline, Online, or Hybrid",
    "string.empty": "Mode is required",
  }),
  createdBranch: createdBranchRule,
  
  // --- Coaching-specific rules ---
  categoriesType: categoriesTypeRule,
  domainType: domainTypeRule,
  classSize: Joi.number().required(),
});

// ✅ Study Halls
// export const StudyHallSchema = baseCourseSchema.keys({
//   seatingOption: nameRule.required(),
//   openingTime: Joi.string().required(),
//   closingTime: Joi.string().required(),
//   totalSeats: Joi.number().required(),
//   availableSeats: Joi.number().required(),
//   pricePerSeat: Joi.number().required(),
//   hasWifi: Joi.boolean(),
//   hasChargingPoints: Joi.boolean(),
//   hasAC: Joi.boolean(),
//   hasPersonalLocker: Joi.boolean(),
// });
// In your L2Schema.ts file

export const StudyHallSchema = Joi.object({
  // This schema is now self-contained and does not inherit from baseCourseSchema
  
  seatingOption: nameRule.required().messages({
    "string.empty": "Please select a seating option.",
    "any.required": "Please select a seating option.",
  }),

  openingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid time (HH:MM).",
      "string.empty": "Opening Time is required.",
      "any.required": "Opening Time is required.",
    }),

  closingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid time (HH:MM).",
      "string.empty": "Closing Time is required.",
      "any.required": "Closing Time is required.",
    }),

  operationalDays: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one operational day must be selected.",
    "any.required": "At least one operational day must be selected.",
  }),

  totalSeats: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Total Seats cannot be negative.",
    "any.required": "Total Seats is required.",
  }),

  availableSeats: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Total Seats cannot be negative.",
    "any.required": "Total Seats is required.",
  }),

  pricePerSeat: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price Per Seat is required.",
  }),

  // Boolean fields should be explicitly required as the user must select one
  // ✅ Add .allow(null) to each boolean validation rule
  hasWifi: Joi.boolean().allow(null).required().messages({
    "any.required": "Please select an option for Wi-Fi.",
  }),
  hasChargingPoints: Joi.boolean().allow(null).required().messages({
    "any.required": "Please select an option for Charging Points.",
  }),
  hasAC: Joi.boolean().allow(null).required().messages({
    "any.required": "Please select an option for Air Conditioner.",
  }),
  hasPersonalLocker: Joi.boolean().allow(null).required().messages({
    "any.required": "Please select an option for Personal Lockers.",
  }),
  image: Joi.any().optional(),
  createdBranch: createdBranchRule,
});

// ✅ Tuition Centers
// export const TuitionCenterSchema = baseCourseSchema.keys({
//   tuitionType: nameRule.required(),
//   instructorProfile: nameRule.required(),
//   subject: nameRule.required(),
//   totalSeats: Joi.number().required(),
//   availableSeats: Joi.number().required(),
//   openingTime: Joi.string().required(),
//   closingTime: Joi.string().required(),
//   pricePerSeat: Joi.number().required(),
// });
// import Joi from "joi";
// Assuming baseCourseSchema and nameRule are defined elsewhere
// ✅ Corrected Tuition Centers Schema
export const TuitionCenterSchema = Joi.object({
  // This schema is now defined from scratch to match your form exactly.
  
  tuitionType: Joi.string()
    .valid("Home Tuition", "Center Tuition")
    .required()
    .messages({
      "string.empty": "Tuition Type is required.",
      "any.only": "Please select a valid Tuition Type.",
      "any.required": "Tuition Type is required.",
    }),

  instructorProfile: nameRule.required().messages({
    "string.empty": "Instructor Profile is required.",
    "any.required": "Instructor Profile is required.",
  }),

  subject: Joi.string()
    .pattern(/^[A-Za-z\s,]+$/)
    .required()
    .messages({
      "string.empty": "Subject is required.",
      "string.pattern.base": "Subject can only contain letters, spaces, and commas.",
      "any.required": "Subject is required.",
    }),

  totalSeats: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Total Seats cannot be negative.",
    "any.required": "Total Seats is required.",
  }),

  // ✅ Validation for available seats <= total seats is re-added
  availableSeats: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Avaible Seats cannot be negative.",
    "any.required": "Avaible Seats is required.",
  }),
  
  operationalDays: Joi.array().items(Joi.string()).min(1).required().messages({
      // ✅ Added custom messages for operational days
      "array.min": "At least one operational day must be selected.",
      "any.required": "At least one operational day must be selected.",
  }),

  // ✅ Improved time validation to check for HH:MM format
  openingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid time (HH:MM).",
      "string.empty": "Opening Time is required.",
      "any.required": "Opening Time is required.",
    }),

  closingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid time (HH:MM).",
      "string.empty": "Closing Time is required.",
      "any.required": "Closing Time is required.",
    }),

  pricePerSeat: Joi.number().min(0).required().messages({
    "number.base": "Value must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price Per Seat is required.",
  }),
  
  // You might need to add 'image' validation if it's required
  image: Joi.any().optional(), // Or .required() if needed

  // This field is used for associating with a branch
  createdBranch: createdBranchRule,
});


// ✅ UG/PG
// export const UGPGSchema = baseCourseSchema.keys({
//   graduationType: nameRule.required(),
//   streamType: nameRule.required(),
//  // selectBranch: nameRule.required(),
//   aboutBranch: Joi.string().allow(""),
//   educationType: Joi.string().valid("Full time", "part time", "Distance"),
//   classSize: Joi.number().required(),
// });

export const UGPGSchema = Joi.object({
  // This schema is now defined from scratch and does NOT inherit from baseCourseSchema.

  // --- Fields from your form ---
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
      "any.required": "Please select an education type.",
  }),

  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "string.empty": "Please select a mode.",
    "any.required": "Please select a mode.",
  }),

  courseDuration: durationRule,
  
  priceOfCourse: Joi.number().required().messages({
      "number.base": "Price must be a number.",
      "any.required": "Price is required.",
  }),
  
  classSize: Joi.number().required().messages({
    "number.base": "Class size must be a number.",
    "any.required": "Class size is required.",
  }),

  eligibilityCriteria: nameRule.messages({
    "string.empty": "Eligibility criteria is required.",
    "any.required": "Eligibility criteria is required.",
    "string.pattern.base": "Eligibility criteria Including at least one letter and can only include letters, numbers, spaces, . & ' -",
  }),
  createdBranch: createdBranchRule, 
});


// ✅ Branch Schema
export const branchSchema = Joi.object({
  branchName: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[A-Za-z][A-Za-z0-9\s.&'-]*$/)
    .required()
    .messages({
      "string.empty": "Branch Name is required",
      "string.min": "Branch Name must be at least 3 characters",
      "string.max": "Branch Name must be at most 100 characters",
      "string.pattern.base":
        "Branch Name must start with a letter and may include numbers, spaces, and . & ' -",
    }),

  contactInfo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Contact info is required",
      "string.pattern.base":
        "Contact info must be a valid 10-digit mobile number",
    }),

  branchAddress: Joi.string().min(5).required().messages({
    "string.empty": "Branch Address is required",
    "string.min": "Branch Address must be at least 5 characters",
  }),

  locationUrl: Joi.string().uri().required().messages({
    "string.empty": "Location URL is required",
    "string.uri": "Must be a valid URL (e.g., https://...)",
  }),
});

// export const BranchSchema = Joi.object({
//   branchName: alphaNumericNameRule.messages({
//     "string.empty": "Branch Name is required",
//     "string.pattern.base":
//       "Branch Name must start with a letter or number, contain at least one letter, and can only include letters, numbers, spaces, . & ' -",
//   }),
//   branchAddress: addressRule.required().messages({
//     "any.required": "Branch Address is required",
//     "string.empty": "Branch Address cannot be empty",
//   }),
//   contactInfo: branchPhoneRule.required().messages({
//     "any.required": "Contact number is required",
//     "string.empty": "Contact number cannot be empty",
//     "string.pattern.base": "Contact number must be 10 digits",
//   }),
//   contactCountryCode: Joi.string().required().messages({
//     "any.required": "Country code is required",
//     "string.empty": "Country code cannot be empty",
//   }),
//   locationUrl: branchUrlRule.required().messages({
//     "any.required": "Location URL is required",
//     "string.empty": "Location URL cannot be empty",
//     "string.uri": "Location URL must be valid",
//   }),
// }).strict();

// ✅ Export all schemas in one place


// L2Schema.tsx
export const L2Schemas: Record<string, Joi.ObjectSchema> = {
  basic: baseCourseSchema,
  coaching: CoachingCenterSchema,
  studyHall: StudyHallSchema,
  tuition: TuitionCenterSchema,
  ugpg: UGPGSchema,
  branch: branchSchema,
};
