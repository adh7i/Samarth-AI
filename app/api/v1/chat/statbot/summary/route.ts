import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
  }

  try {
    const profile = db.getUserCompetencyProfile(userId);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const recsData = db.getIgotRecommendations(userId);

    // Build per-competency summary with matched courses
    const competencySummary = profile.gaps.map(gap => {
      const course = recsData.recommendations.find(r => r.competency_id === gap.competency_id);
      return {
        competency_id: gap.competency_id,
        competency_name: gap.competency_name,
        category: gap.category,
        current_level: gap.current_level,
        required_level: gap.required_level,
        gap: gap.gap,
        status: gap.status,
        readiness_percentage: gap.readiness_percentage,
        course: course
          ? {
              id: course.id,
              course_title: course.course_title,
              provider: course.provider,
              igot_course_id: course.igot_course_id,
              duration_mins: course.duration_mins,
              rating: course.rating,
              match_score: course.match_score,
              tags: course.tags,
              target_level: course.target_level,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        user: profile.user,
        readiness_index: profile.readiness_index,
        total_competencies: profile.total_competencies,
        verified_competencies: profile.verified_competencies,
        gap_count: profile.gap_count,
        competency_summary: competencySummary,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
