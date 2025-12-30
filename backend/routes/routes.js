const express = require('express');
const router = express.Router();
const RouteModel = require('../models/RouteModel');
const UserModel = require('../models/UserModel');
const PlaceModel = require('../models/PlaceModel');
const { protect } = require('../middleware/auth');

// @route   GET /api/routes
router.get('/', async (req, res) => {
  try {
    const { type, isPublic } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (isPublic === 'true') query.isPublic = true;
    
    const routes = await RouteModel.findAll(query);
    
    res.json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/routes/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const routes = await RouteModel.findAll({ user: req.params.userId });
    
    res.json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/routes
router.post('/', protect, async (req, res) => {
  try {
    const route = await RouteModel.create({
      ...req.body,
      user: req.user.id
    });
    
    // Add XP and save route to user
    const user = await UserModel.findById(req.user.id);
    if (user) {
      const currentXP = user.xp || 0;
      const savedRoutes = user.savedRoutes || [];
      await UserModel.update(req.user.id, { 
        xp: currentXP + 25,
        savedRoutes: [...savedRoutes, route.id]
      });
    }
    
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/routes/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const route = await RouteModel.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    
    if (route.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await RouteModel.delete(req.params.id);
    
    res.json({ success: true, message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/routes/generate/:type
router.get('/generate/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    let categoryMap = {
      'food': 'Food',
      'historical': 'History',
      'cultural': 'Culture'
    };
    
    const allPlaces = await PlaceModel.findAll({ 
      category: categoryMap[type],
      isApproved: true 
    });
    
    const places = allPlaces.slice(0, 5);
    
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
