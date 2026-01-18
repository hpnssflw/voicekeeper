import { NextRequest, NextResponse } from 'next/server';

/**
 * Create/Register a new bot
 * POST /api/bots
 */
export async function POST(request: NextRequest) {
  try {
    const { token, ownerId, channelId } = await request.json();
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Bot token is required' },
        { status: 400 }
      );
    }
    
    if (!ownerId || typeof ownerId !== 'string') {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    // Validate token format
    const tokenPattern = /^\d+:[A-Za-z0-9_-]+$/;
    if (!tokenPattern.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }
    
    // Validate token via Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${token}/getMe`;
    
    try {
      const response = await fetch(telegramApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.description || 'Invalid bot token' },
          { status: 401 }
        );
      }
      
      const data = await response.json();
      
      if (!data.ok || !data.result) {
        return NextResponse.json(
          { error: 'Failed to validate bot token' },
          { status: 401 }
        );
      }
      
      const botInfo = data.result;
      
      // Generate bot ID
      const botId = `bot-${botInfo.id}-${Date.now()}`;
      
      // Return bot response
      return NextResponse.json({
        id: botId,
        username: botInfo.username,
        firstName: botInfo.first_name,
        telegramId: botInfo.id,
        isActive: true,
        channel: channelId ? {
          id: channelId,
          username: undefined,
          title: undefined,
        } : null,
        stats: {
          postsCount: 0,
          publishedCount: 0,
        },
        createdAt: new Date().toISOString(),
      });
    } catch (fetchError) {
      console.error('Telegram API error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to Telegram API' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

