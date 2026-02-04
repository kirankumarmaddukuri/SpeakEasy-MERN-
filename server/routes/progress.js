const express = require('express');
const router = express.Router();
const {
  saveLesson,
  getProgress,
  getWeeklyProgress,
  saveFlashcardProgress,
  saveStoryCompletion,
  savePracticeSession
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProgress);

router.post('/lesson', saveLesson);
router.get('/weekly', getWeeklyProgress);
router.post('/flashcard', saveFlashcardProgress);
router.post('/story', saveStoryCompletion);
router.post('/practice', savePracticeSession);

module.exports = router;
