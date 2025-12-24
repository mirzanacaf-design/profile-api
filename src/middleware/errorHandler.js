/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err);

  // TODO: Determine the appropriate HTTP status code
  // Check if err.statusCode exists, use it, otherwise default to 500
  // Store in statusCode variable

  let statusCode = err.statusCode || 500
  



  // TODO: Get error message
  // Use err.message if exists, otherwise 'Internal Server Error'
  // Store in message variable

  const message = err.message || 'Internal Server Error'

  // TODO: Handle specific error types
  // If err.name === 'ValidationError', set statusCode to 400
  // If err.code === '23505' (PostgreSQL unique constraint), set statusCode to 409

  if (err.name === "ValidationError") {
    statusCode = 400;
  } else if (err.name === "23505") {
    statusCode = 409;
  }
  // TODO: Send error response
  // Use res.status(statusCode).json()
  // Response should include: { success: false, message: message }
  // In development mode, also include stack trace

    res.statusCode(statusCode).json({
    success: false,
    message
  });

};

/**
 * 404 Not Found Handler
 * Handles routes that don't exist
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

module.exports = { errorHandler, notFoundHandler };
