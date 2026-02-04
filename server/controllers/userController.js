const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      avatar: req.body.avatar
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update current language
// @route   PUT /api/users/language
// @access  Private
exports.updateCurrentLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if language already exists in user's languages
    const existingLanguage = user.languages.find(l => l.code === language.code);
    
    if (!existingLanguage) {
      // Add new language
      user.languages.push({
        code: language.code,
        name: language.name,
        flag: language.flag,
        completedLessons: [],
        totalScore: 0
      });
    }
    
    user.currentLanguage = language.code;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Complete onboarding
// @route   PUT /api/users/onboarding
// @access  Private
exports.completeOnboarding = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { onboardingCompleted: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const Progress = require('../models/Progress');
    
    // Get progress for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyProgress = await Progress.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalScore: { $sum: "$score" },
          lessonsCompleted: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        streak: user.streak,
        languagesCount: user.languages.length,
        achievements: user.achievements,
        weeklyProgress
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unlock achievement
// @route   POST /api/users/achievements
// @access  Private
exports.unlockAchievement = async (req, res) => {
  try {
    const { achievement } = req.body;
    const user = await User.findById(req.user.id);
    
    // Check if achievement already exists
    const exists = user.achievements.find(a => a.id === achievement.id);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already unlocked'
      });
    }
    
    user.achievements.push(achievement);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.achievements
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
