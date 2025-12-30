const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/ReviewModel');
const PlaceModel = require('../models/PlaceModel');
const UserModel = require('../models/UserModel');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, generateFilename } = require('../utils/supabaseUpload');

// @route   GET /api/reviews/place/:placeId
router.get('/place/:placeId', async (req, res) => {
  try {
    const reviews = await ReviewModel.findAll({ place: req.params.placeId });
    
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { place, rating, comment } = req.body;
    
    // Check if review already exists
    const existingReview = await ReviewModel.findOne({ place, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this place' 
      });
    }
    
    // Upload images to Supabase Storage
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = generateFilename(file.originalname);
        const imageUrl = await uploadToSupabase(file.buffer, 'places', filename, file.mimetype);
        images.push(imageUrl);
      }
    }
    
    const review = await ReviewModel.create({
      place,
      user: req.user.id,
      rating,
      comment,
      images
    });
    
    // Update place average rating
    const reviews = await ReviewModel.findAll({ place });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await PlaceModel.update(place, { rating: avgRating });
    
    // Add XP for reviewing
    const user = await UserModel.findById(req.user.id);
    if (user) {
      const currentXP = user.xp || 0;
      await UserModel.update(req.user.id, { xp: currentXP + 10 });
      
      // Check for Reviewer badge (5 reviews)
      const userReviewCount = await ReviewModel.count({ user: req.user.id });
      if (userReviewCount >= 5 && user.badges && !user.badges.some(b => b.id === 'reviewer')) {
        const updatedBadges = [...user.badges, {
          id: 'reviewer',
          name: 'Reviewer',
          icon: '📝',
          description: 'Write 5 reviews',
          dateEarned: new Date()
        }];
        await UserModel.update(req.user.id, { badges: updatedBadges });
      }
    }
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/reviews/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    if (review.user !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const updatedReview = await ReviewModel.update(req.params.id, {
      rating: req.body.rating || review.rating,
      comment: req.body.comment || review.comment
    });
    
    // Update place average rating
    const reviews = await ReviewModel.findAll({ place: review.place });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await PlaceModel.update(review.place, { rating: avgRating });
    
    res.json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    if (review.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const placeId = review.place;
    await ReviewModel.delete(req.params.id);
    
    // Update place average rating
    const reviews = await ReviewModel.findAll({ place: placeId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    await PlaceModel.update(placeId, { rating: avgRating });
    
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
