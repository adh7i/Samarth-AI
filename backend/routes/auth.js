const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { userId = 'usr_iss_001' } = req.body;
  const user = dataStore.getUser(userId);
  const profile = dataStore.getProfile(user.id);

  res.json({
    success: true,
    message: 'Authenticated with MoSPI e-Office Directory SSO',
    token: `jwt_mospi_${user.id}`,
    user,
    profile_summary: {
      readiness_index: profile.readiness_index,
      verified_count: profile.verified_competencies,
      gap_count: profile.gap_count
    }
  });
});

// GET /api/v1/auth/officers
router.get('/officers', (req, res) => {
  res.json({
    success: true,
    officers: dataStore.users
  });
});

module.exports = router;
