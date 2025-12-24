require('dotenv').config();
const createApp = require('./src/app');
const { initDatabase } = require('./src/config/database');

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Initialize database tables
    await initDatabase();
    console.log("bhsbwusiq");
    
    // Create Express app
    const app = createApp();

    // Get port from environment or use default
    const PORT = process.env.PORT || 3000;

    // Start listening
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
