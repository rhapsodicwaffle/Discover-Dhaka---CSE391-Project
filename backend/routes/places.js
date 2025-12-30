const express = require('express');
const router = express.Router();
const PlaceModel = require('../models/PlaceModel');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, generateFilename } = require('../utils/supabaseUpload');

// @route   GET /api/places
// @desc    Get all places
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const query = { isApproved: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.search = search;
    
    const places = await PlaceModel.findAll(query);
    
    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/places/:id
// @desc    Get single place
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const place = await PlaceModel.findById(req.params.id);
      
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    // Increment visit count
    await PlaceModel.update(place.id, { visitCount: place.visitCount + 1 });
    
    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/places
// @desc    Create place
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const placeData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    // Upload image to Supabase Storage
    if (req.file) {
      const filename = generateFilename(req.file.originalname);
      const imageUrl = await uploadToSupabase(req.file.buffer, 'places', filename, req.file.mimetype);
      placeData.image = imageUrl;
    }
    
    const place = await PlaceModel.create(placeData);
    
    res.status(201).json({
      success: true,
      data: place
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/places/:id
// @desc    Update place
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const place = await PlaceModel.update(req.params.id, req.body);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/places/:id
// @desc    Delete place
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const success = await PlaceModel.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Place deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/places/heatmap/data
// @desc    Get heatmap data
// @access  Public
router.get('/heatmap/data', async (req, res) => {
  try {
    const places = await PlaceModel.findAll({ isApproved: true });
      
    const heatmapData = places.map(place => ({
      lat: place.location.lat,
      lng: place.location.lng,
      intensity: place.visitCount * place.rating
    }));
    
    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
