const express = require('express');
const router = express.Router();
const StoryModel = require('../models/StoryModel');
const UserModel = require('../models/UserModel');
const supabase = require('../config/supabase');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, generateFilename } = require('../utils/supabaseUpload');

// @route   GET /api/stories
// @desc    Get all stories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    
    const query = { isApproved: true };
    if (tag && tag !== 'All') query.tag = tag;
    
    const stories = await StoryModel.findAll(query);
    
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
    const story = await StoryModel.findById(req.params.id);
      
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
    
    // Upload images to Supabase Storage
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const filename = generateFilename(file.originalname);
        const imageUrl = await uploadToSupabase(file.buffer, 'stories', filename, file.mimetype);
        imageUrls.push(imageUrl);
      }
      storyData.images = imageUrls;
      storyData.image = imageUrls[0];
    }
    
    const story = await StoryModel.create(storyData);
    
    // Add XP to user
    const user = await UserModel.findById(req.user.id);
    if (user) {
      const currentXP = user.xp || 0;
      await UserModel.update(req.user.id, { xp: currentXP + 50 });
      
      // Check if this is first story for Storyteller badge
      const userStories = await StoryModel.count({ author: req.user.id });
      if (userStories === 1 && user.badges) {
        const storytellerBadge = user.badges.find(b => b.name === 'Storyteller');
        if (storytellerBadge && !storytellerBadge.earned) {
          storytellerBadge.earned = true;
          storytellerBadge.earnedAt = new Date();
          await UserModel.update(req.user.id, { badges: user.badges });
        }
      }
    }
    
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
    const story = await StoryModel.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const likeIndex = story.likes.indexOf(req.user.id);
    let updatedLikes;
    let updatedLikesCount;
    
    if (likeIndex > -1) {
      // Unlike
      updatedLikes = story.likes.filter(id => id !== req.user.id);
      updatedLikesCount = story.likesCount - 1;
    } else {
      // Like
      updatedLikes = [...story.likes, req.user.id];
      updatedLikesCount = story.likesCount + 1;
    }
    
    const updatedStory = await StoryModel.update(req.params.id, { 
      likes: updatedLikes,
      likesCount: updatedLikesCount 
    });
    
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
    // TODO: Comments are now in separate story_comments table
    // Need to insert into story_comments table
    const { data: comment, error } = await supabase
      .from('story_comments')
      .insert({
        story_id: req.params.id,
        user_id: req.user.id,
        content: req.body.text
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: comment
    });
    
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
    const story = await StoryModel.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Check user owns story or is admin
    if (story.author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await StoryModel.delete(req.params.id);
    
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
