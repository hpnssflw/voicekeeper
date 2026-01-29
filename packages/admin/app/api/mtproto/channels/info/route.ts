import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/shared/api';

export async function POST(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const body = await request.json();
    const { ownerId, channelUsername } = body;
    
    if (!ownerId || !channelUsername) {
      return NextResponse.json(
        { error: 'ownerId and channelUsername are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BOT_API_BASE}/mtproto/channels/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ownerId, channelUsername }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      if (errorData.error === 'NOT_AUTHENTICATED') {
        return NextResponse.json(
          { error: 'NOT_AUTHENTICATED', message: errorData.message },
          { status: 401 }
        );
      }
      throw new Error(errorData.error || `Bot API returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('MTProto channel info error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get channel info. Make sure bot service is running.' },
      { status: 400 }
    );
  }
}

