import { NextResponse } from 'next/server';
import { vectorStore } from '@/lib/rag/vectorStore';
import { MOSPI_OFFICIAL_CHUNKS } from '@/lib/rag/knowledgeBase';

// ─── Gemini API helper ───────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          }
        })
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

// ─── Build full knowledge context string ──────────────────────────────────────
function buildKnowledgeContext(searchResults: { chunk: any; similarity_score: number }[]): string {
  if (!searchResults.length) return '';
  return searchResults
    .slice(0, 3)
    .map((r, i) =>
      `[Source ${i + 1}] ${r.chunk.manual_title} — ${r.chunk.section} (${r.chunk.page_or_para}):\n${r.chunk.text}`
    )
    .join('\n\n');
}

// ─── Smart local answer engine (handles any question without an LLM) ──────────
function localSmartAnswer(
  query: string,
  searchResults: { chunk: any; similarity_score: number }[]
): { text: string; citations: any[] } {
  const qLower = query.toLowerCase().trim();
  const citations = searchResults.slice(0, 2).map(r => ({
    manual_title: r.chunk.manual_title,
    section: r.chunk.section,
    page_or_para: r.chunk.page_or_para,
    similarity_confidence: `${(r.similarity_score * 100).toFixed(1)}%`
  }));

  // ── Maths / general knowledge ───────────────────────────────────────────────
  const mathMatch = query.match(/^[\s\d+\-*/^().\s]+$/) || qLower.match(/what\s+is\s+([\d\s+\-*/^().]+)/);
  if (mathMatch) {
    try {
      // Safe eval for basic arithmetic only
      const expr = query.replace(/[^0-9+\-*/().^ ]/g, '').trim();
      if (expr) {
        const result = Function(`"use strict"; return (${expr.replace(/\^/g, '**')})`)();
        if (typeof result === 'number' && isFinite(result)) {
          return {
            text: `The answer is **${result}**.\n\nI'm StatBot, your MoSPI Statistical Assistant. I can also help you with:\n- CPI Laspeyres/Jevons index methodology\n- NSSO sampling design & FSU definitions\n- IIP Base 2011-12 sectoral weights\n- National Accounts (GVA/GDP) formulas\n- iGOT Karmayogi FRAC competency gaps\n\nFeel free to ask!`,
            citations: []
          };
        }
      }
    } catch {
      // Not a math expression — fall through
    }
  }

  // ── Greetings ───────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon)|howdy)[\s!?.,]*$/.test(qLower)) {
    return {
      text: `Namaste! 👋 I'm **StatBot**, your MoSPI Statistical Intelligence Assistant.\n\nI can answer questions about:\n- 📊 **CPI methodology** — Jevons/Laspeyres index, imputation rules\n- 🏘️ **NSSO sampling** — FSU selection, hamlet-group formation\n- 🏭 **IIP & Core Industries** — sectoral weights, item basket\n- 💹 **National Accounts** — GVA, GDP, FISIM\n- 🎓 **iGOT Karmayogi FRAC** — competency gaps, training recommendations\n\nWhat would you like to know?`,
      citations: []
    };
  }

  // ── Who are you / what can you do ───────────────────────────────────────────
  if (/who are you|what (are|can) you|your (name|purpose)|about you/.test(qLower)) {
    return {
      text: `I'm **StatBot** — an AI assistant built specifically for MoSPI officers on the **अध्ययन** platform.\n\nI use a **Retrieval-Augmented Generation (RAG)** pipeline over official MoSPI methodology manuals to answer questions about:\n\n- Consumer Price Index (CPI) methodology\n- NSSO survey sampling designs\n- Index of Industrial Production (IIP)\n- National Accounts Statistics (GVA, GDP, FISIM)\n- iGOT Karmayogi FRAC competency framework\n\nAsk me anything related to official Indian statistical methodology!`,
      citations: []
    };
  }

  // ── CPI / Laspeyres / Price Index ────────────────────────────────────────────
  if (/cpi|laspeyres|jevons|carli|price\s*index|consumer\s*price|elementary\s*aggr|house\s*rent|rental/.test(qLower)) {
    const relevant = MOSPI_OFFICIAL_CHUNKS.filter(c => c.namespace.includes('cpi'));
    const bestChunk = searchResults.find(r => r.chunk.namespace?.includes('cpi'))?.chunk || relevant[0];
    return {
      text: `## CPI Methodology — MoSPI Official Guidelines\n\n**Elementary Aggregation (Market Level):**\nPrice relatives use the **Jevons Index** (Geometric Mean):\n$$R_i = \\left(\\prod_{j=1}^{m} \\frac{P_{t,j}}{P_{0,j}}\\right)^{1/m}$$\nThe Carli (arithmetic mean) was deprecated due to upward bias and failure of the time-reversal test.\n\n**Higher-Level Aggregation:**\nModified **Laspeyres** formula:\n$$I_t = \\frac{\\sum_i W_i \\cdot R_{i,t}}{\\sum_i W_i}$$\nWeights are from the **NSS 68th Round CES (2011-12)**.\n\n**Missing Price Imputation:**\nTemporarily missing prices → stratum-average movement. Permanent substitutions → **overlap pricing** to avoid spurious inflation.\n\n**House Rent (Urban):** 6-month moving chain-panel approach with rental equivalency for owner-occupied dwellings.\n\n*Source: CPI Base 2012=100 Methodology & Compilation Guide*`,
      citations: citations.length ? citations : [{ manual_title: 'CPI Base 2012=100 Methodology & Compilation Guide', section: 'Chapters 4–7', page_or_para: 'Pages 34–59', similarity_confidence: '—' }]
    };
  }

  // ── NSSO / Sampling / FSU / Hamlet ──────────────────────────────────────────
  if (/nsso|sampling|fsu|first\s*stage|hamlet|sub.unit|ufs|circular\s*systematic|multiplier|sss|second\s*stage/.test(qLower)) {
    return {
      text: `## NSSO Multi-Stage Sampling Design\n\n**Stage 1 — First Stage Units (FSUs):**\n- **Rural:** Census Revenue Villages (Panchayat wards in Kerala)\n- **Urban:** Urban Frame Survey (UFS) blocks (~100–150 households)\n\n**Hamlet-Group / Sub-Unit Formation:**\nLarge FSUs (population ≥ **1,200** rural / ≥ **1,400** urban) are sub-divided:\n- **SU 1** — purposively selected (max population)\n- **SU 2** — randomly by SRSWOR from remaining sub-units\n\n**Stage 2 — Household Selection:**\nHouseholds within each FSU are stratified into **Second Stage Strata (SSS)** by consumption expenditure, then selected via **circular systematic sampling** with equal probability.\n\n**Multiplier Weights:** Calibrated against projected population totals for unbiased national estimates.\n\n*Source: NSSO 80th Round Sampling Design Manual*`,
      citations: citations.length ? citations : [{ manual_title: 'NSSO 80th Round Sampling Design Manual', section: 'Chapters 2–4', page_or_para: 'Pages 19–45', similarity_confidence: '—' }]
    };
  }

  // ── IIP / Industrial / Core Industries ──────────────────────────────────────
  if (/iip|industrial\s*production|core\s*industr|mining|manufactur|eight\s*core|refinery|steel|electricity\s*weight|coal|cement|fertilizer/.test(qLower)) {
    return {
      text: `## IIP Base 2011-12 & Eight Core Industries\n\n**Sectoral Weights (IIP):**\n| Sector | Weight |\n|---|---|\n| Manufacturing | **77.63%** (407 item groups) |\n| Mining | **14.37%** (29 item groups) |\n| Electricity | **8.00%** |\n\n**Eight Core Industries** (combined weight: **40.27%** of IIP):\n| Industry | Weight within Core |\n|---|---|\n| Refinery Products | **28.04%** |\n| Electricity | 19.85% |\n| Steel | 17.92% |\n| Coal | 10.33% |\n| Cement | 5.37% |\n| Natural Gas | 6.88% |\n| Crude Oil | 8.98% |\n| Fertilizers | 2.63% |\n\n**Frame Source:** Annual Survey of Industries (ASI) 2011-12.\n\n*Source: IIP Base 2011-12 Compilation Manual*`,
      citations: citations.length ? citations : [{ manual_title: 'IIP Base 2011-12 Compilation Manual', section: 'Chapters 2 & 4', page_or_para: 'Pages 14–28', similarity_confidence: '—' }]
    };
  }

  // ── NAS / GVA / GDP / FISIM ─────────────────────────────────────────────────
  if (/gva|gdp|national\s*accounts|nas|fisim|deflat|basic\s*prices|market\s*prices|intermediate\s*consumption|supply\s*use|sut/.test(qLower)) {
    return {
      text: `## National Accounts Statistics (SNA 2008 Framework)\n\n**GVA at Basic Prices:**\n$$\\text{GVA}_{\\text{Basic}} = \\text{Gross Output}_{\\text{Basic}} - \\text{Intermediate Consumption}_{\\text{Purchaser}}$$\n\n**GDP at Market Prices:**\n$$\\text{GDP}_{\\text{Market}} = \\text{GVA}_{\\text{Basic}} + \\text{Product Taxes} - \\text{Product Subsidies}$$\n\n> **Note:** Basic prices include production taxes/subsidies (land revenue, stamp duty) but **exclude** product taxes (GST, petroleum cess).\n\n**FISIM (Financial Intermediation Services Indirectly Measured):**\n- Measured as interest margin above a *pure reference rate*\n- Allocated between **intermediate consumption** (industries) and **final consumption** (households)\n- **Double Deflation:** Gross output deflated by output deflator; intermediate inputs by input-specific deflators.\n\n*Source: NAS Sources & Methods, Chapter 3 & 6*`,
      citations: citations.length ? citations : [{ manual_title: 'National Accounts Statistics: Sources and Methods', section: 'Chapters 3 & 6', page_or_para: 'Pages 48–82', similarity_confidence: '—' }]
    };
  }

  // ── FRAC / iGOT / Karmayogi / Competency ────────────────────────────────────
  if (/frac|igot|karmayogi|competency|competencies|gap|apar|skill|training|proficiency/.test(qLower)) {
    return {
      text: `## iGOT Karmayogi FRAC Framework\n\n**FRAC** stands for **F**unctions, **R**oles, **A**ctivities & **C**ompetencies — the official competency mapping framework for Government of India officers under the Karmayogi Mission.\n\n**Key Components:**\n- **Roles** → mapped to official post designations (e.g., ISS Officer, Deputy Director)\n- **Activities** → day-to-day tasks linked to each role\n- **Competencies** → knowledge, skills & behaviours required at each proficiency level (1–5)\n\n**अध्ययन uses FRAC to:**\n1. Assess your current competency level across 10+ domains\n2. Identify gaps vs. required MoSPI benchmark levels\n3. Recommend targeted iGOT Karmayogi courses to bridge gaps\n4. Generate RAG-based MCQ assessments from official manuals\n5. Sync verified assessments to your **e-APAR Passbook**\n\n**Proficiency Scale:** 1 (Awareness) → 5 (Expert/Mastery)\n\nCheck the **Dashboard** tab to view your FRAC gap analysis!`,
      citations: []
    };
  }

  // ── Vector store best match — general fallback with context ─────────────────
  const primaryResult = searchResults[0];
  const topScore = primaryResult?.similarity_score ?? 0;

  if (topScore > 0.15 && primaryResult?.chunk?.text) {
    const chunk = primaryResult.chunk;
    return {
      text: `## ${chunk.section || 'MoSPI Statistical Methodology'}\n\n*From: ${chunk.manual_title} (${chunk.page_or_para})*\n\n${chunk.text}\n\n---\n*I found this from the official MoSPI knowledge base. For more specific questions, try asking about CPI, NSSO sampling, IIP, GVA/GDP, or FRAC competencies.*`,
      citations
    };
  }

  // ── Final catch-all ──────────────────────────────────────────────────────────
  return {
    text: `I'm **StatBot**, optimized for MoSPI statistical methodology questions. I couldn't find a specific answer for **"${query}"** in my knowledge base.\n\nHere's what I can help with:\n\n| Topic | Example Questions |\n|---|---|\n| 📊 CPI | *How is the Jevons index computed?* |\n| 🏘️ NSSO | *What is a First Stage Unit (FSU)?* |\n| 🏭 IIP | *Which sector has the highest IIP weight?* |\n| 💹 GDP/GVA | *How is GVA converted to GDP?* |\n| 🎓 FRAC | *What is iGOT Karmayogi FRAC?* |\n\nFor general knowledge questions (like math), I'll also do my best to help!`,
    citations: []
  };
}

// ─── API Route ────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query message is required' },
        { status: 400 }
      );
    }

    // 1. Vector search for context
    const searchResults = vectorStore.search(message, undefined, 3);

    // 2. Try Gemini first (if API key is set)
    let reply: string | null = null;
    const knowledgeContext = buildKnowledgeContext(searchResults);

    if (process.env.GEMINI_API_KEY) {
      const systemPrompt = `You are StatBot, an expert AI assistant for MoSPI (Ministry of Statistics and Programme Implementation) officers on the अध्ययन platform.

You answer questions accurately and helpfully. For statistical/MoSPI questions, use the provided knowledge context. For general questions (math, general knowledge, greetings), answer them directly and naturally.

${knowledgeContext ? `\nKNOWLEDGE BASE CONTEXT:\n${knowledgeContext}\n` : ''}

FORMATTING RULES:
- Use markdown formatting (bold, tables, numbered lists)
- Keep responses concise but complete
- For MoSPI topics, cite specific sections where possible
- For general/non-MoSPI questions, answer helpfully and then offer to help with statistical topics

USER QUESTION: ${message}`;

      reply = await callGemini(systemPrompt);
    }

    // 3. Fall back to local smart engine
    const localAnswer = localSmartAnswer(message, searchResults);
    const finalReply = reply || localAnswer.text;

    const citations = searchResults.slice(0, 2).map(r => ({
      manual_title: r.chunk.manual_title,
      section: r.chunk.section,
      page_or_para: r.chunk.page_or_para,
      similarity_confidence: `${(r.similarity_score * 100).toFixed(1)}%`
    }));

    return NextResponse.json({
      success: true,
      data: {
        reply: finalReply,
        citations: reply ? citations : localAnswer.citations, // Only show citations when relevant
        suggested_queries: [
          'How is CPI Laspeyres index computed?',
          'What is NSSO First Stage Unit (FSU)?',
          'Which sector has the highest weight in Eight Core Industries?',
          'How is GVA at basic prices converted to GDP?'
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'StatBot processing error' },
      { status: 500 }
    );
  }
}
