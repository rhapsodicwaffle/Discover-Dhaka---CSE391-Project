const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/routes
router.get('/', async (req, res) => {
  try {
    const { type, isPublic } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (isPublic === 'true') query.isPublic = true;
    
    const routes = await Route.find(query)
      .populate('user', 'name profilePicture')
      .populate('places');
    
    res.json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/routes/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const routes = await Route.find({ user: req.params.userId })
      .populate('places');
    
    res.json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/routes
router.post('/', protect, async (req, res) => {
  try {
    const route = await Route.create({
      ...req.body,
      user: req.user.id
    });
    
    // Add XP and save route to user
    const user = await User.findById(req.user.id);
    user.addXP(25);
    user.savedRoutes.push(route._id);
    await user.save();
    
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/routes/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    
    if (route.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await route.deleteOne();
    
    res.json({ success: true, message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/routes/generate/:type
router.get('/generate/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const Place = require('../models/Place');
    
    let categoryMap = {
      'food': 'Food',
      'historical': 'History',
      'cultural': 'Culture'
    };
    
    const places = await Place.find({ 
      category: categoryMap[type],
      isApproved: true 
    }).limit(5);
    
    if (places.length < 2) {
      return res.status(404).json({ 
        success: false, 
        message: 'Not enough places for this route type' 
      });
    }
    
    const duration = `${places.length * 30} mins`;
    
    res.json({
      success: true,
      data: {
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Route`,
        description: `Discover ${places.length} amazing ${type} places in Dhaka`,
        places,
        duration,
        type
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
