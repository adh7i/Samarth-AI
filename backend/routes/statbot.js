const express = require('express');
const router = express.Router();
const ragEngine = require('../services/ragEngine');

// POST /api/v1/chat/statbot
router.post('/statbot', (req, res) => {
  const { message = '' } = req.body;
  const searchResults = ragEngine.search(message, undefined, 2);
  const lower = message.toLowerCase();

  let replyText = 'MoSPI official guidelines mandate standard survey sampling methodologies, transparent deflators, and verified base periods.';
  let citation = null;

  if (lower.includes('cpi') || lower.includes('laspeyres') || lower.includes('jevons')) {
    replyText = `### MoSPI Consumer Price Index (Base 2012=100) Methodology\n\n1. **Elementary Level**: MoSPI officially deploys the **Jevons Index (Geometric Mean)**:\n   $$\\mathcal{R}_i = \\left(\\prod_{j=1}^m \\frac{P_{t,j}}{P_{0,j}}\\right)^{1/m}$$\n   This satisfies time-reversal invariance and mitigates upward substitution bias.\n2. **Aggregated Level**: Aggregated via Modified Laspeyres formula with base consumption expenditure weights from NSS 68th Round.\n3. **Item Substitutions**: Overlap pricing protocol is enforced to decouple quality improvements from genuine inflation.`;
    citation = {
      manual_title: 'Consumer Price Index (CPI Base 2012=100) Compilation Guide',
      section: 'Chapter 4: Elementary Aggregates and Price Relatives',
      page_or_para: 'Page 34, Paragraph 4.2.1'
    };
  } else if (lower.includes('nsso') || lower.includes('fsu') || lower.includes('sampling')) {
    replyText = `### NSSO Multi-Stage Stratified Sampling Architecture\n\n- **Rural First Stage Units (FSUs)**: Census Revenue Villages (Panchayat wards in Kerala).\n- **Urban FSUs**: Urban Frame Survey (UFS) blocks comprising 100–150 households.\n- **Hamlet-Group Protocol**: Mandatory when population ≥ 1,200 (rural) or ≥ 1,400 (urban). Exactly 2 sub-units selected.\n- **Households (USUs)**: Selected via circular systematic sampling with equal probability.`;
    citation = {
      manual_title: 'NSSO 80th Round Household Survey Operations Manual',
      section: 'Chapter 2: Sampling Design and Estimation Procedure',
      page_or_para: 'Page 19, Paragraph 2.2.1'
    };
  } else if (lower.includes('iip') || lower.includes('core')) {
    replyText = `### Index of Industrial Production (IIP Base 2011-12)\n\n- **Broad Sectors**: Manufacturing (77.63%), Mining (14.37%), Electricity (8.00%).\n- **Eight Core Industries**: Constitute **40.27%** of the entire IIP. Refinery Products holds the largest individual core weight (28.04%), followed by Electricity (19.85%) and Steel (17.92%).`;
    citation = {
      manual_title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
      section: 'Chapter 4: Eight Core Industries Index',
      page_or_para: 'Page 28, Section 4.3'
    };
  } else if (searchResults.length > 0) {
    const top = searchResults[0].chunk;
    replyText = `### Official MoSPI Methodological Guidance\n\nAccording to **${top.manual_title}** (${top.section}):\n\n"${top.text}"`;
    citation = {
      manual_title: top.manual_title,
      section: top.section,
      page_or_para: top.page_or_para
    };
  }

  res.json({
    success: true,
    data: {
      reply: replyText,
      citations: citation ? [citation] : []
    }
  });
});

module.exports = router;
