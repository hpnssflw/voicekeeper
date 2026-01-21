import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { BotModel } from '@/lib/db/models/Bot';

interface BotDocument {
  _id: string;
  ownerId: string;
  tokenPlain?: string;
}

/**
 * Get bot token (only for owner)
 * GET /api/bots/[botId]/token?ownerId=userId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    await connectMongo();
    
    const bot = await BotModel.findOne({ 
      _id: botId, 
      ownerId 
    }).lean() as BotDocument | null;
    
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found or access denied' },
        { status: 404 }
      );
    }
    
    // Return token only if user is the owner
    return NextResponse.json({
      hasKey: !!bot.tokenPlain,
      key: bot.tokenPlain || null,
    });
  } catch (error) {
    console.error('Error fetching bot token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot token' },
      { status: 500 }
    );
  }
}

