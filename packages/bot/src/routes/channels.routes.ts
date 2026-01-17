import { Router } from 'express';
import { Telegraf } from 'telegraf';
import { BotModel } from '../models/Bot';

export const channelsRouter = Router();

/**
 * Get channel info by username or ID
 * POST /api/channels/info
 * Body: { channelId: string, botToken?: string, botId?: string }
 * 
 * Note: Requires a bot token that has access to the channel (bot must be member/admin)
 */
channelsRouter.post('/info', async (req, res, next) => {
  try {
    const { channelId, botToken, botId } = req.body;
    
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }

    // Get token: either from request or from stored bot
    let token = botToken;
    if (!token && botId) {
      const bot = await BotModel.findById(botId).lean();
      token = bot?.tokenPlain;
    }

    if (!token) {
      return res.status(400).json({ error: 'Bot token is required (provide botToken or botId)' });
    }

    const telegraf = new Telegraf(token);
    
    try {
      // Normalize channel ID (add @ if needed for username)
      const normalizedId = channelId.startsWith('@') || /^-?\d+$/.test(channelId) 
        ? channelId 
        : `@${channelId}`;
      
      const chat = await telegraf.telegram.getChat(normalizedId);
      
      // Try to get member count
      let membersCount = 0;
      try {
        membersCount = await telegraf.telegram.getChatMemberCount(normalizedId);
      } catch (e) {
        // May fail if bot doesn't have enough permissions
      }

      // Check bot's role in channel
      let botRole = 'none';
      try {
        const botInfo = await telegraf.telegram.getMe();
        const botMember = await telegraf.telegram.getChatMember(normalizedId, botInfo.id);
        botRole = botMember.status; // 'creator', 'administrator', 'member', etc.
      } catch (e) {
        // Bot might not be a member
      }

      return res.json({
        channel: {
          id: chat.id,
          type: chat.type,
          title: 'title' in chat ? chat.title : undefined,
          username: 'username' in chat ? chat.username : undefined,
          description: 'description' in chat ? chat.description : undefined,
          membersCount,
          hasPhoto: 'photo' in chat && !!chat.photo,
          inviteLink: 'invite_link' in chat ? chat.invite_link : undefined,
        },
        botAccess: {
          role: botRole,
          canPost: botRole === 'administrator' || botRole === 'creator',
          canReadHistory: false, // Bot API limitation - need MTProto
        },
        apiLimitations: {
          historyAccess: 'Bot API cannot read channel message history. Use MTProto (gramjs/telethon) for full parsing.',
          recommendation: 'For channel parsing, consider using a user account with MTProto API.',
        }
      });
    } catch (err: any) {
      const errorMsg = err.response?.description || err.message || 'Unknown error';
      
      if (errorMsg.includes('chat not found') || errorMsg.includes('CHAT_NOT_FOUND')) {
        return res.status(404).json({ error: 'Channel not found or bot has no access' });
      }
      
      return res.status(400).json({ error: errorMsg });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Parse public channel posts (LIMITED - Bot API can only forward/copy, not read history)
 * POST /api/channels/parse
 * 
 * Note: This endpoint explains the limitation. For real parsing, use MTProto.
 */
channelsRouter.post('/parse', async (_req, res) => {
  return res.status(501).json({
    error: 'Channel parsing not implemented',
    reason: 'Telegram Bot API does not support reading channel message history',
    solutions: [
      {
        name: 'MTProto API (gramjs)',
        description: 'Use gramjs library with user session for full channel access',
        complexity: 'Medium',
        requirement: 'User phone number and 2FA (if enabled)',
      },
      {
        name: 'Channel forwarding webhook',
        description: 'Set up bot to receive forwarded messages from channel',
        complexity: 'Low',
        requirement: 'Bot must be admin in the channel',
      },
      {
        name: 'Telethon (Python)',
        description: 'Python library for MTProto, easier for parsing tasks',
        complexity: 'Medium',
        requirement: 'Python microservice + user session',
      },
    ],
    workaround: 'For now, you can manually forward posts to the bot to "import" them',
  });
});

/**
 * Get channels tracked for a specific bot
 * GET /api/channels?botId=xxx
 */
channelsRouter.get('/', async (req, res, next) => {
  try {
    const { botId } = req.query;
    
    if (!botId) {
      return res.status(400).json({ error: 'botId is required' });
    }

    // For now, return the channel configured for the bot
    const bot = await BotModel.findById(botId).lean();
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    const channels = [];
    
    if (bot.channelId) {
      channels.push({
        id: bot.channelId,
        username: bot.channelUsername,
        title: bot.channelTitle,
        type: 'publishing', // This is where the bot publishes
      });
    }

    return res.json({ channels });
  } catch (error) {
    next(error);
  }
});

/**
 * Add a channel to track
 * POST /api/channels/track
 * Body: { botId: string, channelId: string, type: 'publishing' | 'source' }
 */
channelsRouter.post('/track', async (req, res, next) => {
  try {
    const { botId, channelId, type = 'publishing' } = req.body;
    
    if (!botId || !channelId) {
      return res.status(400).json({ error: 'botId and channelId are required' });
    }

    const bot = await BotModel.findById(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (!bot.tokenPlain) {
      return res.status(400).json({ error: 'Bot token not available' });
    }

    const telegraf = new Telegraf(bot.tokenPlain);
    
    // Get channel info
    const normalizedId = channelId.startsWith('@') || /^-?\d+$/.test(channelId) 
      ? channelId 
      : `@${channelId}`;
    
    try {
      const chat = await telegraf.telegram.getChat(normalizedId);
      
      if (type === 'publishing') {
        // Update bot's publishing channel
        await BotModel.findByIdAndUpdate(botId, {
          channelId: chat.id,
          channelUsername: 'username' in chat ? chat.username : undefined,
          channelTitle: 'title' in chat ? chat.title : undefined,
        });
      }
      // For 'source' channels, we'd need a separate Channel model
      // This is a simplified MVP - just handle publishing channel
      
      return res.json({
        success: true,
        channel: {
          id: chat.id,
          username: 'username' in chat ? chat.username : undefined,
          title: 'title' in chat ? chat.title : undefined,
          type,
        },
      });
    } catch (err: any) {
      return res.status(400).json({ error: `Cannot access channel: ${err.message}` });
    }
  } catch (error) {
    next(error);
  }
});

