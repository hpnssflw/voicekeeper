import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/lib/api-base';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const { channelId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'ownerId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BOT_API_BASE}/mtproto/channels/${channelId}/analytics?ownerId=${ownerId}`, {
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
    console.error('MTProto analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}

