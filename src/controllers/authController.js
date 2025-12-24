const AuthService = require('../services/authService');

/**
 * Register a new user
 * POST /auth/register
 * Controller layer - handles HTTP request/response
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

     // Call service layer to handle business logic
    const data = await AuthService.register(email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /auth/login
 * Controller layer - handles HTTP request/response
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Call service layer to handle business logic
    const data = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
