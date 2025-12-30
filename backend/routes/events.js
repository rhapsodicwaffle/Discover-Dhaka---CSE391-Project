const express = require('express');
const router = express.Router();
const EventModel = require('../models/EventModel');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, generateFilename } = require('../utils/supabaseUpload');

// @route   GET /api/events
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isApproved: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const events = await EventModel.findAll(query);
    
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
      
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/events
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id,
      isApproved: req.user.role === 'admin'
    };

    // Upload image to Supabase Storage
    if (req.file) {
      const filename = generateFilename(req.file.originalname);
      const imageUrl = await uploadToSupabase(req.file.buffer, 'events', filename, req.file.mimetype);
      eventData.image = imageUrl;
    }
    
    const event = await EventModel.create(eventData);
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/events/:id/attend
router.post('/:id/attend', protect, async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    const attendeeIndex = event.attendees.indexOf(req.user.id);
    let updatedAttendees;
    
    if (attendeeIndex > -1) {
      updatedAttendees = event.attendees.filter(id => id !== req.user.id);
    } else {
      updatedAttendees = [...event.attendees, req.user.id];
    }
    
    const updatedEvent = await EventModel.update(req.params.id, { attendees: updatedAttendees });
    
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/events/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    if (event.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await EventModel.delete(req.params.id);
    
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
