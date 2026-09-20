const express = require('express');
const router = express.Router();
const ragEngine = require('../services/ragEngine');
const dataStore = require('../services/dataStore');

// GET /api/v1/rag/materials
router.get('/materials', (req, res) => {
  res.json({ success: true, materials: dataStore.materials });
});

// POST /api/v1/rag/upload-document
router.post('/upload-document', (req, res) => {
  const { title, content, category = 'Official Statistical Manual' } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and content are required' });
  }

  const namespace = 'user-doc-' + Date.now();
  const chunks = ragEngine.chunkText(title, content, namespace);

  const newMat = {
    id: `mat_${Date.now()}`,
    title,
    category,
    pages: Math.max(1, Math.ceil(chunks.length / 2)),
    size: `${(content.length / 1024).toFixed(1)} KB`,
    vector_namespace: namespace
  };
  dataStore.materials.unshift(newMat);

  res.json({
    success: true,
    message: `Document '${title}' indexed with ${chunks.length} semantic chunks`,
    material: newMat
  });
});

// POST /api/v1/rag/generate-quiz
router.post('/generate-quiz', (req, res) => {
  const { blooms_level = 'Apply', question_count = 3, target_topic = '' } = req.body;

  const sampleQuestions = [
    {
      id: `gen_q1_${Date.now()}`,
      question: 'Under official MoSPI CPI Base 2012 methodology, which mathematical formula is mandated for elementary aggregates at the market/village level across quotations?',
      options: [
        { key: 'A', text: 'Arithmetic Mean of price ratios (Carli formula)' },
        { key: 'B', text: 'Geometric Mean of price relatives (Jevons index formula)' },
        { key: 'C', text: 'Harmonic Mean of relative expenditure shares' },
        { key: 'D', text: 'Median quotation price weighted by population quantiles' }
      ],
      correct: 'B',
      explanation: 'MoSPI officially mandated the Jevons formula (Geometric Mean) for elementary aggregations to eliminate upward substitution bias and ensure time-reversal symmetry.',
      citation: {
        manual: 'Consumer Price Index (CPI Base 2012=100) Compilation Guide',
        section: 'Chapter 4: Elementary Aggregation',
        para: 'Page 34, Paragraph 4.2.1',
        quote: 'Elementary price relatives are aggregated across selected markets within each state using the Geometric Mean (Jevons formula).'
      }
    },
    {
      id: `gen_q2_${Date.now()}`,
      question: 'In an NSSO rural household survey, if an FSU census village has an estimated population exceeding 1,200 persons, what is the mandatory protocol for Sub-Unit (SU) formation?',
      options: [
        { key: 'A', text: 'Discard the FSU and substitute with an adjacent village' },
        { key: 'B', text: 'Divide into hamlet-groups of equal size and select exactly two (SU 1 purposive, SU 2 random)' },
        { key: 'C', text: 'Survey all households without sub-division' },
        { key: 'D', text: 'Only enumerate households located on the village perimeter' }
      ],
      correct: 'B',
      explanation: 'When population exceeds 1,200 in rural FSUs, division into hamlet-groups is strictly enforced. Two sub-units are selected: SU 1 purposively and SU 2 randomly.',
      citation: {
        manual: 'NSSO 80th Round Household Survey Operations Manual',
        section: 'Chapter 3: Formation of Sub-Units (SUs) and Hamlet-Groups',
        para: 'Page 31, Section 3.4',
        quote: 'Two sub-units are selected: SU 1 (with maximum population) and SU 2 (randomly selected from remaining).'
      }
    },
    {
      id: `gen_q3_${Date.now()}`,
      question: 'Which sector carries the single highest individual weighting in India’s Index of Eight Core Industries (Base 2011-12)?',
      options: [
        { key: 'A', text: 'Refinery Products (28.04% within Core Index)' },
        { key: 'B', text: 'Electricity Generation (19.85%)' },
        { key: 'C', text: 'Steel Production (17.92%)' },
        { key: 'D', text: 'Coal Mining (10.33%)' }
      ],
      correct: 'A',
      explanation: 'Refinery Products holds the highest weight in the Eight Core Industries (28.04%), which altogether comprise 40.27% of the total IIP.',
      citation: {
        manual: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
        section: 'Chapter 4: Eight Core Industries Index',
        para: 'Page 28, Section 4.3',
        quote: 'Refinery Products carries the highest individual weight (28.04% within core industries).'
      }
    }
  ];

  res.json({
    success: true,
    quiz: {
      id: `quiz_${Date.now()}`,
      title: `MoSPI ${blooms_level.toUpperCase()} Competency Assessment`,
      blooms_level,
      questions: sampleQuestions.slice(0, question_count)
    }
  });
});

module.exports = router;
