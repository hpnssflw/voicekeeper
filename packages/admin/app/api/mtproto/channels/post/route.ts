import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function POST(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const body = await request.json();
    const { ownerId, channelUsername, message, parseMode, silent, scheduleDate } = body;
    
    if (!ownerId || !channelUsername || !message) {
      return NextResponse.json(
        { error: 'ownerId, channelUsername, and message are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BOT_API_BASE}/mtproto/channels/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId,
        channelUsername,
        message,
        parseMode,
        silent,
        scheduleDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      if (errorData.error === 'NOT_AUTHENTICATED') {
        return NextResponse.json(
          { error: 'NOT_AUTHENTICATED', message: errorData.message },
          { status: 401 }
        );
      }
      if (errorData.error === 'PERMISSION_DENIED') {
        return NextResponse.json(
          { error: 'PERMISSION_DENIED', message: errorData.message },
          { status: 403 }
        );
      }
      throw new Error(errorData.error || `Bot API returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('MTProto channel post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post message. Make sure bot service is running.' },
      { status: 400 }
    );
  }
}

