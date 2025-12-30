const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
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
    let user = await UserModel.findByEmail(email);
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await UserModel.create({
      name,
      email,
      password,
      badges: defaultBadges,
      xp: 0,
      level: 1
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
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
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
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
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, profilePicture, isPublic } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (isPublic !== undefined) updates.isPublic = isPublic;

    const user = await UserModel.update(req.user.id, updates);

    res.json({
      success: true,
      user: {
        id: user.id,
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

// @route   GET /api/auth/liked-stories
// @desc    Get user's liked stories
// @access  Private
router.get('/liked-stories', protect, async (req, res) => {
  try {
    const supabase = require('../config/supabase');
    
    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        *,
        author:users!stories_author_id_fkey(id, name, profile_picture)
      `)
      .contains('likes', [req.user.id])
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    // Convert to match previous format
    const convertedStories = stories.map(s => ({
      _id: s.id,
      id: s.id,
      title: s.title,
      content: s.content,
      image: s.image,
      tags: s.tags || [],
      author: s.author ? {
        id: s.author.id,
        name: s.author.name,
        profilePicture: s.author.profile_picture
      } : null,
      likes: s.likes || [],
      likesCount: s.likes_count || 0,
      createdAt: s.created_at
    }));
    
    res.json({
      success: true,
      count: convertedStories.length,
      data: convertedStories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
