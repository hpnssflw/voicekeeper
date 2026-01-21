import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { BotModel } from '@/lib/db/models/Bot';

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
}

/**
 * Get bot details
 * GET /api/bots/[botId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;
    await connectMongo();
    
    const bot = await BotModel.findById(botId).lean() as BotDocument | null;
    
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: bot._id.toString(),
      username: bot.botUsername,
      firstName: bot.firstName,
      telegramId: bot.telegramId,
      isActive: bot.isActive,
      channel: bot.channelId ? {
        id: bot.channelId,
        username: bot.channelUsername,
        title: bot.channelTitle,
      } : null,
      stats: {
        postsCount: bot.postsCount || 0,
        publishedCount: 0,
      },
      createdAt: bot.createdAt?.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching bot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot' },
      { status: 500 }
    );
  }
}

/**
 * Update bot settings
 * PUT /api/bots/[botId]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;
    const body = await request.json();
    const { channelId, isActive } = body;
    
    await connectMongo();
    
    const updates: any = {};
    
    if (channelId !== undefined) {
      if (channelId === null || channelId === '') {
        updates.channelId = null;
        updates.channelUsername = null;
        updates.channelTitle = null;
      } else {
        updates.channelId = channelId;
        // Channel username and title should be fetched separately via channels API
      }
    }
    
    if (isActive !== undefined) {
      updates.isActive = isActive;
    }
    
    const bot = await BotModel.findByIdAndUpdate(
      botId,
      { $set: updates },
      { new: true }
    ).lean() as BotDocument | null;
    
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: bot._id.toString(),
      username: bot.botUsername,
      firstName: bot.firstName,
      telegramId: bot.telegramId,
      isActive: bot.isActive,
      channel: bot.channelId ? {
        id: bot.channelId,
        username: bot.channelUsername,
        title: bot.channelTitle,
      } : null,
      stats: {
        postsCount: bot.postsCount || 0,
        publishedCount: 0,
      },
    });
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json(
      { error: 'Failed to update bot' },
      { status: 500 }
    );
  }
}

/**
 * Delete bot
 * DELETE /api/bots/[botId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;
    await connectMongo();
    
    const bot = await BotModel.findByIdAndDelete(botId);
    
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      deletedId: botId,
    });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    );
  }
}

