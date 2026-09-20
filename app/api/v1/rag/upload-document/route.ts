import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { chunkDocumentText } from '@/lib/rag/chunker';
import { vectorStore } from '@/lib/rag/vectorStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      uploaded_by = 'usr_iss_001',
      category = 'Official Statistical Manual',
      fileName = 'manual_upload.txt'
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Document title and text content are required' },
        { status: 400 }
      );
    }

    const namespace = 'user-doc-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Date.now();

    // 1. Chunk document
    const chunkResult = chunkDocumentText(title, content, namespace);

    // 2. Embed & Index into Vector Store
    vectorStore.addChunks(chunkResult.chunks);

    // 3. Register in learning_materials
    const material = db.addLearningMaterial({
      title,
      uploaded_by,
      file_path: `/uploads/${fileName}`,
      vector_namespace: namespace,
      file_size: `${(content.length / 1024).toFixed(1)} KB`,
      page_count: Math.max(1, Math.ceil(chunkResult.totalWords / 250)),
      category,
      summary: chunkResult.chunks[0]?.text.slice(0, 200) + '...'
    });

    return NextResponse.json({
      success: true,
      message: `Document '${title}' ingested and embedded into vector namespace '${namespace}'`,
      material,
      chunks_indexed: chunkResult.chunks.length,
      total_words: chunkResult.totalWords,
      sample_chunks: chunkResult.chunks.slice(0, 2)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process document' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const materials = db.getLearningMaterials();
  return NextResponse.json({
    success: true,
    materials
  });
}
