const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

/**
 * Authentication Service
 * Contains business logic for authentication operations
 */
class AuthService {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's plain password
   * @returns {Promise<Object>} User data and JWT token
   * @throws {Error} If user already exists
   */
  static async register(email, password) {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await UserModel.create(email, hashedPassword);

    // Generate JWT token
    const token = this.generateToken(newUser.id, newUser.email);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
      },
      token,
    };
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's plain password
   * @returns {Promise<Object>} User data and JWT token
   * @throws {Error} If credentials are invalid
   */
  static async login(email, password) {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  /**
   * Generate JWT token
   * @param {number} id - User's ID
   * @param {string} email - User's email
   * @returns {string} JWT token
   * @private
   */
  static generateToken(id, email) {
    return jwt.sign(
      { id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = AuthService;
