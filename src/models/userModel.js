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
    // TODO: Write SQL query to find user by email
    // Use pool.query() with parameterized query: SELECT * FROM users WHERE email = $1
    // Return the first row or null if not found
    const res = await pool.query('SELECT * FROM users WHERE email = $1 ' , [email])
    if(!res.rows.length) return null
    return res.rows[0]

  }

  /**
   * Find a user by ID
   * @param {number} id - User's ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    // TODO: Write SQL query to find user by ID
    // Use pool.query() with parameterized query: SQL
    // Note: Do NOT select the password field
    // Return the first row or null if not found

    const res = await pool.query('SELECT * FROM users WHERE id = $1' , [id])
    if(!res.rows.length) return null
    return res.rows[0] 
  }

  /**
   * Create a new user
   * @param {string} email - User's email address
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<Object>} Created user object (without password)
   */
  static async create(email, hashedPassword) {
    // TODO: Write SQL INSERT query to create a new user
    // Use pool.query() with: SQL
    // Return the created user object (first row)
    const res = await pool.query('INSERT INTO users (email,password)  VALUES ($1 , $2 ) RETURNING  id, email, created_at' , [email,hashedPassword])
    return res.rows[0]
  }

  /**
   * Update user's password
   * @param {number} id - User's ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<Object>} Updated user object (without password)
   */
  static async updatePassword(id, hashedPassword) {
    // TODO: Write SQL UPDATE query to update user password
    // Use pool.query() with: SQL
    // Return the updated user object (first row)
    const res = await pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING * ',[hashedPassword,id])
    return res.rows[0]
  }

  /**
   * Check if a user exists by email
   * @param {string} email - User's email address
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  static async existsByEmail(email) {
    // TODO: Write SQL query to check if user exists
    // Use pool.query() with: SQL
    // Return the boolean result from result.rows[0].exists
    const res = await pool.query('SELECT EXISTS (SELECT 1 FROM users  WHERE email = $1)' ,[email])
    return res.rows[0].exists

  }
}

module.exports = UserModel;
