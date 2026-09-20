import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id = 'usr_iss_001' } = body;

    const result = db.syncApar(user_id);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'APAR synchronization failed' },
      { status: 500 }
    );
  }
}
