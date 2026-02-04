const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    required: true
  },
  lessonId: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

// Index for efficient queries
progressSchema.index({ user: 1, date: -1 });
progressSchema.index({ user: 1, language: 1 });

module.exports = mongoose.model('Progress', progressSchema);
