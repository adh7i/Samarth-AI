import { TextChunk } from './knowledgeBase';

export interface ChunkResult {
  chunks: TextChunk[];
  totalWords: number;
  namespace: string;
}

export function chunkDocumentText(
  title: string,
  rawText: string,
  namespace: string
): ChunkResult {
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 40);

  const chunks: TextChunk[] = [];
  let totalWords = 0;

  paragraphs.forEach((p, idx) => {
    const words = p.split(/\s+/).filter(Boolean);
    totalWords += words.length;

    // Extract top keywords for vector search
    const lower = p.toLowerCase();
    const cleanTokens = lower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'about'].includes(w));

    const tokenCounts = new Map<string, number>();
    cleanTokens.forEach(t => tokenCounts.set(t, (tokenCounts.get(t) || 0) + 1));
    const topKeywords = Array.from(tokenCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);

    // Approximate section / paragraph numbering
    const sectionMatch = p.match(/(Chapter\s+\d+|Section\s+[\d.]+|Part\s+[A-Z\d]+)/i);
    const section = sectionMatch ? sectionMatch[0] : `Section ${Math.floor(idx / 3) + 1}`;
    const pageNum = Math.floor(idx / 2) + 1;

    chunks.push({
      id: `${namespace}_chk_${idx + 1}`,
      namespace,
      manual_title: title,
      section: `${section} (Extracted Context)`,
      page_or_para: `Page ${pageNum}, Paragraph ${(idx % 3) + 1}`,
      text: p.trim(),
      keywords: topKeywords
    });
  });

  return {
    chunks,
    totalWords,
    namespace
  };
}
