const { pool } = require('../config/database');

/**
 * User Model
 * Handles all database operations related to users
 */
class UserModel {
  /**
   * Find a user by email
   * @param {string} email - User's email address
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const result = await pool.query(`select * from users where email = $1`, [email])
    return result.rows[0]
  }

  /**
   * Find a user by ID
   * @param {number} id - User's ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    const result = await pool.query(`select * from users where id = $1`, [id])
    return result.rows[0]
  }

  /**
   * Create a new user
   * @param {string} email - User's email address
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<Object>} Created user object (without password)
   */
  static async create(email, hashedPassword) {
    const result = await pool.query(`insert into users (email, password) values ($1, $2) returning *`, [email, hashedPassword])
    return result.rows[0]
  }

  /**
   * Update user's password
   * @param {number} id - User's ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<Object>} Updated user object (without password)
   */
  static async updatePassword(id, hashedPassword) {
    const result = await pool.query(`update users set password = $2 where id = $1 returning *`, [id, hashedPassword])
    return result.rows[0]
  }

  /**
   * Check if a user exists by email
   * @param {string} email - User's email address
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  static async existsByEmail(email) {
    // Return the boolean result from result.rows[0].exists
    const result = await pool.query(`select exists (select * from users where email = $1)`, [email])
    return result.rows[0].exists
  }
}

module.exports = UserModel;
