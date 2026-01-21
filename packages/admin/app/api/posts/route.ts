import { BotModel } from '@/lib/db/models/Bot';
import { PostModel } from '@/lib/db/models/Post';
import { connectMongo } from '@/lib/db/mongo';
import { NextRequest, NextResponse } from 'next/server';

interface BotDocument {
  _id: string;
  botUsername: string;
  tokenPlain?: string;
  channelId?: number | string;
  channelUsername?: string;
  channelTitle?: string;
}

/**
 * Get posts for a bot or list all bots
 * GET /api/posts?botId=xxx&status=published&page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectMongo();

    // If botId provided, return posts for that bot
    if (botId) {
      const filter: any = { botId, deletedAt: null };
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;
      const posts = await PostModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await PostModel.countDocuments(filter);

      return NextResponse.json({
        data: posts.map((post: any) => ({
          _id: post._id.toString(),
          botId: post.botId.toString(),
          authorId: post.authorId,
          title: post.title,
          content: post.content,
          type: post.type,
          status: post.status,
          publishTarget: post.publishTarget,
          scheduledAt: post.scheduledAt?.toISOString(),
          metrics: post.metrics || { views: 0, clicks: 0, conversions: 0 },
          createdAt: post.createdAt?.toISOString(),
          updatedAt: post.updatedAt?.toISOString(),
        })),
        total,
        page,
        limit,
      });
    }

    // If no botId, return bot info (for testing)
    const bots = await BotModel.find({}).lean();
    
    return NextResponse.json({
      bots: bots.map((bot: any) => ({
        id: bot._id,
        username: bot.botUsername,
        hasToken: !!bot.tokenPlain,
        channel: {
          id: bot.channelId || null,
          username: bot.channelUsername || null,
          title: bot.channelTitle || null,
          configured: !!(bot.channelId || bot.channelUsername),
        },
      })),
    });
  } catch (error: any) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Test endpoint for direct post publishing via Telegram Bot API
 * POST /api/posts
 * Body: { botId: string, authorId?: string, title?: string, content: string, publishTarget?: 'channel' | 'subscribers' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { botId, authorId, title, content, publishTarget = 'channel' } = body;

    // Validation
    if (!botId) {
      return NextResponse.json(
        { error: 'botId is required' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    if (publishTarget !== 'channel' && publishTarget !== 'subscribers') {
      return NextResponse.json(
        { error: 'publishTarget must be "channel" or "subscribers"' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Get authorId from bot's ownerId if not provided
    let finalAuthorId = authorId;
    if (!finalAuthorId) {
      const botForAuthor = await BotModel.findById(botId).select('ownerId').lean();
      const botDoc = botForAuthor as { ownerId?: string } | null;
      if (botDoc && botDoc.ownerId) {
        finalAuthorId = botDoc.ownerId.toString();
      } else {
        finalAuthorId = 'anonymous'; // Fallback
      }
    }

    // Get bot from database
    const bot = await BotModel.findById(botId).lean() as BotDocument | null;

    if (!bot) {
      return NextResponse.json(
        { error: `Bot not found: ${botId}` },
        { status: 404 }
      );
    }

    if (!bot.tokenPlain) {
      return NextResponse.json(
        { error: 'Bot token not available in database' },
        { status: 400 }
      );
    }

    // Format message text
    const text = title && content
      ? `*${title}*\n\n${content}`
      : title || content;

    // Handle channel publishing
    if (publishTarget === 'channel') {
      // Get channelId: prioritize bot's channel from DB
      let channelIdentifier: string | number | null = null;
      
      if (bot.channelId) {
        channelIdentifier = bot.channelId;
        console.log(`Using channel from bot DB: ${channelIdentifier}`);
      } else if (bot.channelUsername) {
        // Normalize username: ensure it starts with @
        channelIdentifier = bot.channelUsername.startsWith('@')
          ? bot.channelUsername
          : `@${bot.channelUsername}`;
        console.log(`Using channel username from bot DB: ${channelIdentifier}`);
      } else {
        return NextResponse.json(
          {
            error: 'Channel not configured for this bot',
            details: {
              botId,
              botUsername: bot.botUsername,
              channelId: bot.channelId || 'NOT SET',
              channelUsername: bot.channelUsername || 'NOT SET',
            },
            hint: 'Configure channel via /api/bots/:botId (PUT) or /api/channels/track',
          },
          { status: 400 }
        );
      }

      // If channelIdentifier is a username (starts with @) or looks like a username string,
      // we need to get the numeric chat ID first via getChat
      let chatId: string | number = channelIdentifier;
      
      // Check if it's a username (not a numeric ID)
      const isUsername = typeof channelIdentifier === 'string' && 
                        (channelIdentifier.startsWith('@') || (!/^-?\d+$/.test(channelIdentifier)));
      
      if (isUsername && typeof channelIdentifier === 'string') {
        console.log(`Channel identifier is username, getting chat ID first: ${channelIdentifier}`);
        
        // Normalize username format (ensure it starts with @)
        const normalizedUsername = channelIdentifier.startsWith('@')
          ? channelIdentifier
          : `@${channelIdentifier}`;
        
        // Get chat info to retrieve numeric ID
        const getChatUrl = `https://api.telegram.org/bot${bot.tokenPlain}/getChat`;
        
        try {
          const getChatResponse = await fetch(getChatUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: normalizedUsername,
            }),
          });

          const getChatResult = await getChatResponse.json();

          if (!getChatResponse.ok || !getChatResult.ok) {
            const errorMsg = getChatResult.description || `Failed to get chat info: ${getChatResponse.status}`;
            console.error('Failed to get chat info:', getChatResult);
            
            return NextResponse.json(
              {
                error: 'Failed to get channel info',
                details: errorMsg,
                telegramResponse: getChatResult,
                hint: 'Make sure bot is admin in the channel or channel username is correct',
              },
              { status: 400 }
            );
          }

          // Use numeric chat ID from getChat result
          chatId = getChatResult.result.id;
          console.log(`Got chat ID: ${chatId} for username ${normalizedUsername}`);
          
          // Optionally update bot's channelId in DB with numeric ID
          if (!bot.channelId || bot.channelId !== chatId) {
            try {
              await BotModel.findByIdAndUpdate(botId, {
                channelId: chatId,
                channelUsername: getChatResult.result.username || bot.channelUsername,
                channelTitle: getChatResult.result.title || bot.channelTitle,
              });
              console.log(`Updated bot's channelId in DB: ${chatId}`);
            } catch (updateError) {
              console.warn('Failed to update bot channelId in DB:', updateError);
              // Non-critical, continue with publishing
            }
          }
        } catch (getChatError: any) {
          console.error('Error getting chat info:', getChatError);
          return NextResponse.json(
            {
              error: 'Network error while getting channel info',
              details: getChatError.message,
            },
            { status: 500 }
          );
        }
      }

      // Send message via Telegram Bot API using numeric chat ID
      const telegramApiUrl = `https://api.telegram.org/bot${bot.tokenPlain}/sendMessage`;

      try {
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          const errorMessage = result.description || `Telegram API error: ${response.status}`;
          console.error('Telegram API error:', result);

          return NextResponse.json(
            {
              error: 'Failed to publish post',
              details: errorMessage,
              telegramResponse: result,
            },
            { status: 400 }
          );
        }

        // Post published successfully in Telegram, now save to database
        let savedPost;
        try {
          savedPost = await PostModel.create({
            botId,
            authorId: finalAuthorId,
            title: title || undefined,
            content,
            type: 'text',
            status: 'published',
            publishTarget,
          });

          // Update bot's postsCount
          await BotModel.findByIdAndUpdate(botId, {
            $inc: { postsCount: 1 },
          });
        } catch (dbError: any) {
          // Post was published in Telegram but failed to save in DB
          console.error('Failed to save post to database after Telegram publish:', dbError);
          return NextResponse.json(
            {
              error: 'Post published in Telegram but failed to save in database',
              details: dbError.message,
              telegramData: {
                messageId: result.result.message_id,
                chatId: result.result.chat.id,
                publishedAt: new Date(result.result.date * 1000).toISOString(),
              },
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Post published successfully',
          data: {
            postId: savedPost._id.toString(),
            messageId: result.result.message_id,
            chatId: result.result.chat.id,
            channelId: chatId,
            channelUsername: result.result.chat.username || bot.channelUsername,
            botUsername: bot.botUsername,
            publishedAt: new Date(result.result.date * 1000).toISOString(),
          },
        });
      } catch (fetchError: any) {
        console.error('Error sending message to Telegram:', fetchError);
        return NextResponse.json(
          {
            error: 'Network error while publishing',
            details: fetchError.message,
          },
          { status: 500 }
        );
      }
    }

    // Handle subscribers publishing (not implemented yet)
    if (publishTarget === 'subscribers') {
      return NextResponse.json(
        {
          error: 'Subscribers publishing is not implemented in test endpoint',
          hint: 'Use the bot API queue system for subscribers publishing',
        },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid publishTarget' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

