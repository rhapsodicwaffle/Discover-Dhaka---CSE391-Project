const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/places
// @desc    Get all places
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = { isApproved: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const places = await Place.find(query).populate('reviews');
    
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
    const place = await Place.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name profilePicture' }
      });
      
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    // Increment visit count
    place.visitCount += 1;
    await place.save();
    
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
    
    if (req.file) {
      placeData.image = `/uploads/${req.file.filename}`;
    }
    
    const place = await Place.create(placeData);
    
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
    let place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
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
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    await place.deleteOne();
    
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
    const places = await Place.find({ isApproved: true })
      .select('lat lng visitCount rating');
      
    const heatmapData = places.map(place => ({
      lat: place.lat,
      lng: place.lng,
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
