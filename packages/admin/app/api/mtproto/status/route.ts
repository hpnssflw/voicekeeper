import { getBotApiBase } from '@/lib/api-base';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BOT_API_BASE = getBotApiBase();
    console.log('[MTProto status] BOT_API_BASE:', BOT_API_BASE);
    console.log('[MTProto status] NODE_ENV:', process.env.NODE_ENV);
    console.log('[MTProto status] NEXT_PUBLIC_API_BASE:', process.env.NEXT_PUBLIC_API_BASE);
    const response = await fetch(`${BOT_API_BASE}/mtproto/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bot API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('MTProto status error:', error);
    return NextResponse.json(
      { error: 'Failed to check MTProto status. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}
