const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

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
    // TODO: Step 1 - Find user by ID
    // Call UserModel.findById(userId)
    // Store result in user variable

    const user = await UserModel.findById(userId);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // TODO: Step 2 - Check if user exists
    // If user not found, throw error with statusCode 404
    // Error message: 'User not found'

    // TODO: Step 3 - Return user profile data
    // Return object with: { id, email, created_at, updated_at }

    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };

  }

  /**
   * Update user's password
   * @param {number} userId - User's ID
   * @param {string} newPassword - New plain password
   * @returns {Promise<Object>} Updated user data
   * @throws {Error} If user not found
   */
  static async updatePassword(userId, newPassword) {
    // TODO: Step 1 - Hash the new password
    // Use bcrypt.hash(newPassword, saltRounds) where saltRounds = 10
    // Store result in hashedPassword variable
    let hashedPassword;
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    // TODO: Step 2 - Update password in database
    // Call UserModel.updatePassword(userId, hashedPassword)
    // Store result in updatedUser variable

    const updatedUser = await UserModel.updatePassword(userId, hashedPassword);
    if (!updatedUser) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // TODO: Step 3 - Check if user exists
    // If updatedUser is null/undefined, throw error with statusCode 404
    // Error message: 'User not found'

    // TODO: Step 4 - Return updated user data
    // Return object with: { id, email, updated_at }

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        updated_at: updatedUser.updated_at,
      },
    };

    // throw new Error('NOT_IMPLEMENTED');
  }
}

module.exports = ProfileService;
