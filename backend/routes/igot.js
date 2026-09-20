const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');

// GET /api/v1/igot/recommendations/:userId
router.get('/recommendations/:userId', (req, res) => {
  const user = dataStore.getUser(req.params.userId);
  res.json({
    success: true,
    data: {
      user,
      recommendations: dataStore.courses
    }
  });
});

// POST /api/v1/igot/sync-apar
router.post('/sync-apar', (req, res) => {
  const { user_id = 'usr_iss_001' } = req.body;
  const result = dataStore.syncApar(user_id);
  res.json({
    success: true,
    data: result
  });
});

module.exports = router;
