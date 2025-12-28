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
    // TODO: Step 1 - Check if user already exists
    // Call UserModel.findByEmail(email)
    // If user exists, throw an error with statusCode 409
    // Error message: 'User with this email already exists'
    const user = await UserModel.findByEmail(email)
    if (user) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error
    }

    // TODO: Step 2 - Hash the password
    // Use bcrypt.hash(password, saltRounds) where saltRounds = 10
    // Store result in hashedPassword variable
    const hashedPassword = await bcrypt.hash(password, 10)

    // TODO: Step 3 - Create the user in database
    // Call UserModel.create(email, hashedPassword)
    // Store result in newUser variable
    const newUser = await UserModel.create(email, hashedPassword)

    // TODO: Step 4 - Generate JWT token
    // Call this.generateToken(newUser.id, newUser.email)
    // Store result in token variable
    const token = this.generateToken(newUser.id, newUser.email)

    // TODO: Step 5 - Return user data and token
    // Return object with: { user: { id, email, created_at }, token }
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at
      },
      token
    }
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's plain password
   * @returns {Promise<Object>} User data and JWT token
   * @throws {Error} If credentials are invalid
   */
  static async login(email, password) {
    const user = await UserModel.findByEmail(email)
    // console.log(Object.keys(user));
    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // TODO: Step 2 - Verify password
    // Use bcrypt.compare(password, user.password)
    // If password invalid, throw error with statusCode 401
    // Error message: 'Invalid email or password'
    const verified = await bcrypt.compare(password, user.password)
    if (!verified) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    // TODO: Step 3 - Generate JWT token
    // Call this.generateToken(user.id, user.email)
    // Store result in token variable
    const token = this.generateToken(user.id, user.email)

    // TODO: Step 4 - Return user data and token
    // Return object with: { user: { id, email }, token }
    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: Date.now()
      },
      token
    }
  }

  /**
   * Generate JWT token
   * @param {number} id - User's ID
   * @param {string} email - User's email
   * @returns {string} JWT token
   * @private
   */
  static generateToken(id, email) {
    // TODO: Generate and return JWT token
    // Use jwt.sign() with payload { id, email }
    // Secret: process.env.JWT_SECRET
    // Options: { expiresIn: process.env.JWT_EXPIRES_IN }
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  }
}

module.exports = AuthService;
