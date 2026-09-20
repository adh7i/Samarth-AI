const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');

// GET /api/v1/competencies/user/:id
router.get('/user/:id', (req, res) => {
  const profile = dataStore.getProfile(req.params.id);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'Officer not found' });
  }
  res.json({ success: true, data: profile });
});

// POST /api/v1/competencies/upgrade
router.post('/upgrade', (req, res) => {
  const { userId, competencyId } = req.body;
  const newLevel = dataStore.upgradeCompetency(userId, competencyId);
  const updatedProfile = dataStore.getProfile(userId);
  res.json({
    success: true,
    newLevel,
    readiness_index: updatedProfile.readiness_index
  });
});

module.exports = router;
