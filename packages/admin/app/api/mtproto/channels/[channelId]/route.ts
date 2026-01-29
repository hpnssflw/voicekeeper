import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/shared/api';

export async function DELETE(
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

    const response = await fetch(`${BOT_API_BASE}/mtproto/channels/${channelId}?ownerId=${ownerId}`, {
      method: 'DELETE',
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
    console.error('MTProto channel delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}

