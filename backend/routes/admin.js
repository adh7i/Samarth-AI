const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');

// GET /api/v1/admin/zonal-analytics
router.get('/zonal-analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        total_officers: 1670,
        national_avg_readiness: 76.5,
        target_readiness: 85.0,
        pending_apar_sync: 184
      },
      zones: [
        { zone: 'North Zone - New Delhi', headquarters: 'Sardar Patel Bhawan, New Delhi', officers_count: 420, avg_readiness_index: 78.4, top_gap_competency: 'Python & R for Microdata', apar_sync_rate: 92.5 },
        { zone: 'East Zone - Kolkata', headquarters: 'Mahalanobis Bhavan, Baranagar', officers_count: 380, avg_readiness_index: 71.2, top_gap_competency: 'CPI Laspeyres Indexation', apar_sync_rate: 84.0 },
        { zone: 'South Zone - Bengaluru', headquarters: 'Kendriya Sadan, Koramangala', officers_count: 340, avg_readiness_index: 82.6, top_gap_competency: 'System of National Accounts (SNA 2008)', apar_sync_rate: 95.8 },
        { zone: 'West Zone - Mumbai', headquarters: 'CGO Complex, CBD Belapur', officers_count: 310, avg_readiness_index: 76.0, top_gap_competency: 'CAPI / Modern Digital Survey Instruments', apar_sync_rate: 88.2 },
        { zone: 'Central Zone - Bhopal', headquarters: 'Paryavaran Parisar, Bhopal', officers_count: 220, avg_readiness_index: 68.5, top_gap_competency: 'Python & R for Microdata', apar_sync_rate: 79.0 }
      ],
      competency_heatmap: dataStore.competencies.map(c => ({
        competency_name: c.name,
        category: c.category,
        iss_cadre_gap: Number((Math.random() * 1.5 + 0.5).toFixed(1)),
        sss_cadre_gap: Number((Math.random() * 2.0 + 1.0).toFixed(1)),
        field_staff_gap: Number((Math.random() * 2.5 + 1.2).toFixed(1)),
        urgency: c.required >= 4 ? 'HIGH' : 'MEDIUM'
      }))
    }
  });
});

// GET /api/v1/admin/export-apar
router.get('/export-apar', (req, res) => {
  const userId = req.query.userId || 'usr_iss_001';
  const profile = dataStore.getProfile(userId);

  res.json({
    success: true,
    data: {
      dossier_id: `MOSPI-APAR-${profile.user.apar_id}-2025`,
      issuing_authority: 'Ministry of Statistics & Programme Implementation (MoSPI), Government of India',
      framework: 'iGOT Karmayogi FRAC (Framework of Roles, Activities, and Competencies)',
      generated_at: new Date().toISOString(),
      officer_details: {
        name: profile.user.name,
        email: profile.user.email,
        cadre_role: profile.user.role_title,
        zone: profile.user.zone,
        department: profile.user.department,
        apar_id: profile.user.apar_id
      },
      audit_metrics: {
        skill_readiness_index: `${profile.readiness_index}%`,
        verified_competencies: `${profile.verified_competencies} / ${profile.total_competencies}`,
        status: profile.apar_status.synced ? 'SYNCHRONIZED' : 'PENDING'
      },
      competency_evaluation_matrix: profile.gaps.map(g => ({
        competency_name: g.competency_name,
        category: g.category,
        required_frac_level: `Level ${g.required_level}`,
        assessed_level: `Level ${g.current_level}`,
        compliance_status: g.status
      })),
      digital_signature: {
        hash: 'SHA256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        certifying_officer: 'Joint Secretary (Training & Administration), MoSPI HQ'
      }
    }
  });
});

module.exports = router;
