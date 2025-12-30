const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a place name'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Culture', 'Nature', 'History', 'Nightlife', 'Art']
  },
  description: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://picsum.photos/400/300'
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  visitCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

placeSchema.index({ lat: 1, lng: 1 });
placeSchema.index({ category: 1 });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
