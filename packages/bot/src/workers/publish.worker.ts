import { Markup, Telegraf } from 'telegraf';
import { env } from '../config/env';
import type { PublishJob } from '../queues/publish.queue';
import { BotsRepository } from '../repositories/bots.repo';
import { PostsRepository } from '../repositories/posts.repo';
import { SubscribersRepository } from '../repositories/subscribers.repo';

export async function handlePublishJob(data: PublishJob): Promise<void> {
  const { botId, postId } = data;
  
  console.log(`Processing publish job: postId=${postId}, botId=${botId}`);
  
  // Get post
  const postsRepo = new PostsRepository();
  const post = await postsRepo.findById(postId);
  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }

  // Get bot token: try from DB first, fallback to env (single-bot mode)
  let botToken: string | null = null;
  const botsRepo = new BotsRepository();
  const bot = await botsRepo.findById(botId);
  
  if (bot?.tokenPlain) {
    botToken = bot.tokenPlain;
    console.log(`Using bot token from DB for botId=${botId}`);
  } else if (env.TELEGRAM_BOT_TOKEN) {
    botToken = env.TELEGRAM_BOT_TOKEN;
    console.log(`Bot not found in DB, using TELEGRAM_BOT_TOKEN from env (single-bot mode)`);
  } else {
    throw new Error(`Bot not found (${botId}) and TELEGRAM_BOT_TOKEN not set`);
  }

  // Create Telegraf instance
  const telegrafBot = new Telegraf(botToken);

  // Format post content (escape Markdown special chars if needed)
  const title = post.title || '';
  const content = post.content || '';
  const text = title && content 
    ? `*${title}*\n\n${content}`
    : title || content;

  if (!text.trim()) {
    throw new Error(`Post ${postId} has no content to publish`);
  }

  // Determine publish mode: use publishTarget from post, fallback to env
  const publishMode = post.publishTarget || env.PUBLISH_MODE || 'channel';
  
  // Get channelId: prioritize bot's channel from DB, fallback to env (for backward compatibility)
  let channelId: string | number | null | undefined = null;
  if (bot?.channelId) {
    channelId = bot.channelId;
    console.log(`Using channel from bot DB: ${channelId}`);
  } else if (bot?.channelUsername) {
    // Normalize username: ensure it starts with @
    channelId = bot.channelUsername.startsWith('@') 
      ? bot.channelUsername 
      : `@${bot.channelUsername}`;
    console.log(`Using channel username from bot DB: ${channelId}`);
  } else if (env.TELEGRAM_CHANNEL_ID) {
    // Fallback to env for backward compatibility (single-bot mode)
    channelId = env.TELEGRAM_CHANNEL_ID;
    console.log(`Using channel from env (fallback): ${channelId}`);
  }
  
  console.log(`Publish settings: mode=${publishMode} (from post), channelId=${channelId || 'NOT SET'}, botToken=${botToken.substring(0, 10)}...`);
  
  try {
    if (publishMode === 'channel') {
      // Send to channel (requires bot to be admin in channel)
      if (!channelId) {
        console.error(`❌ Channel not configured for bot ${botId}`);
        console.error(`   Bot channelId: ${bot?.channelId || 'NOT SET'}`);
        console.error(`   Bot channelUsername: ${bot?.channelUsername || 'NOT SET'}`);
        console.error(`   Env TELEGRAM_CHANNEL_ID: ${env.TELEGRAM_CHANNEL_ID || 'NOT SET'}`);
        console.error(`   Configure channel via /api/bots/${botId} (PUT) or /api/channels/track`);
        throw new Error(`Channel not configured for bot ${botId}. Please set up a channel for this bot first.`);
      }
      
      console.log(`📨 Sending message to channel: ${channelId} (bot: ${bot?.botUsername || botId})`);
      console.log(`📝 Message preview: ${text.substring(0, 50)}...`);
      
      // Add button to open Admin Panel if ADMIN_URL is set and HTTPS
      const adminUrl = process.env.ADMIN_URL;
      const hasAdminButton = adminUrl && adminUrl.startsWith('https://');
      
      let replyMarkup: any = undefined;
      if (hasAdminButton) {
        // Use URL button for admin panel (not WebApp button, as it's not a Telegram Mini App)
        replyMarkup = Markup.inlineKeyboard([
          [Markup.button.url('📱 Открыть админку', adminUrl)]
        ]).reply_markup;
        console.log(`🔗 Adding Admin Panel button: ${adminUrl}`);
      }
      
      try {
        await telegrafBot.telegram.sendMessage(channelId, text, {
          parse_mode: 'Markdown',
          reply_markup: replyMarkup,
        });
      } catch (sendErr: any) {
        throw sendErr;
      }
      
      console.log(`✅ Post ${postId} published to channel ${channelId}${hasAdminButton ? ' with Admin Panel button' : ''}`);
    } else if (publishMode === 'subscribers') {
      // Send to all bot subscribers (broadcast)
      const subscribersRepo = new SubscribersRepository();
      const subscribers = await subscribersRepo.findActiveByBotId(botId);
      
      if (!subscribers || subscribers.length === 0) {
        console.warn(`⚠️ No active subscribers found for botId=${botId}`);
        return;
      }
      
      console.log(`📬 Broadcasting to ${subscribers.length} subscribers...`);
      
      let successCount = 0;
      let failCount = 0;
      
      // Send to each subscriber (with rate limiting - Telegram allows 30 messages/second)
      for (const sub of subscribers) {
        try {
          await telegrafBot.telegram.sendMessage(sub.telegramId, text, {
            parse_mode: 'Markdown',
          });
          successCount++;
          
          // Rate limiting: ~20 messages/second to be safe
          if (successCount % 20 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err: any) {
          failCount++;
          const errorMsg = err.response?.description || err.message || 'Unknown error';
          
          // Mark as blocked if user blocked the bot
          if (errorMsg.includes('blocked') || errorMsg.includes('Forbidden')) {
            console.warn(`  → Subscriber ${sub.telegramId} blocked the bot, marking as blocked`);
            // TODO: Update subscriber status to 'blocked'
          } else {
            console.error(`  → Failed to send to ${sub.telegramId}:`, errorMsg);
          }
        }
      }
      
      console.log(`✅ Broadcast completed: ${successCount} sent, ${failCount} failed`);
    } else {
      throw new Error(`Invalid PUBLISH_MODE: ${publishMode}. Use 'channel' or 'subscribers'`);
    }
  } catch (err: any) {
    const errorMsg = err.response?.description || err.message || 'Unknown error';
    console.error(`✗ Failed to publish post ${postId}:`, errorMsg);
    
    // Common errors with detailed context:
    if (errorMsg.includes('chat not found') || errorMsg.includes('CHAT_NOT_FOUND')) {
      console.error(`  → Channel not found or bot is not admin in channel`);
      console.error(`  → Bot: ${bot?.botUsername || botId}, Channel: ${channelId}`);
      console.error(`  → Make sure bot is added as admin to the channel`);
    }
    if (errorMsg.includes('Forbidden') || errorMsg.includes('bot was blocked')) {
      console.error(`  → Bot doesn't have permission to post in channel`);
      console.error(`  → Bot: ${bot?.botUsername || botId}, Channel: ${channelId}`);
      console.error(`  → Check bot's admin rights in the channel`);
    }
    
    throw err;
  }
  // Note: Telegraf instance is fine to leave as-is (not in polling mode)
}

