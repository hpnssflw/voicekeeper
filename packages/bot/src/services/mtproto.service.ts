import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { env } from '../config/env';
import { ParsedChannelModel, ParsedPostModel } from '../models/ParsedChannel';
import { TelegramSessionModel } from '../models/TelegramSession';

/**
 * MTProto Service using gramjs
 * Provides full Telegram API access for channel parsing
 * 
 * IMPORTANT: Requires Telegram API credentials (api_id, api_hash)
 * Get them from https://my.telegram.org/apps
 */
export class MTProtoService {
  private apiId: number;
  private apiHash: string;
  private clients: Map<string, TelegramClient> = new Map();

  constructor() {
    this.apiId = parseInt(env.TELEGRAM_API_ID || '0');
    this.apiHash = env.TELEGRAM_API_HASH || '';
  }

  /**
   * Check if MTProto is configured
   */
  isConfigured(): boolean {
    return this.apiId > 0 && this.apiHash.length > 0;
  }

  /**
   * Get or create a client for a user
   */
  private async getClient(ownerId: string): Promise<TelegramClient | null> {
    if (!this.isConfigured()) {
      console.warn('MTProto not configured: missing TELEGRAM_API_ID or TELEGRAM_API_HASH');
      return null;
    }

    // Check cache
    if (this.clients.has(ownerId)) {
      const client = this.clients.get(ownerId)!;
      if (client.connected) {
        return client;
      }
    }

    // Load session from DB
    const session = await TelegramSessionModel.findOne({ ownerId, isActive: true });
    if (!session) {
      return null;
    }

    // Create client
    const stringSession = new StringSession(session.sessionString);
    const client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
      connectionRetries: 3,
    });

    await client.connect();
    
    if (await client.isUserAuthorized()) {
      this.clients.set(ownerId, client);
      
      // Update last used
      await TelegramSessionModel.updateOne({ _id: session._id }, { lastUsed: new Date() });
      
      return client;
    }

    return null;
  }

  /**
   * Start authentication process (sends code to phone)
   */
  async startAuth(ownerId: string, phoneNumber: string): Promise<{ phoneCodeHash: string; phoneCodeType?: string }> {
    if (!this.isConfigured()) {
      throw new Error('MTProto not configured: set TELEGRAM_API_ID and TELEGRAM_API_HASH');
    }

    const stringSession = new StringSession('');
    const client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
      connectionRetries: 3,
    });

    await client.connect();

    const result = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId: this.apiId,
        apiHash: this.apiHash,
        settings: new Api.CodeSettings({}),
      })
    );

    // Store temporary client
    this.clients.set(`temp_${ownerId}`, client);

    // Handle different result types
    if (result instanceof Api.auth.SentCode) {
      return { 
        phoneCodeHash: result.phoneCodeHash,
        phoneCodeType: result.type?.className,
      };
    } else {
      // SentCodeSuccess case - already authenticated
      throw new Error('Already authenticated');
    }
  }

  /**
   * Complete authentication with code
   */
  async completeAuth(
    ownerId: string,
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string,
    password?: string
  ): Promise<{ success: boolean; user?: any }> {
    const client = this.clients.get(`temp_${ownerId}`);
    if (!client) {
      throw new Error('Auth session expired. Start again.');
    }

    try {
      let result;
      
      try {
        result = await client.invoke(
          new Api.auth.SignIn({
            phoneNumber,
            phoneCodeHash,
            phoneCode,
          })
        );
      } catch (err: any) {
        // 2FA required
        if (err.errorMessage === 'SESSION_PASSWORD_NEEDED') {
          if (!password) {
            throw new Error('2FA password required');
          }

          const passwordInfo = await client.invoke(new Api.account.GetPassword());
          // Compute password check - using type assertion as method name may vary by version
          const passwordSRP = await (client as any).checkPassword(passwordInfo, password);
          
          result = await client.invoke(
            new Api.auth.CheckPassword({
              password: passwordSRP,
            })
          );
        } else {
          throw err;
        }
      }

      // Get user info
      const me = await client.getMe();
      
      // Save session
      const sessionString = (client.session as StringSession).save();
      
      await TelegramSessionModel.findOneAndUpdate(
        { ownerId },
        {
          ownerId,
          sessionString,
          phoneNumber,
          userId: me?.id?.valueOf(),
          username: me && 'username' in me ? me.username : undefined,
          firstName: me && 'firstName' in me ? me.firstName : undefined,
          isActive: true,
          lastUsed: new Date(),
        },
        { upsert: true }
      );

      // Move client from temp to permanent
      this.clients.delete(`temp_${ownerId}`);
      this.clients.set(ownerId, client);

      return {
        success: true,
        user: {
          id: me?.id?.valueOf(),
          username: me && 'username' in me ? me.username : undefined,
          firstName: me && 'firstName' in me ? me.firstName : undefined,
        },
      };
    } catch (err: any) {
      console.error('Auth error:', err);
      throw new Error(err.errorMessage || err.message || 'Authentication failed');
    }
  }

  /**
   * Check if user has an active session
   */
  async hasSession(ownerId: string): Promise<boolean> {
    const client = await this.getClient(ownerId);
    return client !== null;
  }

  /**
   * Get channel info
   */
  async getChannelInfo(ownerId: string, channelUsername: string): Promise<any> {
    const client = await this.getClient(ownerId);
    if (!client) {
      throw new Error('No active session. Please authenticate first.');
    }

    // Resolve username to entity
    const entity = await client.getEntity(channelUsername);
    
    if ('participantsCount' in entity) {
      return {
        id: entity.id.valueOf(),
        title: 'title' in entity ? entity.title : undefined,
        username: 'username' in entity ? entity.username : undefined,
        about: 'about' in entity ? entity.about : undefined,
        participantsCount: entity.participantsCount,
        type: entity.className,
      };
    }

    return {
      id: entity.id.valueOf(),
      type: entity.className,
    };
  }

  /**
   * Parse channel messages
   */
  async parseChannel(
    ownerId: string,
    channelUsername: string,
    options: {
      limit?: number;
      offsetId?: number;
      minDate?: Date;
    } = {}
  ): Promise<{
    posts: any[];
    hasMore: boolean;
    lastMessageId?: number;
  }> {
    const client = await this.getClient(ownerId);
    if (!client) {
      throw new Error('No active session. Please authenticate first.');
    }

    const { limit = 50, offsetId, minDate } = options;

    // Get channel entity
    const entity = await client.getEntity(channelUsername);
    const channelId = entity.id.valueOf();

    // Get messages
    const messages = await client.getMessages(entity, {
      limit,
      offsetId,
      offsetDate: minDate ? Math.floor(minDate.getTime() / 1000) : undefined,
    });

    const posts = messages.map((msg: any) => {
      // Extract hashtags from text
      const hashtags: string[] = [];
      if (msg.message) {
        const matches = msg.message.match(/#\w+/g);
        if (matches) {
          hashtags.push(...matches);
        }
      }

      return {
        messageId: msg.id,
        date: new Date(msg.date * 1000),
        text: msg.message || '',
        hasMedia: !!msg.media,
        mediaType: msg.media?.className,
        views: msg.views,
        forwards: msg.forwards,
        reactions: msg.reactions,
        wordCount: msg.message ? msg.message.split(/\s+/).length : 0,
        hasLinks: msg.message ? /https?:\/\//.test(msg.message) : false,
        hasHashtags: hashtags.length > 0,
        hashtags,
      };
    });

    // Save to database
    for (const post of posts) {
      await ParsedPostModel.findOneAndUpdate(
        { channelId, messageId: post.messageId },
        {
          ownerId,
          channelId,
          ...post,
        },
        { upsert: true }
      );
    }

    // Update channel info
    const channelInfo = await this.getChannelInfo(ownerId, channelUsername);
    await ParsedChannelModel.findOneAndUpdate(
      { ownerId, channelId },
      {
        ownerId,
        channelId,
        username: channelInfo.username,
        title: channelInfo.title,
        about: channelInfo.about,
        participantsCount: channelInfo.participantsCount,
        lastParsedAt: new Date(),
        lastParsedMessageId: posts[0]?.messageId,
        $inc: { totalPostsParsed: posts.length },
      },
      { upsert: true }
    );

    return {
      posts,
      hasMore: messages.length === limit,
      lastMessageId: posts[posts.length - 1]?.messageId,
    };
  }

  /**
   * Post message to channel
   */
  async postToChannel(
    ownerId: string,
    channelUsername: string,
    message: string,
    options?: {
      parseMode?: 'html' | 'markdown';
      silent?: boolean;
      scheduleDate?: Date;
    }
  ): Promise<{ success: boolean; messageId?: number; error?: string }> {
    const client = await this.getClient(ownerId);
    if (!client) {
      throw new Error('No active session. Please authenticate first.');
    }

    try {
      // Get channel entity
      const entity = await client.getEntity(channelUsername);
      
      // Post message
      const result = await client.sendMessage(entity, {
        message,
        parseMode: options?.parseMode === 'html' ? 'html' : undefined,
        silent: options?.silent,
        schedule: options?.scheduleDate ? Math.floor(options.scheduleDate.getTime() / 1000) : undefined,
      });

      return {
        success: true,
        messageId: result.id,
      };
    } catch (err: any) {
      console.error('Post error:', err);
      const errorMessage = err.errorMessage || err.message || 'Failed to post message';
      
      // Check for common permission errors
      if (errorMessage.includes('CHAT_WRITE_FORBIDDEN') || 
          errorMessage.includes('not enough rights') ||
          errorMessage.includes('permission')) {
        return {
          success: false,
          error: 'You do not have permission to post in this channel. Make sure you are an admin with post rights.',
        };
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get parsed posts from database
   */
  async getParsedPosts(
    ownerId: string,
    channelId: number,
    options: {
      page?: number;
      limit?: number;
      sortBy?: 'date' | 'views';
    } = {}
  ): Promise<{
    posts: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, sortBy = 'date' } = options;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      ParsedPostModel.find({ ownerId, channelId })
        .sort({ [sortBy === 'views' ? 'views' : 'date']: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ParsedPostModel.countDocuments({ ownerId, channelId }),
    ]);

    return { posts, total, page, limit };
  }

  /**
   * Get tracked channels for a user
   */
  async getTrackedChannels(ownerId: string): Promise<any[]> {
    return ParsedChannelModel.find({ ownerId, isActive: true }).lean();
  }

  /**
   * Logout and remove session
   */
  async logout(ownerId: string): Promise<void> {
    const client = this.clients.get(ownerId);
    if (client) {
      try {
        await client.invoke(new Api.auth.LogOut());
      } catch (e) {
        // Ignore logout errors
      }
      await client.disconnect();
      this.clients.delete(ownerId);
    }

    await TelegramSessionModel.deleteOne({ ownerId });
  }
}

// Export singleton instance
export const mtprotoService = new MTProtoService();

