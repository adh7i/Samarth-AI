import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'usr_iss_001', role } = body;

    const users = db.getUsers();
    let selectedUser = users.find(u => u.id === userId);

    if (!selectedUser && role) {
      selectedUser = users.find(u => u.role_title.toLowerCase().includes(role.toLowerCase()));
    }

    if (!selectedUser) {
      selectedUser = users[0];
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
