const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const validateRequest = require('../middleware/validateRequest');
const { loginLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), register);
//router.post('/login', validateRequest(loginSchema), login);


/**
 * @route   POST /auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 * @note    Rate limited to 5 attempts per 15 minutes
 */
router.post('/login', loginLimiter, validateRequest(loginSchema), login);

module.exports = router;
