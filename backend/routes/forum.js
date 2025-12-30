const express = require('express');
const router = express.Router();
const ForumThreadModel = require('../models/ForumThreadModel');
const supabase = require('../config/supabase');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/forum
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isApproved: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const threads = await ForumThreadModel.findAll(query);
    
    res.json({ success: true, count: threads.length, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/forum/:id
router.get('/:id', async (req, res) => {
  try {
    const thread = await ForumThreadModel.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    // Increment views
    await ForumThreadModel.update(req.params.id, { views: thread.views + 1 });
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum
router.post('/', protect, async (req, res) => {
  try {
    const thread = await ForumThreadModel.create({
      ...req.body,
      author: req.user.id,
      isApproved: req.user.role === 'admin'
    });
    
    res.status(201).json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum/:id/reply
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const thread = await ForumThreadModel.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    if (thread.isLocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'This thread is locked' 
      });
    }
    
    // Insert reply into forum_replies table
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .insert({
        thread_id: req.params.id,
        user_id: req.user.id,
        content: req.body.content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, data: reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/forum/:id/pin
router.put('/:id/pin', protect, admin, async (req, res) => {
  try {
    const thread = await ForumThreadModel.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    const updatedThread = await ForumThreadModel.update(req.params.id, { isPinned: !thread.isPinned });
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/forum/:id/lock
router.put('/:id/lock', protect, admin, async (req, res) => {
  try {
    const thread = await ForumThreadModel.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    const updatedThread = await ForumThreadModel.update(req.params.id, { isLocked: !thread.isLocked });
    
    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/forum/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const success = await ForumThreadModel.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    
    res.json({ success: true, message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
