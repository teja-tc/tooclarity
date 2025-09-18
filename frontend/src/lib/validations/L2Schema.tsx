import Joi from "joi";
import { alphaNumericNameRule } from "./ValidationRules";
import {
  urlRule,
  nameRule,
} from "./ValidationRules";

// ✅ Common base
export const baseCourseSchema = Joi.object({
  courseName: nameRule.required(),
  aboutCourse: Joi.string().min(10).max(500).required().messages({
    "string.empty": "About Course is required",
    "string.min": "About Course must be at least 10 characters",
    "string.max": "About Course must be at most 500 characters",
  }),
  courseDuration: Joi.string().required().messages({
    "string.empty": "Course duration is required",
  }),
  priceOfCourse: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  location: urlRule.required(),
  mode: Joi.string().valid("Offline", "Online", "Hybrid").required().messages({
    "any.only": "Mode must be Offline, Online, or Hybrid",
    "string.empty": "Mode is required",
  }),
});

// ✅ Coaching Centers
export const CoachingCenterSchema = baseCourseSchema.keys({
  categoriesType: alphaNumericNameRule.required(),
  domainType: nameRule.required(),
  classSize: Joi.number().required(),
});

// ✅ Study Halls
export const StudyHallSchema = baseCourseSchema.keys({
  seatingOption: nameRule.required(),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
  totalSeats: Joi.number().required(),
  availableSeats: Joi.number().required(),
  pricePerSeat: Joi.number().required(),
  hasWifi: Joi.boolean(),
  hasChargingPoints: Joi.boolean(),
  hasAC: Joi.boolean(),
  hasPersonalLocker: Joi.boolean(),
});

// ✅ Tuition Centers
export const TuitionCenterSchema = baseCourseSchema.keys({
  tuitionType: nameRule.required(),
  instructorProfile: nameRule.required(),
  subject: nameRule.required(),
  totalSeats: Joi.number().required(),
  availableSeats: Joi.number().required(),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
  pricePerSeat: Joi.number().required(),
});

// ✅ UG/PG
export const UGPGSchema = baseCourseSchema.keys({
  graduationType: nameRule.required(),
  streamType: nameRule.required(),
  selectBranch: nameRule.required(),
  aboutBranch: Joi.string().allow(""),
  educationType: Joi.string().valid("Full time", "part time", "Distance"),
  classSize: Joi.number().required(),
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

// L2Schema.tsx
export const L2Schemas: Record<string, Joi.ObjectSchema> = {
  basic: baseCourseSchema,
  coaching: CoachingCenterSchema,
  studyHall: StudyHallSchema,
  tuition: TuitionCenterSchema,
  ugpg: UGPGSchema,
  branch: branchSchema,
};
