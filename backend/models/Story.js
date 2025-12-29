const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a story title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide story content']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  placeName: {
    type: String,
    required: true
  },
  lat: Number,
  lng: Number,
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366'
  },
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

storySchema.index({ author: 1 });
storySchema.index({ tags: 1 });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
