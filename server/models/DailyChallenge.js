const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'multiple-choice'
  }
}, { _id: false });

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
