const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: '😊'
  },
  currentLanguage: {
    type: String,
    default: null
  },
  languages: [{
    code: String,
    name: String,
    flag: String,
    completedLessons: [Number],
    totalScore: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now }
  }],
  streak: {
    current: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null }
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  completedStories: [{
    storyId: String,
    completedAt: { type: Date, default: Date.now }
  }],
  flashcardProgress: [{
    language: String,
    knownCards: [String],
    learningCards: [String]
  }],
  dailyChallenges: [{
    date: String,
    completed: { type: Boolean, default: false },
    score: Number,
    bonusPoints: Number
  }],
  practiceSessions: [{
    language: String,
    date: { type: Date, default: Date.now },
    questionsAnswered: Number,
    correctAnswers: Number
  }],
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().toDateString();
  const lastActivity = this.streak.lastActivityDate 
    ? new Date(this.streak.lastActivityDate).toDateString() 
    : null;
  
  if (lastActivity === today) {
    // Already updated today
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActivity === yesterday.toDateString()) {
    // Consecutive day
    this.streak.current += 1;
  } else if (lastActivity !== today) {
    // Streak broken
    this.streak.current = 1;
  }
  
  this.streak.lastActivityDate = new Date();
};

module.exports = mongoose.model('User', userSchema);
