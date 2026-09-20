import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const profile = db.getUserCompetencyProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: `User with ID '${userId}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
