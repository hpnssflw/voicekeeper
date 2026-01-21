import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { BotModel } from '@/lib/db/models/Bot';
import { PostModel } from '@/lib/db/models/Post';
import crypto from 'crypto';

interface BotDocument {
  _id: string;
  ownerId: string;
  botUsername: string;
  tokenPlain?: string;
  isActive: boolean;
  telegramId?: number;
  firstName?: string;
  channelId?: number | string;
  channelUsername?: string;
  channelTitle?: string;
  subscriberCount: number;
  postsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * List user's bots
 * GET /api/bots?ownerId=userId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    await connectMongo();
    
    const bots = await BotModel.find({ ownerId }).lean() as BotDocument[];
    
    // Get real posts count for each bot from database
    const botsWithStats = await Promise.all(
      bots.map(async (bot) => {
        const postsCount = await PostModel.countDocuments({ 
          botId: bot._id, 
          deletedAt: null 
        });
        return {
          id: bot._id.toString(),
          username: bot.botUsername,
          firstName: bot.firstName,
          telegramId: bot.telegramId,
          isActive: bot.isActive,
          channelId: bot.channelId,
          channelUsername: bot.channelUsername,
          channelTitle: bot.channelTitle,
          postsCount,
          createdAt: bot.createdAt?.toISOString(),
        };
      })
    );
    
    return NextResponse.json({
      bots: botsWithStats,
    });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}

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
    
    await connectMongo();
    
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
      
      // Check if bot already exists for this user
      const existingBot = await BotModel.findOne({ 
        ownerId, 
        botUsername: botInfo.username 
      });
      
      if (existingBot) {
        return NextResponse.json(
          { error: 'This bot is already registered' },
          { status: 409 }
        );
      }
      
      // Hash token (simple hash for MVP, use encryption in production)
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Create bot in MongoDB
      const newBot = await BotModel.create({
        ownerId,
        botUsername: botInfo.username,
        tokenHash,
        tokenPlain: token, // MVP only - remove in production
        isActive: true,
        telegramId: botInfo.id,
        firstName: botInfo.first_name,
        channelId: channelId || undefined,
        subscriberCount: 0,
        postsCount: 0,
      });
      
      return NextResponse.json({
        id: newBot._id.toString(),
        username: newBot.botUsername,
        firstName: newBot.firstName,
        telegramId: newBot.telegramId,
        isActive: newBot.isActive,
        channel: channelId ? {
          id: channelId,
          username: undefined,
          title: undefined,
        } : null,
        stats: {
          postsCount: 0,
          publishedCount: 0,
        },
        createdAt: newBot.createdAt.toISOString(),
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

