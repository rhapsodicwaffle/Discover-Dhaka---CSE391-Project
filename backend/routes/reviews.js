const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Place = require('../models/Place');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/reviews/place/:placeId
router.get('/place/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId })
      .populate('user', 'name profilePicture')
      .sort('-createdAt');
    
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
    const existingReview = await Review.findOne({ place, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this place' 
      });
    }
    
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const review = await Review.create({
      place,
      user: req.user.id,
      rating,
      comment,
      images
    });
    
    // Update place average rating
    const placeDoc = await Place.findById(place);
    const reviews = await Review.find({ place });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    placeDoc.rating = avgRating;
    await placeDoc.save();
    
    // Add XP for reviewing
    const user = await User.findById(req.user.id);
    user.addXP(10);
    
    // Check for Reviewer badge (5 reviews)
    const userReviews = await Review.find({ user: req.user.id });
    if (userReviews.length >= 5 && !user.badges.some(b => b.id === 'reviewer')) {
      user.badges.push({
        id: 'reviewer',
        name: 'Reviewer',
        icon: '📝',
        description: 'Write 5 reviews',
        dateEarned: new Date()
      });
    }
    
    await user.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name profilePicture');
    
    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/reviews/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    
    await review.save();
    
    // Update place average rating
    const placeDoc = await Place.findById(review.place);
    const reviews = await Review.find({ place: review.place });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    placeDoc.rating = avgRating;
    await placeDoc.save();
    
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const placeId = review.place;
    await review.deleteOne();
    
    // Update place average rating
    const placeDoc = await Place.findById(placeId);
    const reviews = await Review.find({ place: placeId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    placeDoc.rating = avgRating;
    await placeDoc.save();
    
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
