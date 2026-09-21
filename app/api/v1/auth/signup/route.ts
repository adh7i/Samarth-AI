import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { ZoneRegion } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role_title, zone, department } = body;

    if (!name || !email || !password || !role_title || !zone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!email.toLowerCase().endsWith('@mospi.gov.in')) {
      return NextResponse.json(
        { success: false, error: 'Only official @mospi.gov.in email addresses are allowed' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const users = db.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user and initialize gaps
    const newUser = db.addUser({
      name,
      email,
      role_title,
      zone: zone as ZoneRegion,
      department: department || 'General'
    }, password);

    const profile = db.getUserCompetencyProfile(newUser.id);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token: `jwt_mospi_${newUser.id}_${Date.now()}`,
      user: newUser,
      profile_summary: {
        readiness_index: profile?.readiness_index,
        verified_count: profile?.verified_competencies,
        gap_count: profile?.gap_count
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
