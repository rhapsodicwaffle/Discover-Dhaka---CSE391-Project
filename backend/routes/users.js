const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, generateFilename } = require('../utils/supabaseUpload');

// @route   GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    
    const user = await UserModel.update(req.user.id, updates);
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/users/profile/picture
router.post('/profile/picture', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload image to Supabase Storage
    const filename = generateFilename(req.file.originalname);
    const imageUrl = await uploadToSupabase(req.file.buffer, 'profiles', filename, req.file.mimetype);
    
    const user = await UserModel.update(req.user.id, {
      profilePicture: imageUrl
    });
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
