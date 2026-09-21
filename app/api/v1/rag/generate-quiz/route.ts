import { NextResponse } from 'next/server';
import { generateRagQuiz } from '@/lib/rag/mcqEngine';
import { db } from '@/lib/db/database';
import { BloomsTaxonomyLevel } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      material_id,
      namespace,
      blooms_level = 'Apply',
      question_count = 5,
      competency_id,
      target_topic = ''
    } = body;

    const validatedBlooms: BloomsTaxonomyLevel =
      ['Remember', 'Apply', 'Analyze'].includes(blooms_level)
        ? blooms_level
        : 'Apply';

    const count = Math.min(20, Math.max(3, Number(question_count) || 5));

    const generatedQuiz = generateRagQuiz({
      materialId: material_id,
      namespace,
      bloomsLevel: validatedBlooms,
      questionCount: count,
      competencyId: competency_id,
      targetTopic: target_topic
    });

    const savedQuiz = db.addQuiz(generatedQuiz);

    return NextResponse.json({
      success: true,
      message: `Generated ${savedQuiz.questions_json.length} MCQs at Bloom's level: ${validatedBlooms}`,
      quiz: savedQuiz
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Quiz generation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get('id');

  if (quizId) {
    const quiz = db.getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, quiz });
  }

  const quizzes = db.getQuizzes();
  return NextResponse.json({
    success: true,
    quizzes
  });
}
