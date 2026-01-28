import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { BotModel } from '@/lib/db/models/Bot';
import { PostModel } from '@/lib/db/models/Post';
import crypto from 'crypto';
import mongoose from 'mongoose';

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
  console.log('[GET /api/bots] Starting request');
  try {
    console.log('[GET /api/bots] Parsing URL...');
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    console.log('[GET /api/bots] ownerId:', ownerId);
    
    if (!ownerId) {
      console.warn('[GET /api/bots] Owner ID is missing');
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    let mongoConnected = false;
    try {
      await connectMongo();
      // Проверяем, что соединение действительно установлено
      if (mongoose.connection.readyState === 1) {
        mongoConnected = true;
      } else {
        console.warn('MongoDB connection state is not ready:', mongoose.connection.readyState);
      }
    } catch (mongoError) {
      // MongoDB недоступна - возвращаем пустой список вместо ошибки
      console.warn('MongoDB connection error, returning empty bots list:', mongoError);
      mongoConnected = false;
    }
    
    if (!mongoConnected) {
      console.warn('[GET /api/bots] MongoDB not connected, returning empty list');
      return NextResponse.json({
        bots: [],
      });
    }
    
    try {
      // Проверяем, есть ли вообще боты в базе
      const allBotsCount = await BotModel.countDocuments({});
      console.log('[GET /api/bots] Total bots in database:', allBotsCount);
      
      // Ищем боты по ownerId (может быть строка или ObjectId)
      console.log('[GET /api/bots] Searching for bots with ownerId:', ownerId, 'type:', typeof ownerId);
      
      // Пробуем найти по строковому ownerId
      let bots = await BotModel.find({ ownerId: String(ownerId) }).lean() as unknown as BotDocument[];
      console.log('[GET /api/bots] Found bots count (string search):', bots.length);
      
      // Если не нашли, пробуем найти по ObjectId (для старых данных)
      if (bots.length === 0 && allBotsCount > 0) {
        try {
          // Ищем боты, где ownerId может быть ObjectId (старый формат)
          // Пробуем найти все боты и проверить их ownerId
          const allBots = await BotModel.find({}).lean();
          console.log('[GET /api/bots] Checking all bots for migration...');
          
          for (const bot of allBots) {
            const botOwnerId = String(bot.ownerId);
            // Если ownerId бота - это ObjectId (24 символа hex), пытаемся мигрировать
            if (mongoose.Types.ObjectId.isValid(botOwnerId) && botOwnerId.length === 24) {
              console.log('[GET /api/bots] Found bot with ObjectId ownerId:', botOwnerId, 'migrating to:', ownerId);
              // Мигрируем бота на новый ownerId
              await BotModel.updateOne(
                { _id: bot._id },
                { $set: { ownerId: String(ownerId) } }
              );
              // Также обновляем связанные посты
              await PostModel.updateMany(
                { botId: bot._id },
                { $set: { ownerId: String(ownerId) } }
              );
            }
          }
          
          // После миграции ищем снова
          bots = await BotModel.find({ ownerId: String(ownerId) }).lean() as unknown as BotDocument[];
          console.log('[GET /api/bots] Found bots count after migration:', bots.length);
        } catch (e) {
          console.error('[GET /api/bots] Error during migration:', e);
        }
      }
      
      if (bots.length > 0) {
        console.log('[GET /api/bots] First bot:', {
          id: bots[0]._id?.toString(),
          ownerId: bots[0].ownerId,
          botUsername: bots[0].botUsername
        });
      }
      
      // Get real posts count for each bot from database
      const botsWithStats = await Promise.all(
        bots.map(async (bot) => {
          try {
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
          } catch (error) {
            // Если не удалось получить количество постов, возвращаем бота без статистики
            console.warn(`Failed to get posts count for bot ${bot._id}:`, error);
            return {
              id: bot._id.toString(),
              username: bot.botUsername,
              firstName: bot.firstName,
              telegramId: bot.telegramId,
              isActive: bot.isActive,
              channelId: bot.channelId,
              channelUsername: bot.channelUsername,
              channelTitle: bot.channelTitle,
              postsCount: 0,
              createdAt: bot.createdAt?.toISOString(),
            };
          }
        })
      );
      
      return NextResponse.json({
        bots: botsWithStats,
      });
    } catch (dbError) {
      // Ошибка при работе с БД - возвращаем пустой список
      console.warn('Database error, returning empty bots list:', dbError);
      return NextResponse.json({
        bots: [],
      });
    }
  } catch (error) {
    console.error('[GET /api/bots] Error fetching bots:', error);
    if (error instanceof Error) {
      console.error('[GET /api/bots] Error name:', error.name);
      console.error('[GET /api/bots] Error message:', error.message);
      console.error('[GET /api/bots] Error stack:', error.stack);
    }
    // В случае любой другой ошибки возвращаем пустой список
    return NextResponse.json({
      bots: [],
    });
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
      console.log('[POST /api/bots] Checking for existing bot with ownerId:', ownerId, 'botUsername:', botInfo.username);
      const existingBot = await BotModel.findOne({ 
        ownerId, 
        botUsername: botInfo.username 
      });
      
      if (existingBot) {
        console.log('[POST /api/bots] Bot already exists:', existingBot._id.toString());
        return NextResponse.json(
          { error: 'This bot is already registered' },
          { status: 409 }
        );
      }
      
      // Также проверяем, может быть бот существует с другим ownerId
      const existingBotByUsername = await BotModel.findOne({ 
        botUsername: botInfo.username 
      });
      if (existingBotByUsername) {
        console.log('[POST /api/bots] Bot exists with different ownerId:', {
          existingOwnerId: existingBotByUsername.ownerId,
          requestedOwnerId: ownerId
        });
      }
      
      // Hash token (simple hash for MVP, use encryption in production)
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Create bot in MongoDB
      try {
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
      } catch (dbError: any) {
        // Обработка ошибки дубликата ключа MongoDB
        if (dbError.code === 11000 || dbError.name === 'MongoServerError') {
          const duplicateField = dbError.keyPattern ? Object.keys(dbError.keyPattern)[0] : 'botUsername';
          return NextResponse.json(
            { 
              error: `Bot with this ${duplicateField === 'botUsername' ? 'username' : duplicateField} is already registered`,
              details: 'This bot has already been added to the system'
            },
            { status: 409 }
          );
        }
        // Если это другая ошибка БД, пробрасываем дальше
        throw dbError;
      }
    } catch (fetchError: any) {
      // Обработка ошибок Telegram API или других ошибок
      if (fetchError.code === 11000 || fetchError.name === 'MongoServerError') {
        // Это уже обработано выше, но на всякий случай
        const duplicateField = fetchError.keyPattern ? Object.keys(fetchError.keyPattern)[0] : 'botUsername';
        return NextResponse.json(
          { 
            error: `Bot with this ${duplicateField === 'botUsername' ? 'username' : duplicateField} is already registered`,
            details: 'This bot has already been added to the system'
          },
          { status: 409 }
        );
      }
      console.error('Telegram API or database error:', fetchError);
      return NextResponse.json(
        { error: fetchError.message || 'Failed to create bot' },
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

