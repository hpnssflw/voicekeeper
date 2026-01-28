import { Router } from 'express';
import { Telegraf } from 'telegraf';
import { BotModel } from '../models/Bot';
import { PostModel } from '../models/Post';

export const botsRouter = Router();

/**
 * Validate bot token and get bot info from Telegram API
 * POST /api/bots/validate
 * Body: { token: string }
 */
botsRouter.post('/validate', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Validate token format (should be like 123456789:ABC...)
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const bot = new Telegraf(token);
    
    try {
      // Get bot info from Telegram API
      const botInfo = await bot.telegram.getMe();
      
      return res.json({
        valid: true,
        bot: {
          id: botInfo.id,
          username: botInfo.username,
          firstName: botInfo.first_name,
          canJoinGroups: botInfo.can_join_groups,
          canReadAllGroupMessages: botInfo.can_read_all_group_messages,
          supportsInlineQueries: botInfo.supports_inline_queries,
        }
      });
    } catch (telegramError: any) {
      const errorMsg = telegramError.response?.description || telegramError.message || 'Unknown error';
      return res.status(400).json({ 
        valid: false, 
        error: errorMsg.includes('Unauthorized') ? 'Invalid bot token' : errorMsg 
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Register a new bot
 * POST /api/bots
 * Body: { token: string, ownerId: string, channelId?: string }
 */
botsRouter.post('/', async (req, res, next) => {
  try {
    const { token, ownerId, channelId } = req.body;
    
    if (!token || !ownerId) {
      return res.status(400).json({ error: 'Token and ownerId are required' });
    }

    const bot = new Telegraf(token);
    
    // Get bot info from Telegram
    const botInfo = await bot.telegram.getMe();
    
    // Check if bot already exists
    const existing = await BotModel.findOne({ botUsername: botInfo.username });
    if (existing) {
      return res.status(409).json({ error: 'Bot already registered', botId: existing._id });
    }

    // Get channel info if channelId provided
    let channelInfo = null;
    if (channelId) {
      try {
        const chat = await bot.telegram.getChat(channelId);
        channelInfo = {
          id: chat.id,
          title: 'title' in chat ? chat.title : undefined,
          username: 'username' in chat ? chat.username : undefined,
          type: chat.type,
        };
      } catch (err: any) {
        console.warn(`Could not get channel info: ${err.message}`);
      }
    }

    // Create bot in database
    const newBot = await BotModel.create({
      ownerId,
      botUsername: botInfo.username,
      tokenPlain: token, // In production, encrypt this!
      isActive: true,
      telegramId: botInfo.id,
      firstName: botInfo.first_name,
      channelId: channelInfo?.id,
      channelUsername: channelInfo?.username,
      channelTitle: channelInfo?.title,
    });

    return res.status(201).json({
      id: newBot._id,
      username: botInfo.username,
      firstName: botInfo.first_name,
      telegramId: botInfo.id,
      channel: channelInfo,
      isActive: true,
    });
  } catch (error: any) {
    if (error.response?.description?.includes('Unauthorized')) {
      return res.status(400).json({ error: 'Invalid bot token' });
    }
    next(error);
  }
});

/**
 * Get bot details with stats
 * GET /api/bots/:botId
 */
botsRouter.get('/:botId', async (req, res, next) => {
  try {
    const { botId } = req.params;
    
    const bot = await BotModel.findById(botId).lean();
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Get posts count
    const postsCount = await PostModel.countDocuments({ botId, deletedAt: null });
    const publishedCount = await PostModel.countDocuments({ botId, status: 'published', deletedAt: null });

    // Try to get fresh info from Telegram
    let telegramInfo = null;
    let channelInfo = null;
    
    if (bot.tokenPlain) {
      try {
        const telegraf = new Telegraf(bot.tokenPlain);
        telegramInfo = await telegraf.telegram.getMe();
        
        // Get channel info if we have channelId
        if (bot.channelId) {
          try {
            const chat = await telegraf.telegram.getChat(bot.channelId);
            const membersCount = 'type' in chat && chat.type !== 'private' 
              ? await telegraf.telegram.getChatMembersCount(bot.channelId)
              : 0;
            
            channelInfo = {
              id: chat.id,
              title: 'title' in chat ? chat.title : undefined,
              username: 'username' in chat ? chat.username : undefined,
              type: chat.type,
              membersCount,
            };
          } catch (err) {
            // Channel might not be accessible
          }
        }
      } catch (err) {
        // Token might be invalid now
      }
    }

    return res.json({
      id: bot._id,
      username: bot.botUsername,
      firstName: bot.firstName || telegramInfo?.first_name,
      telegramId: bot.telegramId || telegramInfo?.id,
      isActive: bot.isActive,
      channel: channelInfo || (bot.channelId ? {
        id: bot.channelId,
        username: bot.channelUsername,
        title: bot.channelTitle,
      } : null),
      stats: {
        postsCount,
        publishedCount,
      },
      createdAt: bot.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update bot settings
 * PUT /api/bots/:botId
 * Body: { channelId?: string, isActive?: boolean }
 */
botsRouter.put('/:botId', async (req, res, next) => {
  try {
    const { botId } = req.params;
    const { channelId, isActive } = req.body;
    
    const bot = await BotModel.findById(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    const updates: any = {};
    
    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    // Update channel if provided
    if (channelId !== undefined) {
      if (channelId && bot.tokenPlain) {
        try {
          const telegraf = new Telegraf(bot.tokenPlain);
          const chat = await telegraf.telegram.getChat(channelId);
          updates.channelId = chat.id;
          updates.channelUsername = 'username' in chat ? chat.username : undefined;
          updates.channelTitle = 'title' in chat ? chat.title : undefined;
        } catch (err: any) {
          return res.status(400).json({ error: `Cannot access channel: ${err.message}` });
        }
      } else if (channelId === null) {
        updates.channelId = null;
        updates.channelUsername = null;
        updates.channelTitle = null;
      }
    }

    const updated = await BotModel.findByIdAndUpdate(botId, updates, { new: true }).lean();
    
    return res.json({
      id: updated?._id,
      username: updated?.botUsername,
      channelId: updated?.channelId,
      channelUsername: updated?.channelUsername,
      isActive: updated?.isActive,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete bot
 * DELETE /api/bots/:botId
 */
botsRouter.delete('/:botId', async (req, res, next) => {
  try {
    const { botId } = req.params;
    
    const deleted = await BotModel.findByIdAndDelete(botId);
    if (!deleted) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    return res.json({ success: true, deletedId: botId });
  } catch (error) {
    next(error);
  }
});

/**
 * List user's bots
 * GET /api/bots?ownerId=xxx
 */
botsRouter.get('/', async (req, res, next) => {
  try {
    const { ownerId } = req.query;
    
    const filter: any = {};
    if (ownerId) {
      filter.ownerId = ownerId;
    }

    const bots = await BotModel.find(filter).lean();
    
    // Get posts count for each bot
    const botsWithStats = await Promise.all(
      bots.map(async (bot) => {
        const postsCount = await PostModel.countDocuments({ botId: bot._id, deletedAt: null });
        return {
          id: bot._id,
          username: bot.botUsername,
          firstName: bot.firstName,
          telegramId: bot.telegramId,
          isActive: bot.isActive,
          channelId: bot.channelId,
          channelUsername: bot.channelUsername,
          channelTitle: bot.channelTitle,
          postsCount,
          createdAt: bot.createdAt,
        };
      })
    );

    return res.json({ bots: botsWithStats });
  } catch (error) {
    next(error);
  }
});

/**
 * Get bot's channel info and updates
 * GET /api/bots/:botId/channel
 */
botsRouter.get('/:botId/channel', async (req, res, next) => {
  try {
    const { botId } = req.params;
    
    const bot = await BotModel.findById(botId).lean();
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (!bot.tokenPlain) {
      return res.status(400).json({ error: 'Bot token not available' });
    }

    if (!bot.channelId) {
      return res.status(400).json({ error: 'No channel configured for this bot' });
    }

    const telegraf = new Telegraf(bot.tokenPlain);
    
    try {
      const chat = await telegraf.telegram.getChat(bot.channelId);
      const membersCount = await telegraf.telegram.getChatMembersCount(bot.channelId);
      
      // Get recent messages (bot needs to be admin with message access)
      // Note: Bots can't read channel history directly via Bot API
      // This would require MTProto/userbot for full history
      
      return res.json({
        channel: {
          id: chat.id,
          title: 'title' in chat ? chat.title : undefined,
          username: 'username' in chat ? chat.username : undefined,
          type: chat.type,
          membersCount,
          description: 'description' in chat ? chat.description : undefined,
          photo: 'photo' in chat ? chat.photo : undefined,
        },
        // Note: Channel message history requires MTProto, not available via Bot API
        historyAvailable: false,
        historyNote: 'Channel message history requires MTProto API (not Bot API)',
      });
    } catch (err: any) {
      return res.status(400).json({ error: `Cannot access channel: ${err.message}` });
    }
  } catch (error) {
    next(error);
  }
});

