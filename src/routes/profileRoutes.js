const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { updateProfileSchema } = require('../validators/profileValidators');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /profile
 * @desc    Get current user's profile
 * @access  Private (requires JWT token)
 */
router.get('/', authMiddleware, getProfile);

/**
 * @route   PUT /profile
 * @desc    Update user password
 * @access  Private (requires JWT token)
 */
router.put('/', authMiddleware, validateRequest(updateProfileSchema), updateProfile);

module.exports = router;
