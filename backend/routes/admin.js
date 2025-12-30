const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const PlaceModel = require('../models/PlaceModel');
const StoryModel = require('../models/StoryModel');
const EventModel = require('../models/EventModel');
const ForumThreadModel = require('../models/ForumThreadModel');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await UserModel.count();
    const totalPlaces = await PlaceModel.count();
    const totalStories = await StoryModel.count();
    const totalEvents = await EventModel.count();
    
    const pendingEvents = await EventModel.count({ isApproved: false });
    const pendingPlaces = await PlaceModel.count({ isApproved: false });
    const pendingStories = await StoryModel.count({ isApproved: false });
    const pendingThreads = await ForumThreadModel.count({ isApproved: false });
    
    const recentUsers = await UserModel.findAll();
    const recentUsersSliced = recentUsers.slice(0, 5).map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt
    }));
    
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
        recentUsers: recentUsersSliced
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await UserModel.findAll();
    
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await UserModel.update(req.params.id, { role });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    await UserModel.deleteById(req.params.id);
    
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
      data = await EventModel.findAll({ isApproved: false });
    } else if (type === 'places') {
      data = await PlaceModel.findAll({ isApproved: false });
    } else if (type === 'stories') {
      data = await StoryModel.findAll({ isApproved: false });
    } else if (type === 'threads') {
      data = await ForumThreadModel.findAll({ isApproved: false });
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
      item = await EventModel.update(id, { isApproved: true });
    } else if (type === 'place') {
      item = await PlaceModel.update(id, { isApproved: true });
    } else if (type === 'story') {
      item = await StoryModel.update(id, { isApproved: true });
    } else if (type === 'thread') {
      item = await ForumThreadModel.update(id, { isApproved: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    
    if (!item) {
      return res.status(404).json({ success: false, message: `${type} not found` });
    }
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/reject/:type/:id
router.delete('/reject/:type/:id', protect, admin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let success;
    
    if (type === 'event') {
      success = await EventModel.delete(id);
    } else if (type === 'place') {
      success = await PlaceModel.delete(id);
    } else if (type === 'story') {
      success = await StoryModel.delete(id);
    } else if (type === 'thread') {
      success = await ForumThreadModel.delete(id);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    
    if (!success) {
      return res.status(404).json({ success: false, message: `${type} not found` });
    }
    
    res.json({ success: true, message: `${type} rejected and deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
