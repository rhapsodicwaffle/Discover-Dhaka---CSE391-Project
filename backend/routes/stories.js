const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/stories
// @desc    Get all stories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    
    let query = { isApproved: true };
    
    if (tag && tag !== 'All') {
      query.tags = tag;
    }
    
    const stories = await Story.find(query)
      .populate('author', 'name profilePicture')
      .populate('comments.user', 'name profilePicture')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'name profilePicture bio')
      .populate('comments.user', 'name profilePicture');
      
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/stories
// @desc    Create story
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      author: req.user.id,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };
    
    if (req.files && req.files.length > 0) {
      storyData.images = req.files.map(file => `/uploads/${file.filename}`);
      storyData.image = storyData.images[0];
    }
    
    const story = await Story.create(storyData);
    
    // Add XP to user
    const user = await User.findById(req.user.id);
    user.addXP(50);
    
    // Check if this is first story for Storyteller badge
    const userStories = await Story.countDocuments({ author: req.user.id });
    if (userStories === 1) {
      const storytellerBadge = user.badges.find(b => b.name === 'Storyteller');
      if (storytellerBadge && !storytellerBadge.earned) {
        storytellerBadge.earned = true;
        storytellerBadge.earnedAt = new Date();
      }
    }
    
    await user.save();
    
    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/stories/:id/like
// @desc    Like/Unlike story
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const likeIndex = story.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      story.likes.splice(likeIndex, 1);
      story.likesCount -= 1;
    } else {
      // Like
      story.likes.push(req.user.id);
      story.likesCount += 1;
    }
    
    await story.save();
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/stories/:id/comment
// @desc    Add comment to story
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    story.comments.push({
      user: req.user.id,
      text: req.body.text
    });
    
    await story.save();
    
    await story.populate('comments.user', 'name profilePicture');
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete story
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Check user owns story or is admin
    if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await story.deleteOne();
    
    res.json({
      success: true,
      message: 'Story deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
