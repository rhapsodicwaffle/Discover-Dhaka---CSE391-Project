const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide route name'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  duration: {
    type: String,
    default: 'N/A'
  },
  distance: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['custom', 'heritage', 'food', 'historical', 'cultural'],
    default: 'custom'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard'],
    default: 'easy'
  }
}, {
  timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
