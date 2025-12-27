const ProfileService = require('../services/profileService');

/**
 * Get user profile
 * GET /profile
 * Protected route - requires authentication
 * Controller layer - handles HTTP request/response
 */
const getProfile = async (req, res, next) => {
  try {
    // User info is available from authMiddleware
    const userId = req.user.id;
    const user = await ProfileService.getProfile(userId)
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * PUT /profile
 * Protected route - requires authentication
 * Controller layer - handles HTTP request/response
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    const user = await ProfileService.updatePassword(userId, password)
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
