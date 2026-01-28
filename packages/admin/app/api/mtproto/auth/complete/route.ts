import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function POST(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const body = await request.json();
    const { ownerId, phoneNumber, phoneCodeHash, phoneCode, password } = body;
    
    if (!ownerId || !phoneNumber || !phoneCodeHash || !phoneCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const normalizedPhone = `+${phoneNumber.replace(/\D/g, '')}`;
    
    const response = await fetch(`${BOT_API_BASE}/mtproto/auth/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId,
        phoneNumber: normalizedPhone,
        phoneCodeHash,
        phoneCode,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      if (errorData.error === '2FA_REQUIRED') {
        return NextResponse.json(
          { 
            error: '2FA_REQUIRED',
            message: 'Two-factor authentication password required' 
          },
          { status: 400 }
        );
      }
      throw new Error(errorData.error || `Bot API returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('MTProto auth complete error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed. Make sure bot service is running.' },
      { status: 400 }
    );
  }
}

