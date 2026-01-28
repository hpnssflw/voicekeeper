import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function POST(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const body = await request.json();
    const { ownerId } = body;
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'ownerId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BOT_API_BASE}/mtproto/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ownerId }),
    });

    if (!response.ok) {
      throw new Error(`Bot API returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('MTProto logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}

