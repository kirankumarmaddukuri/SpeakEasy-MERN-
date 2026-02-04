const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  readTime: {
    type: String,
    default: '3 min'
  },
  sentences: [{
    text: String,
    translation: String
  }],
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Story', storySchema);
