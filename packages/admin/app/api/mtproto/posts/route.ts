import { NextResponse } from 'next/server';
import { getBotApiBase } from '@/shared/api';

export async function GET(request: Request) {
  try {
    const BOT_API_BASE = getBotApiBase();
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const channelId = searchParams.get('channelId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy');
    
    if (!ownerId || !channelId) {
      return NextResponse.json(
        { error: 'ownerId and channelId are required' },
        { status: 400 }
      );
    }

    const queryParams = new URLSearchParams({
      ownerId,
      channelId,
    });
    if (page) queryParams.set('page', page);
    if (limit) queryParams.set('limit', limit);
    if (sortBy) queryParams.set('sortBy', sortBy);

    const response = await fetch(`${BOT_API_BASE}/mtproto/posts?${queryParams.toString()}`, {
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
    console.error('MTProto posts list error:', error);
    return NextResponse.json(
      { error: 'Failed to get posts. Make sure bot service is running.' },
      { status: 500 }
    );
  }
}

