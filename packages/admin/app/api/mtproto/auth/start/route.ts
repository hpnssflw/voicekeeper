import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function POST(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const body = await request.json();
    const { ownerId, phoneNumber } = body;
    
    if (!ownerId || !phoneNumber) {
      return NextResponse.json(
        { error: 'ownerId and phoneNumber are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    console.log(`[API Proxy] Starting auth for owner ${ownerId}, phone: +${normalizedPhone}`);
    
    const response = await fetch(`${BOT_API_BASE}/mtproto/auth/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId,
        phoneNumber: `+${normalizedPhone}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Bot API returned ${response.status}`);
    }

    const result = await response.json();
    
    console.log(`[API Proxy] Auth start successful for ${ownerId}`);
    
    return NextResponse.json({
      success: true,
      phoneCodeHash: result.phoneCodeHash,
      phoneCodeType: result.phoneCodeType || 'auth.SentCodeTypeApp',
      message: 'Код отправлен в Telegram. Проверьте уведомления в приложении Telegram на устройстве, где авторизован этот номер телефона.',
    });
  } catch (error: any) {
    console.error('MTProto auth start error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start authentication. Make sure bot service is running.' },
      { status: 400 }
    );
  }
}
