/**
 * StatSamarth AI - RAG Vector Similarity Search & MCQ Engine
 */

const { MOSPI_OFFICIAL_CHUNKS } = require('./knowledgeBase');

class RAGEngine {
  constructor() {
    this.chunks = [...MOSPI_OFFICIAL_CHUNKS];
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  addChunks(newChunks) {
    this.chunks.push(...newChunks);
  }

  chunkText(title, rawText, namespace) {
    const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 30);
    const newChunks = paragraphs.map((p, idx) => {
      const lower = p.toLowerCase();
      const keywords = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 3).slice(0, 8);
      return {
        id: `${namespace}_chk_${idx + 1}`,
        namespace,
        manual_title: title,
        section: `Section ${Math.floor(idx / 2) + 1} (Uploaded Extract)`,
        page_or_para: `Page ${Math.floor(idx / 2) + 1}, Paragraph ${(idx % 3) + 1}`,
        text: p.trim(),
        keywords
      };
    });
    this.addChunks(newChunks);
    return newChunks;
  }

  search(query, namespace, topK = 3) {
    const qTokens = new Set(this.tokenize(query));
    const candidates = namespace ? this.chunks.filter(c => c.namespace === namespace) : this.chunks;

    const scored = candidates.map(chunk => {
      const cTokens = this.tokenize(chunk.text + ' ' + chunk.keywords.join(' '));
      let matches = 0;
      cTokens.forEach(t => {
        if (qTokens.has(t)) matches++;
      });
      const score = matches / Math.max(1, qTokens.size);
      return { chunk, score: Number(score.toFixed(3)) };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

module.exports = new RAGEngine();
