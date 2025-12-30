const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Place = require('../models/Place');
const Story = require('../models/Story');
const Event = require('../models/Event');
const ForumThread = require('../models/ForumThread');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalEvents = await Event.countDocuments();
    
    const pendingEvents = await Event.countDocuments({ isApproved: false });
    const pendingPlaces = await Place.countDocuments({ isApproved: false });
    const pendingStories = await Story.countDocuments({ isApproved: false });
    const pendingThreads = await ForumThread.countDocuments({ isApproved: false });
    
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort('-createdAt')
      .limit(5);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPlaces,
          totalStories,
          totalEvents,
          pendingEvents,
          pendingPlaces,
          pendingStories,
          pendingThreads
        },
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');
    
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (role) user.role = role;
    
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/pending/:type
router.get('/pending/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    let data;
    
    if (type === 'events') {
      data = await Event.find({ isApproved: false })
        .populate('createdBy', 'name email')
        .sort('-createdAt');
    } else if (type === 'places') {
      data = await Place.find({ isApproved: false })
        .sort('-createdAt');
    } else if (type === 'stories') {
      data = await Story.find({ isApproved: false })
        .populate('author', 'name email')
        .sort('-createdAt');
    } else if (type === 'threads') {
      data = await ForumThread.find({ isApproved: false })
        .populate('author', 'name email')
        .sort('-createdAt');
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/approve/:type/:id
router.put('/approve/:type/:id', protect, admin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let item;
    
    if (type === 'event') {
      item = await Event.findById(id);
    } else if (type === 'place') {
      item = await Place.findById(id);
    } else if (type === 'story') {
      item = await Story.findById(id);
    } else if (type === 'thread') {
      item = await ForumThread.findById(id);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    
    if (!item) {
      return res.status(404).json({ success: false, message: `${type} not found` });
    }
    
    item.isApproved = true;
    await item.save();
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/reject/:type/:id
router.delete('/reject/:type/:id', protect, admin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;
    
    if (type === 'event') Model = Event;
    else if (type === 'place') Model = Place;
    else if (type === 'story') Model = Story;
    else if (type === 'thread') Model = ForumThread;
    else return res.status(400).json({ success: false, message: 'Invalid type' });
    
    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: `${type} not found` });
    }
    
    await item.deleteOne();
    res.json({ success: true, message: `${type} rejected and deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
