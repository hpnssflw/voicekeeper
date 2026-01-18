import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate bot token via Telegram Bot API
 * POST /api/bots/validate
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Bot token is required' },
        { status: 400 }
      );
    }
    
    // Validate token format (basic check)
    const tokenPattern = /^\d+:[A-Za-z0-9_-]+$/;
    if (!tokenPattern.test(token)) {
      return NextResponse.json(
        { 
          error: 'Invalid token format',
          valid: false 
        },
        { status: 400 }
      );
    }
    
    // Call Telegram Bot API to validate token
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
          { 
            error: errorData.description || 'Invalid bot token',
            valid: false 
          },
          { status: 401 }
        );
      }
      
      const data = await response.json();
      
      if (!data.ok || !data.result) {
        return NextResponse.json(
          { 
            error: 'Failed to validate bot token',
            valid: false 
          },
          { status: 401 }
        );
      }
      
      const botInfo = data.result;
      
      return NextResponse.json({
        valid: true,
        bot: {
          id: botInfo.id,
          username: botInfo.username,
          firstName: botInfo.first_name,
          lastName: botInfo.last_name,
          canJoinGroups: botInfo.can_join_groups || false,
          canReadAllGroupMessages: botInfo.can_read_all_group_messages || false,
          supportsInlineQueries: botInfo.supports_inline_queries || false,
        },
      });
    } catch (fetchError) {
      console.error('Telegram API error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to Telegram API',
          valid: false 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error validating bot token:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        valid: false 
      },
      { status: 500 }
    );
  }
}

