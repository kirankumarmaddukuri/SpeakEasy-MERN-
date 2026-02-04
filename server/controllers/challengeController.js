const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');

// @desc    Get today's challenge
// @route   GET /api/challenges/daily
// @access  Private
exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let challenge = await DailyChallenge.findOne({ date: today });

    // If no challenge exists for today, create one
    if (!challenge) {
      challenge = await generateDailyChallenge(today);
    }

    // Check if user already completed today's challenge
    const user = await User.findById(req.user.id);
    const completedToday = user.dailyChallenges.find(c => c.date === today);

    res.status(200).json({
      success: true,
      data: {
        challenge,
        completed: !!completedToday,
        previousScore: completedToday?.score || null
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

// @desc    Submit daily challenge
// @route   POST /api/challenges/daily
// @access  Private
exports.submitDailyChallenge = async (req, res) => {
  try {
    const { score, bonusPoints } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findById(req.user.id);

    // Check if already completed
    const alreadyCompleted = user.dailyChallenges.find(c => c.date === today);
    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Daily challenge already completed'
      });
    }

    // Update streak
    user.updateStreak();

    // Add challenge completion
    user.dailyChallenges.push({
      date: today,
      completed: true,
      score,
      bonusPoints
    });

    // Add points
    user.totalPoints += bonusPoints;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        streak: user.streak,
        dailyChallenges: user.dailyChallenges
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

// Helper function to generate daily challenge
async function generateDailyChallenge(date) {
  // Sample questions pool - in production, you'd have a larger database
  const questionPool = [
    {
      language: 'Spanish',
      question: 'What does "Buenos días" mean?',
      options: ['Good night', 'Good morning', 'Good afternoon', 'Goodbye'],
      correctAnswer: 1,
      type: 'multiple-choice'
    },
    {
      language: 'French',
      question: 'How do you say "Thank you" in French?',
      options: ['Bonjour', 'Merci', 'Au revoir', 'S\'il vous plaît'],
      correctAnswer: 1,
      type: 'multiple-choice'
    },
    {
      language: 'German',
      question: 'What does "Guten Tag" mean?',
      options: ['Good night', 'Goodbye', 'Good day', 'Good morning'],
      correctAnswer: 2,
      type: 'multiple-choice'
    },
    {
      language: 'Japanese',
      question: 'What does "Arigatou" mean?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
      correctAnswer: 2,
      type: 'multiple-choice'
    },
    {
      language: 'Spanish',
      question: 'How do you say "water" in Spanish?',
      options: ['Agua', 'Leche', 'Café', 'Té'],
      correctAnswer: 0,
      type: 'multiple-choice'
    }
  ];

  // Shuffle and pick 5 questions
  const shuffled = questionPool.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 5);

  const challenge = new DailyChallenge({
    date,
    questions: selectedQuestions
  });

  await challenge.save();

  return challenge;
}
