const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

/**
 * Create and configure Express application
 */
const createApp = () => {
  const app = express();

  // Security middleware - must be first
  app.use(helmet()); // Adds various HTTP headers for security
  app.use(cors()); // Enable CORS for all routes

  // Body parsing middleware
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  
  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);

  // 404 handler - must be after all routes
  app.use(notFoundHandler);

  // Global error handler - must be last
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
