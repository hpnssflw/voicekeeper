import { Router } from 'express';
import { ParsedChannelModel, ParsedPostModel } from '../models/ParsedChannel';
import { TelegramSessionModel } from '../models/TelegramSession';
import { mtprotoService } from '../services/mtproto.service';

export const mtprotoRouter = Router();

/**
 * Check if MTProto is configured
 * GET /api/mtproto/status
 */
mtprotoRouter.get('/status', async (req, res, next) => {
  try {
    const isConfigured = mtprotoService.isConfigured();
    
    return res.json({
      configured: isConfigured,
      message: isConfigured 
        ? 'MTProto is configured and ready'
        : 'MTProto not configured. Set TELEGRAM_API_ID and TELEGRAM_API_HASH in environment.',
      documentation: 'Get API credentials at https://my.telegram.org/apps',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Check if user has an active session
 * GET /api/mtproto/session?ownerId=xxx
 */
mtprotoRouter.get('/session', async (req, res, next) => {
  try {
    const { ownerId } = req.query;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    const hasSession = await mtprotoService.hasSession(ownerId as string);
    const session = await TelegramSessionModel.findOne({ ownerId, isActive: true }).lean();

    return res.json({
      authenticated: hasSession,
      user: session ? {
        userId: session.userId,
        username: session.username,
        firstName: session.firstName,
        lastUsed: session.lastUsed,
      } : null,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Start authentication - send code to phone
 * POST /api/mtproto/auth/start
 * Body: { ownerId: string, phoneNumber: string }
 */
mtprotoRouter.post('/auth/start', async (req, res, next) => {
  try {
    const { ownerId, phoneNumber } = req.body;
    
    if (!ownerId || !phoneNumber) {
      return res.status(400).json({ error: 'ownerId and phoneNumber are required' });
    }

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    if (normalizedPhone.length < 10) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const result = await mtprotoService.startAuth(ownerId, `+${normalizedPhone}`);
    
    return res.json({
      success: true,
      phoneCodeHash: result.phoneCodeHash,
      phoneCodeType: result.phoneCodeType,
      message: result.phoneCodeType === 'auth.SentCodeTypeApp'
        ? 'Code sent to your Telegram app. Check notifications in Telegram app on the device where this phone number is authorized.'
        : 'Code sent',
    });
  } catch (error: any) {
    if (error.message?.includes('not configured')) {
      return res.status(501).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * Complete authentication with code
 * POST /api/mtproto/auth/complete
 * Body: { ownerId: string, phoneNumber: string, phoneCodeHash: string, phoneCode: string, password?: string }
 */
mtprotoRouter.post('/auth/complete', async (req, res, next) => {
  try {
    const { ownerId, phoneNumber, phoneCodeHash, phoneCode, password } = req.body;
    
    if (!ownerId || !phoneNumber || !phoneCodeHash || !phoneCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedPhone = `+${phoneNumber.replace(/\D/g, '')}`;
    
    const result = await mtprotoService.completeAuth(
      ownerId,
      normalizedPhone,
      phoneCodeHash,
      phoneCode,
      password
    );
    
    return res.json(result);
  } catch (error: any) {
    if (error.message === '2FA password required') {
      return res.status(400).json({ 
        error: '2FA_REQUIRED',
        message: 'Two-factor authentication password required' 
      });
    }
    
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Logout and remove session
 * POST /api/mtproto/auth/logout
 * Body: { ownerId: string }
 */
mtprotoRouter.post('/auth/logout', async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    await mtprotoService.logout(ownerId);
    
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Get channel info
 * POST /api/mtproto/channels/info
 * Body: { ownerId: string, channelUsername: string }
 */
mtprotoRouter.post('/channels/info', async (req, res, next) => {
  try {
    const { ownerId, channelUsername } = req.body;
    
    if (!ownerId || !channelUsername) {
      return res.status(400).json({ error: 'ownerId and channelUsername are required' });
    }

    const info = await mtprotoService.getChannelInfo(ownerId, channelUsername);
    
    return res.json({ channel: info });
  } catch (error: any) {
    if (error.message?.includes('No active session')) {
      return res.status(401).json({ error: 'NOT_AUTHENTICATED', message: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Parse channel messages
 * POST /api/mtproto/channels/parse
 * Body: { ownerId: string, channelUsername: string, limit?: number, offsetId?: number }
 */
mtprotoRouter.post('/channels/parse', async (req, res, next) => {
  try {
    const { ownerId, channelUsername, limit, offsetId, minDate } = req.body;
    
    if (!ownerId || !channelUsername) {
      return res.status(400).json({ error: 'ownerId and channelUsername are required' });
    }

    const result = await mtprotoService.parseChannel(ownerId, channelUsername, {
      limit: Math.min(limit || 50, 100), // Max 100 per request
      offsetId,
      minDate: minDate ? new Date(minDate) : undefined,
    });
    
    return res.json(result);
  } catch (error: any) {
    if (error.message?.includes('No active session')) {
      return res.status(401).json({ error: 'NOT_AUTHENTICATED', message: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get tracked channels
 * GET /api/mtproto/channels?ownerId=xxx
 */
mtprotoRouter.get('/channels', async (req, res, next) => {
  try {
    const { ownerId } = req.query;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    const channels = await mtprotoService.getTrackedChannels(ownerId as string);
    
    return res.json({ channels });
  } catch (error) {
    next(error);
  }
});

/**
 * Get parsed posts
 * GET /api/mtproto/posts?ownerId=xxx&channelId=xxx&page=1&limit=20&sortBy=date
 */
mtprotoRouter.get('/posts', async (req, res, next) => {
  try {
    const { ownerId, channelId, page, limit, sortBy } = req.query;
    
    if (!ownerId || !channelId) {
      return res.status(400).json({ error: 'ownerId and channelId are required' });
    }

    const result = await mtprotoService.getParsedPosts(
      ownerId as string,
      parseInt(channelId as string),
      {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        sortBy: sortBy === 'views' ? 'views' : 'date',
      }
    );
    
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete tracked channel
 * DELETE /api/mtproto/channels/:channelId?ownerId=xxx
 */
mtprotoRouter.delete('/channels/:channelId', async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { ownerId } = req.query;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    await ParsedChannelModel.deleteOne({ ownerId, channelId: parseInt(channelId) });
    await ParsedPostModel.deleteMany({ ownerId, channelId: parseInt(channelId) });
    
    return res.json({ success: true, message: 'Channel and posts deleted' });
  } catch (error) {
    next(error);
  }
});

/**
 * Post message to channel
 * POST /api/mtproto/channels/post
 * Body: { ownerId: string, channelUsername: string, message: string, parseMode?: string, silent?: boolean, scheduleDate?: string }
 */
mtprotoRouter.post('/channels/post', async (req, res, next) => {
  try {
    const { ownerId, channelUsername, message, parseMode, silent, scheduleDate } = req.body;
    
    if (!ownerId || !channelUsername || !message) {
      return res.status(400).json({ error: 'ownerId, channelUsername, and message are required' });
    }

    const result = await mtprotoService.postToChannel(ownerId, channelUsername, message, {
      parseMode,
      silent,
      scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
    });
    
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to post message' });
    }
    
    return res.json({
      success: true,
      messageId: result.messageId,
      message: 'Message posted successfully',
    });
  } catch (error: any) {
    if (error.message?.includes('No active session')) {
      return res.status(401).json({ error: 'NOT_AUTHENTICATED', message: error.message });
    }
    if (error.message?.includes('permission')) {
      return res.status(403).json({ error: 'PERMISSION_DENIED', message: error.message });
    }
    return res.status(400).json({ error: error.message || 'Failed to post message' });
  }
});

/**
 * Get channel analytics
 * GET /api/mtproto/channels/:channelId/analytics?ownerId=xxx
 */
mtprotoRouter.get('/channels/:channelId/analytics', async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { ownerId } = req.query;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    const channelIdNum = parseInt(channelId);

    // Get basic stats
    const [
      totalPosts,
      postsWithMedia,
      avgViews,
      topHashtags,
      postsByDay,
    ] = await Promise.all([
      ParsedPostModel.countDocuments({ ownerId, channelId: channelIdNum }),
      ParsedPostModel.countDocuments({ ownerId, channelId: channelIdNum, hasMedia: true }),
      ParsedPostModel.aggregate([
        { $match: { ownerId, channelId: channelIdNum, views: { $exists: true } } },
        { $group: { _id: null, avgViews: { $avg: '$views' } } },
      ]),
      ParsedPostModel.aggregate([
        { $match: { ownerId, channelId: channelIdNum, hasHashtags: true } },
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ParsedPostModel.aggregate([
        { $match: { ownerId, channelId: channelIdNum } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            count: { $sum: 1 },
            avgViews: { $avg: '$views' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
    ]);

    return res.json({
      totalPosts,
      postsWithMedia,
      mediaPercentage: totalPosts > 0 ? Math.round((postsWithMedia / totalPosts) * 100) : 0,
      avgViews: avgViews[0]?.avgViews || 0,
      topHashtags: topHashtags.map((h: any) => ({ tag: h._id, count: h.count })),
      postsByDay: postsByDay.map((d: any) => ({ date: d._id, count: d.count, avgViews: d.avgViews })),
    });
  } catch (error) {
    next(error);
  }
});

