import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/shared/api';

export async function GET(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'ownerId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BOT_API_BASE}/mtproto/channels?ownerId=${ownerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bot API returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('MTProto channels list error:', error);
    return NextResponse.json(
      { error: 'Failed to get channels. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}

