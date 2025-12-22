const { z } = require('zod');

/**
 * Zod schema for user registration
 */
const registerSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address')
      .trim()
      .toLowerCase(),
    
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long')
      .trim(),
  }),
});

/**
 * Zod schema for user login
 */
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address')
      .trim()
      .toLowerCase(),
    
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
