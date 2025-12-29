const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Initialize default badges
const defaultBadges = [
  { id: 1, name: 'Explorer', icon: '🗺️', earned: true, description: 'Joined Discover Dhaka', earnedAt: new Date() },
  { id: 2, name: 'Storyteller', icon: '📖', earned: false, description: 'Share your first story' },
  { id: 3, name: 'Foodie', icon: '🍜', earned: false, description: 'Visit 5 food places' },
  { id: 4, name: 'History Buff', icon: '🏛️', earned: false, description: 'Visit 5 historical sites' },
  { id: 5, name: 'Old Town Explorer', icon: '🚶', earned: false, description: 'Complete a heritage route' }
];

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      badges: defaultBadges,
      xp: 0,
      level: 1
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        savedPlaces: user.savedPlaces,
        savedRoutes: user.savedRoutes,
        isPublic: user.isPublic,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        savedPlaces: user.savedPlaces,
        savedRoutes: user.savedRoutes,
        isPublic: user.isPublic,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedPlaces')
      .populate({
        path: 'savedRoutes',
        populate: { path: 'places' }
      });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
