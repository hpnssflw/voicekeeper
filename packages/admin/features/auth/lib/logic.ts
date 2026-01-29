/**
 * Auth business logic
 * Pure functions for auth operations (no React hooks)
 */

import { botsApi, channelsApi, usersApi, type BotResponse, type ValidateBotResponse } from '../../../shared/api';
import type { User, Bot, Channel, RegisterData, TelegramAuthData } from '../model/types';

/**
 * Load bots for a user
 */
export async function loadBotsForUser(userId: string): Promise<Bot[]> {
  try {
    const botsResponse = await botsApi.list(userId);
    
    const apiBots: Bot[] = await Promise.all(
      botsResponse.bots.map(async (b) => {
        // Получаем токен из API (только для владельца)
        let token = "";
        try {
          const tokenResponse = await fetch(`/api/bots/${b.id}/token?ownerId=${userId}`);
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            token = tokenData.key || "";
          }
        } catch (e) {
          // Token not available, continue without it
        }
        
        return {
          id: b.id,
          name: b.firstName || b.username,
          username: `@${b.username}`,
          token,
          telegramId: b.telegramId,
          isActive: b.isActive,
          channelId: b.channelId,
          channelUsername: b.channelUsername,
          channelTitle: b.channelTitle,
          subscriberCount: 0,
          postsCount: b.postsCount || 0,
        };
      })
    );
    
    return apiBots;
  } catch (error) {
    console.warn("Failed to load bots from API:", error);
    return [];
  }
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<User> {
  // Generate stable user ID based on email (same as login)
  const userId = `user-${data.email.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  // Check if user already exists
  try {
    const existingUser = await usersApi.get(userId);
    // User exists, update with registration data
    await usersApi.update(userId, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      plan: existingUser.plan || "free",
      generationsUsed: existingUser.generationsUsed || 0,
      generationsLimit: existingUser.generationsLimit || 3,
    });
    
    return {
      id: existingUser.userId,
      email: existingUser.email || data.email,
      firstName: existingUser.firstName || data.firstName,
      lastName: existingUser.lastName || data.lastName,
      telegramUsername: data.telegramUsername,
      plan: existingUser.plan,
      generationsUsed: existingUser.generationsUsed,
      generationsLimit: existingUser.generationsLimit,
      createdAt: new Date().toISOString(),
    };
  } catch {
    // User doesn't exist, create new user in MongoDB via API
    await usersApi.update(userId, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
    });
    
    // Create local user object
    return {
      id: userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      telegramUsername: data.telegramUsername,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  // For demo, create/get user ID based on email
  const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  // Try to load user from API
  try {
    const apiUser = await usersApi.get(userId);
    return {
      id: apiUser.userId,
      email: apiUser.email || email,
      firstName: apiUser.firstName || email.split("@")[0],
      lastName: apiUser.lastName,
      plan: apiUser.plan,
      generationsUsed: apiUser.generationsUsed,
      generationsLimit: apiUser.generationsLimit,
      createdAt: new Date().toISOString(),
    };
  } catch {
    // Create new user if not exists
    await usersApi.update(userId, {
      email,
      firstName: email.split("@")[0],
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
    });
    
    return {
      id: userId,
      email,
      firstName: email.split("@")[0],
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Login with Telegram
 */
export async function loginWithTelegramUser(telegramData: TelegramAuthData): Promise<User> {
  const userId = telegramData.id.toString();
  
  // Load or create user from API
  try {
    const apiUser = await usersApi.get(userId);
    return {
      id: apiUser.userId,
      email: apiUser.email || `${telegramData.username || telegramData.id}@telegram.user`,
      firstName: apiUser.firstName || telegramData.first_name,
      lastName: apiUser.lastName || telegramData.last_name,
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
      photoUrl: telegramData.photo_url,
      plan: apiUser.plan,
      generationsUsed: apiUser.generationsUsed,
      generationsLimit: apiUser.generationsLimit,
      createdAt: new Date().toISOString(),
    };
  } catch {
    // Create new user
    await usersApi.update(userId, {
      email: `${telegramData.username || telegramData.id}@telegram.user`,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
    });
    
    return {
      id: userId,
      email: `${telegramData.username || telegramData.id}@telegram.user`,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
      photoUrl: telegramData.photo_url,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 3,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Update user
 */
export async function updateUserData(userId: string, data: Partial<User>): Promise<User> {
  const updateData: any = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    plan: data.plan,
    generationsUsed: data.generationsUsed,
    generationsLimit: data.generationsLimit,
  };
  
  const updated = await usersApi.update(userId, updateData);
  
  return {
    id: updated.userId,
    email: updated.email || data.email || "",
    firstName: updated.firstName || data.firstName || "",
    lastName: updated.lastName || data.lastName,
    plan: updated.plan,
    generationsUsed: updated.generationsUsed,
    generationsLimit: updated.generationsLimit,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

/**
 * Add bot
 */
export async function addBotForUser(token: string, userId: string, existingBots: Bot[]): Promise<Bot> {
  // Validate token format
  if (!token || token.length < 10) {
    throw new Error("Токен бота слишком короткий");
  }

  // Check if bot already exists locally
  if (existingBots.some((b) => b.token === token)) {
    throw new Error("Этот бот уже добавлен");
  }

  // First validate the token with Telegram API
  const validation: ValidateBotResponse = await botsApi.validate(token);
  
  if (!validation.valid || !validation.bot) {
    throw new Error(validation.error || "Невалидный токен бота");
  }

  // Register bot in backend
  const registered: BotResponse = await botsApi.create({
    token,
    ownerId: userId,
  });

  return {
    id: registered.id,
    name: validation.bot.firstName || registered.username,
    username: `@${registered.username}`,
    token,
    telegramId: validation.bot.id,
    isActive: registered.isActive,
    channelId: registered.channel?.id,
    channelUsername: registered.channel?.username,
    channelTitle: registered.channel?.title,
    subscriberCount: 0,
    postsCount: registered.stats?.postsCount || 0,
  };
}

/**
 * Remove bot
 */
export async function removeBotForUser(botId: string): Promise<void> {
  await botsApi.delete(botId);
}

/**
 * Update bot
 */
export async function updateBotForUser(botId: string, data: Partial<Bot>): Promise<void> {
  await botsApi.update(botId, {
    channelId: data.channelId !== undefined 
      ? (typeof data.channelId === 'number' ? data.channelId.toString() : data.channelId)
      : undefined,
    isActive: data.isActive,
  });
}

/**
 * Add channel
 */
export async function addChannelForUser(
  username: string,
  selectedBotId: string | null,
  existingBots: Bot[],
  existingChannels: Channel[]
): Promise<Channel> {
  const normalizedUsername = username.startsWith("@") ? username : `@${username}`;

  if (existingChannels.some((c) => c.username === normalizedUsername)) {
    throw new Error("Канал уже добавлен");
  }

  // Try to get channel info from API if we have a selected bot
  if (selectedBotId) {
    const selectedBot = existingBots.find(b => b.id === selectedBotId);
    
    if (selectedBot) {
      try {
        const response = await channelsApi.track({
          botId: selectedBotId,
          channelId: normalizedUsername,
          type: 'source',
        });
        
        return {
          id: response.channel.id.toString(),
          username: response.channel.username ? `@${response.channel.username}` : normalizedUsername,
          title: response.channel.title || normalizedUsername.replace("@", ""),
          isTracking: true,
        };
      } catch (error) {
        console.warn("Could not get channel info from API:", error);
      }
    }
  }

  // Fallback to local-only channel
  return {
    id: "channel-" + Date.now(),
    username: normalizedUsername,
    title: normalizedUsername.replace("@", ""),
    isTracking: true,
  };
}

/**
 * Create user from OAuth session
 */
export function createUserFromOAuth(sessionUser: any): User {
  const userId = sessionUser.id || `oauth-${sessionUser.email?.replace(/[^a-zA-Z0-9]/g, "-")}`;
  
  return {
    id: userId,
    email: sessionUser.email || "",
    firstName: sessionUser.name?.split(" ")[0] || sessionUser.email?.split("@")[0] || "User",
    lastName: sessionUser.name?.split(" ").slice(1).join(" ") || "",
    photoUrl: sessionUser.image || undefined,
    plan: "free",
    generationsUsed: 0,
    generationsLimit: 3,
    createdAt: new Date().toISOString(),
  };
}

