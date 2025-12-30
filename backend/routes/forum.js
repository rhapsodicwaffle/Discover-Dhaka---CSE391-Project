const express = require('express');
const router = express.Router();
const ForumThread = require('../models/ForumThread');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/forum
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isApproved: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const threads = await ForumThread.find(query)
      .populate('author', 'name profilePicture')
      .sort({ isPinned: -1, updatedAt: -1 });
    
    res.json({ success: true, count: threads.length, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/forum/:id
router.get('/:id', async (req, res) => {
  try {
    const thread = await ForumThread.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profilePicture')
      .populate('replies.user', 'name profilePicture');
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum
router.post('/', protect, async (req, res) => {
  try {
    const thread = await ForumThread.create({
      ...req.body,
      author: req.user.id
    });
    
    const populatedThread = await ForumThread.findById(thread._id)
      .populate('author', 'name profilePicture');
    
    res.status(201).json({ success: true, data: populatedThread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum/:id/reply
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    if (thread.isLocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'This thread is locked' 
      });
    }
    
    thread.replies.push({
      user: req.user.id,
      content: req.body.content
    });
    
    await thread.save();
    
    const populatedThread = await ForumThread.findById(thread._id)
      .populate('author', 'name profilePicture')
      .populate('replies.user', 'name profilePicture');
    
    res.json({ success: true, data: populatedThread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/forum/:id/pin
router.put('/:id/pin', protect, admin, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    thread.isPinned = !thread.isPinned;
    await thread.save();
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/forum/:id/lock
router.put('/:id/lock', protect, admin, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    thread.isLocked = !thread.isLocked;
    await thread.save();
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/forum/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    await thread.deleteOne();
    
    res.json({ success: true, message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
