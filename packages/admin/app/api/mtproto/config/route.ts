import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function GET() {
  try {
    const BOT_API_BASE = getBotApiBase();
    // Proxy to status endpoint which contains configuration info
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
    console.error('MTProto config error:', error);
    return NextResponse.json(
      { error: 'Failed to get MTProto config. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}
