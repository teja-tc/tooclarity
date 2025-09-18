
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


// Phone number validation (exactly 10 digits)
export const phoneRule = Joi.string()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be exactly 10 digits",
    "any.required": "Phone number is required",
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
  .uri({ scheme: [/https?/] })
  .required()
  .messages({
    "string.empty": "URL is required",
    "string.uri": "Enter a valid URL starting with http:// or https://",
    "any.required": "URL is required",
  });

// -----------------------------
// Branch-specific reusable rules
// -----------------------------
export const branchNameRule = alphaNumericNameRule; // letters, numbers, spaces
export const branchPhoneRule = phoneRule;           // reuse phoneRule
export const branchUrlRule = urlRule;              // reuse urlRule
