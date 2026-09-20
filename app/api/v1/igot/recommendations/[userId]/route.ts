import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const recommendations = db.getIgotRecommendations(userId);

    return NextResponse.json({
      success: true,
      data: recommendations
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
