const { ZodError } = require('zod');

/**
 * Zod Validation Middleware
 * Validates request data against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request data (body, query, params)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      }

      // Pass other errors to error handler
      next(error);
    }
  };
};

module.exports = validateRequest;
