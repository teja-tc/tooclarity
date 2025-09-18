
import Joi from "joi";
import {
  phoneRule,
  pincodeRule,
  addressRule,
} from "./ValidationRules";

export const L1Schema = Joi.object({
  instituteType: Joi.string()
    .valid(
      "Kindergarten/childcare center",
      "School's",
      "Intermediate college(K12)",
      "Under Graduation/Post Graduation",
      "Coaching centers",
      "Study Halls",
      "Tution Center's",
      "Study Abroad"
    )
    .empty("")
    .required()
    .messages({
      "any.required": "Institute Type is required",
      "any.only": "Please select a valid Institute Type",
    }),
    
  instituteName: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[A-Za-z][A-Za-z\s.&'-]*$/)
    .required()
    .messages({
      "string.empty": "Institute Name is required",
      "string.min": "Institute Name must be at least 3 characters",
      "string.max": "Institute Name must be at most 100 characters",
      "string.pattern.base":
        "Institute Name must start with a letter and can only contain letters, numbers, spaces, . & ' -",
    }),

  approvedBy: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[A-Za-z][A-Za-z\s.&'-]*$/)
    .required()
    .messages({
      "string.empty": "Approved By is required",
      "string.min": "Approved By must be at least 2 characters",
      "string.max": "Approved By must be at most 100 characters",
      "string.pattern.base":
        "Approved By must start with a letter and can only contain letters, spaces, . & ' -",
    }),

  establishmentDate: Joi.when("instituteType", {
    is: "Study Halls",
    then: Joi.string().allow("").optional(),
    otherwise: Joi.string()
      .custom((value, helpers) => {
        if (!value) return helpers.error("any.required");
        const enteredDate = new Date(value);
        if (isNaN(enteredDate.getTime())) return helpers.error("date.invalid");
        return value;
      })
      .messages({
        "any.required": "Establishment Date is required",
        "date.invalid": "Establishment Date must be a valid date",
      }),
  }),

  // ✅ Contact fields using phoneRule
  contactInfo: phoneRule.required().messages({
    "any.required": "Contact Info is required",
  }),
  additionalContactInfo: phoneRule.allow("").messages({
    "string.pattern.base": "Please enter a valid Additional Contact number",
  }),

  headquartersAddress: addressRule.required(),
  state: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z][A-Za-z\s]*$/)
    .required()
    .messages({
      "string.empty": "State is required",
      "string.min": "State must be at least 2 characters long",
      "string.pattern.base": "State name should only include alphabets and spaces",
    }),
  pincode: pincodeRule.required(),
  locationURL: Joi.string()
    .pattern(/^https?:\/\/.+$/)
    .required()
    .messages({
      "string.empty": "Location URL is required",
      "string.pattern.base": "Please enter a valid URL (must start with http:// or https://)",
    }),
});
