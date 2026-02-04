const express = require('express');
const router = express.Router();
const { getDailyChallenge, submitDailyChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/daily')
  .get(getDailyChallenge)
  .post(submitDailyChallenge);

module.exports = router;
