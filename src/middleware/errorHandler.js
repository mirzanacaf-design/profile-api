/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  console.error(' Error:', err);
  let statusCode = err.statusCode || 500
  let message = err.message || 'internal server error'
  let response = { success: false, message }
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Validation Error' })
  if (err.code === '23505') return res.status(409).json({ message: '' })
  return res.status(statusCode).json(response)
};

/**
 * 404 Not Found Handler
 * Handles routes that don't exist
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

module.exports = { errorHandler, notFoundHandler };
