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
    await ForumThreadModel.update(req.params.id, { views: (thread.views || 0) + 1 });
    thread.views = (thread.views || 0) + 1;

    // Get replies with user info
    const { data: replies, error } = await supabase
      .from('forum_replies')
      .select(`
        *,
        user:users!forum_replies_user_id_fkey(id, name, email, profile_picture)
      `)
      .eq('thread_id', req.params.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    res.json({ success: true, data: { thread, replies: replies || [] } });
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

// @route   POST /api/forum/:id/upvote
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const { data: thread, error } = await supabase
      .from('forum_threads')
      .select('*, upvotes, downvotes')
      .eq('id', req.params.id)
      .single();

    if (error || !thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    const upvotes = thread.upvotes || [];
    const downvotes = thread.downvotes || [];
    const userId = req.user.id;

    // Remove from downvotes if present
    const newDownvotes = downvotes.filter(id => id !== userId);
    
    // Toggle upvote
    let newUpvotes;
    if (upvotes.includes(userId)) {
      newUpvotes = upvotes.filter(id => id !== userId); // Remove upvote
    } else {
      newUpvotes = [...upvotes, userId]; // Add upvote
    }

    const { data: updated, error: updateError } = await supabase
      .from('forum_threads')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum/:id/downvote
router.post('/:id/downvote', protect, async (req, res) => {
  try {
    const { data: thread, error } = await supabase
      .from('forum_threads')
      .select('*, upvotes, downvotes')
      .eq('id', req.params.id)
      .single();

    if (error || !thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    const upvotes = thread.upvotes || [];
    const downvotes = thread.downvotes || [];
    const userId = req.user.id;

    // Remove from upvotes if present
    const newUpvotes = upvotes.filter(id => id !== userId);
    
    // Toggle downvote
    let newDownvotes;
    if (downvotes.includes(userId)) {
      newDownvotes = downvotes.filter(id => id !== userId); // Remove downvote
    } else {
      newDownvotes = [...downvotes, userId]; // Add downvote
    }

    const { data: updated, error: updateError } = await supabase
      .from('forum_threads')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum/reply/:replyId/upvote
router.post('/reply/:replyId/upvote', protect, async (req, res) => {
  try {
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .select('*, upvotes, downvotes')
      .eq('id', req.params.replyId)
      .single();

    if (error || !reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    const upvotes = reply.upvotes || [];
    const downvotes = reply.downvotes || [];
    const userId = req.user.id;

    const newDownvotes = downvotes.filter(id => id !== userId);
    
    let newUpvotes;
    if (upvotes.includes(userId)) {
      newUpvotes = upvotes.filter(id => id !== userId);
    } else {
      newUpvotes = [...upvotes, userId];
    }

    const { data: updated, error: updateError } = await supabase
      .from('forum_replies')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', req.params.replyId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/forum/reply/:replyId/downvote
router.post('/reply/:replyId/downvote', protect, async (req, res) => {
  try {
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .select('*, upvotes, downvotes')
      .eq('id', req.params.replyId)
      .single();

    if (error || !reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    const upvotes = reply.upvotes || [];
    const downvotes = reply.downvotes || [];
    const userId = req.user.id;

    const newUpvotes = upvotes.filter(id => id !== userId);
    
    let newDownvotes;
    if (downvotes.includes(userId)) {
      newDownvotes = downvotes.filter(id => id !== userId);
    } else {
      newDownvotes = [...downvotes, userId];
    }

    const { data: updated, error: updateError } = await supabase
      .from('forum_replies')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', req.params.replyId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, data: updated });
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
