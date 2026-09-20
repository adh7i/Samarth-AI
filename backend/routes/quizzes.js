const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');

// POST /api/v1/quizzes/submit
router.post('/submit', (req, res) => {
  const { user_id, answers = [] } = req.body;

  let correctCount = 0;
  answers.forEach(a => {
    if (a.is_correct) correctCount++;
  });

  const total = answers.length || 3;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 70;

  let upgradedCompetency = null;
  if (passed) {
    // Elevate CPI competency
    const newLvl = dataStore.upgradeCompetency(user_id, 'comp_02');
    upgradedCompetency = {
      name: 'CPI Laspeyres Indexation & Price Relatives',
      new_level: newLvl
    };
  }

  const updatedProfile = dataStore.getProfile(user_id);

  res.json({
    success: true,
    data: {
      score_percentage: score,
      passed,
      upgraded_competency: upgradedCompetency,
      new_readiness_index: updatedProfile.readiness_index
    }
  });
});

module.exports = router;
