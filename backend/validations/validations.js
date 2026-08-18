import joi from "joi";

// Log in Validation
export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Add user Validation
export const addUserSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Create Parcel Validation
export const createParcelSchema = joi.object({
  senderName: joi.string().min(2).required().max(100),
  senderAddress: joi.string().min(5).required().max(500),
  senderPhone: joi.string().min(10).max(15).required(),
  receiverName: joi.string().min(2).required().max(100),
  receiverPhone: joi.string().min(10).max(15).required(),
  receiverAddress: joi.string().min(5).required().max(500),
  shipmentType: joi.string().valid("national", "international").required(),
  originCity: joi.string().min(2).max(100).required(),
  destinationCity: joi.string().min(2).max(100).required(),
  deliveryType: joi
    .string()
    .valid("standard", "overnight", "sameDay")
    .required(),
  parcelCategory: joi
    .string()
    .valid(
      "documents",
      "electronics",
      "clothing",
      "food",
      "medicine",
      "cosematics",
      "books",
      "small_package",
      "large_package",
      "perishables",
      "other",
    )
    .required(),
  weight: joi.number().positive().required(),
});

export const addCheckPointSchema = joi.object({
  location: joi.string().min(2).max(100).required(),
  title: joi.string().min(2).max(100).required(),
  description: joi.string().allow("", null).required(),
  status: joi
    .string()
    .valid("arrived", "in_transit", "out_for_delivery", "delivered"),
});

export const calculateCostSchema = joi.object({
  shipmentType: joi.string().valid("national", "international").required(),
  originCity: joi.string().min(2).max(100).required(),
  destinationCity: joi.string().min(2).max(100).required(),
  parcelCategory: joi
    .string()
    .valid(
      "documents",
      "electronics",
      "clothing",
      "food",
      "medicine",
      "cosematics",
      "books",
      "small_package",
      "large_package",
      "perishables",
      "other",
    )
    .required(),
  weight: joi.number().positive().required(),
  deliveryType: joi
    .string()
    .valid("standard", "overnight", "sameDay")
    .required(),
});
