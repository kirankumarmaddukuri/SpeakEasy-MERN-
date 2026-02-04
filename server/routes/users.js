const express = require('express');
const router = express.Router();
const {
  updateProfile,
  updateCurrentLanguage,
  completeOnboarding,
  getStats,
  unlockAchievement
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.put('/profile', updateProfile);
router.put('/language', updateCurrentLanguage);
router.put('/onboarding', completeOnboarding);
router.get('/stats', getStats);
router.post('/achievements', unlockAchievement);

module.exports = router;
