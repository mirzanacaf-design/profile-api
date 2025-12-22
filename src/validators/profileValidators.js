const { z } = require('zod');

/**
 * Zod schema for profile update
 * Only password update is allowed
 */
const updateProfileSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long')
      .trim(),
  }),
});

module.exports = {
  updateProfileSchema,
};
