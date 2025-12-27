const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

/**
 * Profile Service
 * Contains business logic for profile operations
 */
class ProfileService {
  /**
   * Get user profile by ID
   * @param {number} userId - User's ID
   * @returns {Promise<Object>} User profile data
   * @throws {Error} If user not found
   */
  static async getProfile(userId) {
    const user = await UserModel.findById(userId)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    }
  }

  /**
   * Update user's password
   * @param {number} userId - User's ID
   * @param {string} newPassword - New plain password
   * @returns {Promise<Object>} Updated user data
   * @throws {Error} If user not found
   */
  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUser = await UserModel.updatePassword(userId, hashedPassword)
    if (updatedUser === undefined || updatedUser === null) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return {
      updatedUser: {
        id: updatedUser.id,
        email: updatedUser.email,
        updated_at: updatedUser.updated_at
      }
    }
  }
}

module.exports = ProfileService;
