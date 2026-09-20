import { TextChunk, MOSPI_OFFICIAL_CHUNKS } from './knowledgeBase';

export interface VectorSearchResult {
  chunk: TextChunk;
  similarity_score: number;
}

class VectorStore {
  private chunks: TextChunk[] = [];
  private vocab: Set<string> = new Set();
  private idf: Map<string, number> = new Map();

  constructor() {
    this.addChunks(MOSPI_OFFICIAL_CHUNKS);
  }

  public addChunks(newChunks: TextChunk[]) {
    this.chunks.push(...newChunks);
    this.recomputeIdf();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  private recomputeIdf() {
    this.vocab.clear();
    this.idf.clear();
    const docCount = this.chunks.length;
    if (docCount === 0) return;

    const docFreq: Map<string, number> = new Map();

    this.chunks.forEach(chunk => {
      const uniqueTokens = new Set(this.tokenize(chunk.text + ' ' + chunk.keywords.join(' ')));
      uniqueTokens.forEach(token => {
        this.vocab.add(token);
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    docFreq.forEach((freq, token) => {
      // Standard smoothed IDF
      this.idf.set(token, Math.log((docCount + 1) / (freq + 1)) + 1);
    });
  }

  private computeVector(text: string): Map<string, number> {
    const tokens = this.tokenize(text);
    const tf: Map<string, number> = new Map();
    tokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));

    const vector: Map<string, number> = new Map();
    let normSq = 0;

    tf.forEach((count, token) => {
      if (this.idf.has(token)) {
        const weight = (count / tokens.length) * (this.idf.get(token) || 1);
        vector.set(token, weight);
        normSq += weight * weight;
      }
    });

    const norm = Math.sqrt(normSq);
    if (norm > 0) {
      vector.forEach((weight, token) => {
        vector.set(token, weight / norm);
      });
    }

    return vector;
  }

  public search(
    query: string,
    namespace?: string,
    topK: number = 4
  ): VectorSearchResult[] {
    const queryVector = this.computeVector(query);
    const queryTokens = new Set(this.tokenize(query));

    const candidates = namespace
      ? this.chunks.filter(c => c.namespace === namespace)
      : this.chunks;

    const scored = candidates.map(chunk => {
      const chunkVector = this.computeVector(chunk.text + ' ' + chunk.keywords.join(' '));
      let dotProduct = 0;

      queryVector.forEach((qWeight, token) => {
        if (chunkVector.has(token)) {
          dotProduct += qWeight * (chunkVector.get(token) || 0);
        }
      });

      // Bonus for exact manual keywords match
      let keywordBonus = 0;
      chunk.keywords.forEach(kw => {
        if (queryTokens.has(kw.toLowerCase())) {
          keywordBonus += 0.08;
        }
      });

      const finalScore = Math.min(1.0, dotProduct + keywordBonus);

      return {
        chunk,
        similarity_score: Number(finalScore.toFixed(4))
      };
    });

    scored.sort((a, b) => b.similarity_score - a.similarity_score);
    return scored.slice(0, topK);
  }

  public getAllChunks(namespace?: string): TextChunk[] {
    return namespace ? this.chunks.filter(c => c.namespace === namespace) : this.chunks;
  }
}

export const vectorStore = new VectorStore();
