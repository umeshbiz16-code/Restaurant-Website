import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const userEmail = (email || username || '').trim();

    const isValid = await verifyAdminCredentials(userEmail, password);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Admin access granted',
        user: {
          email: userEmail,
          role: 'admin',
          authenticatedAt: Date.now()
        }
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid admin credentials. Access Denied.'
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Authentication error'
      },
      { status: 500 }
    );
  }
}
