import Joi from "joi";

// Register user validation schema
export const registerUserSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.empty": "Full name is required",
    "any.required": "Full name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Verify email validation schema
export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  otp: Joi.string().required().messages({
    "string.empty": "OTP is required",
    "any.required": "OTP is required",
  }),
});

// Resend OTP validation schema
export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

// Login  user validation schema
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Forget password validation schema
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

// Verify OTP for password reset validation schema
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  otp: Joi.string().required().messages({
    "string.empty": "OTP is required",
    "any.required": "OTP is required",
  }),
});

// Reset password validation schema
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  otp: Joi.string().required().messages({
    "string.empty": "OTP is required",
    "any.required": "OTP is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.empty": "New password is required",
    "any.required": "New password is required",
  }),
});

// Change password validation schema
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.empty": "New password is required",
    "any.required": "New password is required",
  }),
});

// Update profile validation schema
export const updateProfileSchema = Joi.object({
  fullName: Joi.string().max(100).optional().messages({
    "string.max": "Full name cannot exceed 100 characters",
  }),
  bio: Joi.string().max(1000).optional().messages({
    "string.max": "Bio cannot exceed 1000 characters",
  }),
  designation: Joi.string().max(100).optional().messages({
    "string.max": "Designation cannot exceed 100 characters",
  }),
});
