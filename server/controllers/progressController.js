const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Save lesson progress
// @route   POST /api/progress/lesson
// @access  Private
exports.saveLesson = async (req, res) => {
  try {
    const { language, lessonId, score, totalQuestions, correctAnswers, passed } = req.body;

    // Create progress record
    const progress = await Progress.create({
      user: req.user.id,
      language,
      lessonId,
      score,
      totalQuestions,
      correctAnswers,
      passed
    });

    // Update user's language progress
    const user = await User.findById(req.user.id);
    user.updateStreak();

    let langIndex = user.languages.findIndex(l => l.code === language);
    if (langIndex === -1) {
      // Add language if it doesn't exist
      user.languages.push({
        code: language,
        name: language, // You might want to get the proper name from a language map
        completedLessons: [],
        totalScore: 0
      });
      langIndex = user.languages.length - 1;
    }

    if (passed && !user.languages[langIndex].completedLessons.includes(lessonId)) {
      user.languages[langIndex].completedLessons.push(lessonId);
    }
    user.languages[langIndex].totalScore += score;

    user.totalPoints += score;

    // Check for achievements
    checkAndUnlockAchievements(user);

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        progress,
        user: {
          totalPoints: user.totalPoints,
          streak: user.streak,
          languages: user.languages,
          achievements: user.achievements
        }
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

// @desc    Get user's progress history
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get weekly progress
// @route   GET /api/progress/weekly
// @access  Private
exports.getWeeklyProgress = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const progress = await Progress.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%a", date: "$date" } },
          points: { $sum: "$score" },
          lessons: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save flashcard progress
// @route   POST /api/progress/flashcard
// @access  Private
exports.saveFlashcardProgress = async (req, res) => {
  try {
    const { language, knownCards, learningCards } = req.body;
    const user = await User.findById(req.user.id);

    const flashcardIndex = user.flashcardProgress.findIndex(f => f.language === language);

    if (flashcardIndex !== -1) {
      user.flashcardProgress[flashcardIndex].knownCards = knownCards;
      user.flashcardProgress[flashcardIndex].learningCards = learningCards;
    } else {
      user.flashcardProgress.push({ language, knownCards, learningCards });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.flashcardProgress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save story completion
// @route   POST /api/progress/story
// @access  Private
exports.saveStoryCompletion = async (req, res) => {
  try {
    const { storyId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if already completed
    const exists = user.completedStories.find(s => s.storyId === storyId);
    if (!exists) {
      user.completedStories.push({ storyId });
      user.totalPoints += 20; // Bonus for completing story
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: user.completedStories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save practice session
// @route   POST /api/progress/practice
// @access  Private
exports.savePracticeSession = async (req, res) => {
  try {
    const { language, questionsAnswered, correctAnswers } = req.body;

    // Validate input
    if (!language || questionsAnswered === undefined || correctAnswers === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide language, questionsAnswered, and correctAnswers'
      });
    }

    const user = await User.findById(req.user.id);

    // Add practice session to user's array
    user.practiceSessions.push({
      language,
      questionsAnswered,
      correctAnswers,
      date: new Date()
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        practiceSessions: user.practiceSessions,
        message: 'Practice session recorded successfully'
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

// Helper function to check and unlock achievements
function checkAndUnlockAchievements(user) {
  const achievements = [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      condition: () => user.languages.some(l => l.completedLessons.length >= 1)
    },
    {
      id: 'century',
      name: 'Century Club',
      description: 'Earn 100 points',
      icon: '💯',
      condition: () => user.totalPoints >= 100
    },
    {
      id: 'streak_3',
      name: 'On Fire',
      description: '3 day streak',
      icon: '🔥',
      condition: () => user.streak.current >= 3
    },
    {
      id: 'polyglot',
      name: 'Polyglot',
      description: 'Start learning 3 languages',
      icon: '🌍',
      condition: () => user.languages.length >= 3
    },
    {
      id: 'points_500',
      name: 'High Achiever',
      description: 'Earn 500 points',
      icon: '⭐',
      condition: () => user.totalPoints >= 500
    }
  ];

  achievements.forEach(achievement => {
    const alreadyUnlocked = user.achievements.find(a => a.id === achievement.id);
    if (!alreadyUnlocked && achievement.condition()) {
      user.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: new Date()
      });
    }
  });
}
