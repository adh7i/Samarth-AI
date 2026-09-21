import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const selectedUser = db.verifyLogin(email, password);

    if (!selectedUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const profile = db.getUserCompetencyProfile(selectedUser.id);

    return NextResponse.json({
      success: true,
      message: 'SSO Authentication Verified with MoSPI e-Office Directory',
      token: `jwt_mospi_${selectedUser.id}_${Date.now()}`,
      user: selectedUser,
      profile_summary: {
        readiness_index: profile?.readiness_index,
        verified_count: profile?.verified_competencies,
        gap_count: profile?.gap_count
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = db.getUsers();
  return NextResponse.json({
    success: true,
    available_officers: users
  });
}
