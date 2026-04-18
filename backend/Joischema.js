import Joi from "joi";

// ✅ Registration Schema
export const RegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 100 characters"
  }),
  username: Joi.string().required().messages({
    "string.empty": "Username is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long"
  }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email (e.g., name@example.com)"
    })
});

// ✅ Login Schema
export const LoginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});
