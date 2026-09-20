import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, quiz_id, answers } = body;

    if (!user_id || !quiz_id || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: 'user_id, quiz_id, and answers array are required' },
        { status: 400 }
      );
    }

    const result = db.submitQuizAttempt(user_id, quiz_id, answers);
    const updatedProfile = db.getUserCompetencyProfile(user_id);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        new_readiness_index: updatedProfile?.readiness_index,
        verified_count: updatedProfile?.verified_competencies,
        gap_count: updatedProfile?.gap_count
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate quiz' },
      { status: 500 }
    );
  }
}
