const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const competencyRoutes = require('./routes/competencies');
const ragRoutes = require('./routes/rag');
const quizRoutes = require('./routes/quizzes');
const igotRoutes = require('./routes/igot');
const statbotRoutes = require('./routes/statbot');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/competencies', competencyRoutes);
app.use('/api/v1/rag', ragRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/igot', igotRoutes);
app.use('/api/v1/chat', statbotRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StatSamarth AI Backend Service',
    ministry: 'MoSPI, Government of India',
    framework: 'iGOT Karmayogi FRAC',
    timestamp: new Date().toISOString()
  });
});

// Optionally serve frontend files if accessed directly
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`[StatSamarth AI Backend] Running on http://localhost:${PORT}`);
  console.log(`[StatSamarth AI Backend] API Endpoints ready at http://localhost:${PORT}/api/v1/`);
});

module.exports = app;
