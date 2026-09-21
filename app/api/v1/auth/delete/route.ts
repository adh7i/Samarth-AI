import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const success = db.deleteUser(userId);
    if (success) {
      return NextResponse.json({ success: true, message: 'User deleted permanently' });
    } else {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Deletion failed' },
      { status: 500 }
    );
  }
}
