"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { botsApi, channelsApi, usersApi, type BotResponse, type ValidateBotResponse } from "./api";

/**
 * User model - compatible with MongoDB schema
 * All fields should match the backend User collection
 */
export interface User {
  // Core identity
  id: string;                    // MongoDB _id or generated
  email: string;                 // Required, unique
  passwordHash?: string;         // Stored on backend only
  
  // Profile info
  firstName: string;             // Required
  lastName?: string;
  username?: string;             // Display username
  bio?: string;
  photoUrl?: string;
  
  // Telegram integration
  telegramId?: number;           // Telegram user ID
  telegramUsername?: string;     // @username
  telegramAuthDate?: number;     // Auth timestamp
  
  // Organization
  company?: string;
  location?: string;
  website?: string;
  timezone?: string;             // e.g., "Europe/Moscow"
  
  // Subscription & billing
  plan: "free" | "pro" | "business";
  planExpiresAt?: string;        // ISO date
  stripeCustomerId?: string;
  isPremium?: boolean;
  
  // Usage & limits
  generationsUsed?: number;
  generationsLimit?: number;
  
  // Preferences
  language?: string;             // e.g., "ru", "en"
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  
  // Metadata
  createdAt: string;             // ISO date
  updatedAt?: string;            // ISO date
  lastLoginAt?: string;          // ISO date
  isActive?: boolean;
  isVerified?: boolean;
}

export interface Bot {
  id: string;
  name: string;
  username: string;
  token: string;
  telegramId?: number;
  isActive: boolean;
  channelId?: string | number;
  channelUsername?: string;
  channelTitle?: string;
  subscriberCount: number;
  postsCount: number;
}

export interface Channel {
  id: string;
  username: string;
  title: string;
  isTracking: boolean;
  memberCount?: number;
  lastParsed?: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  telegramUsername?: string;
}

export interface OnboardingData {
  botToken?: string;
  channelUsername?: string;
  channelForAnalysis?: string;
  selectedPlan: "free" | "pro" | "business";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  bots: Bot[];
  channels: Channel[];
  selectedBotId: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithTelegram: (telegramData: TelegramAuthData) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  addBot: (token: string) => Promise<Bot>;
  removeBot: (botId: string) => void;
  updateBot: (botId: string, data: Partial<Bot>) => void;
  selectBot: (botId: string) => void;
  addChannel: (username: string) => Promise<Channel>;
  removeChannel: (channelId: string) => void;
}

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "voicekeeper_auth";
const BOTS_KEY = "voicekeeper_bots";
const CHANNELS_KEY = "voicekeeper_channels";
const ONBOARDED_KEY = "voicekeeper_onboarded";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load persisted auth state from API (with localStorage fallback for demo)
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Try to load from localStorage first (for demo mode)
        const storedUser = localStorage.getItem(STORAGE_KEY);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Load user data from API if available
          try {
            const apiUser = await usersApi.get(parsedUser.id);
            setUser({
              ...parsedUser,
              plan: apiUser.plan || parsedUser.plan,
              generationsUsed: apiUser.generationsUsed || 0,
              generationsLimit: apiUser.generationsLimit || 3,
              isOnboarded: apiUser.isOnboarded !== undefined ? apiUser.isOnboarded : parsedUser.isOnboarded,
            });
            setIsOnboarded(apiUser.isOnboarded || false);
          } catch (error) {
            console.warn("Failed to load user from API, using local data:", error);
          }
          
          // Load bots from API
          try {
            const botsResponse = await botsApi.list(parsedUser.id);
            const apiBots: Bot[] = botsResponse.bots.map((b) => ({
              id: b.id,
              name: b.firstName || b.username,
              username: `@${b.username}`,
              token: "", // Token not returned from API for security
              telegramId: b.telegramId,
              isActive: b.isActive,
              channelId: b.channelId,
              channelUsername: b.channelUsername,
              channelTitle: b.channelTitle,
              subscriberCount: 0,
              postsCount: b.postsCount || 0,
            }));
            setBots(apiBots);
            if (apiBots.length > 0 && !selectedBotId) {
              setSelectedBotId(apiBots[0].id);
            }
          } catch (error) {
            console.warn("Failed to load bots from API:", error);
            // Fallback to localStorage
            const storedBots = localStorage.getItem(BOTS_KEY);
            if (storedBots) {
              const parsedBots = JSON.parse(storedBots);
              setBots(parsedBots);
              if (parsedBots.length > 0 && !selectedBotId) {
                setSelectedBotId(parsedBots[0].id);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Persist user to API (keep localStorage only for demo/auth persistence)
  useEffect(() => {
    if (!isLoading && user) {
      // Save to localStorage for auth persistence (demo mode)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      // Save to MongoDB via API
      if (user.id) {
        usersApi.update(user.id, {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          plan: user.plan,
          generationsUsed: user.generationsUsed,
          generationsLimit: user.generationsLimit,
          isOnboarded: isOnboarded,
        }).catch(error => {
          console.warn("Failed to save user to API:", error);
        });
      }
    }
  }, [user, isLoading, isOnboarded]);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
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
          isOnboarded: existingUser.isOnboarded || false,
        });
        
        const user: User = {
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
        
        setUser(user);
        setIsOnboarded(existingUser.isOnboarded);
      } catch {
        // User doesn't exist, create new user in MongoDB via API
        await usersApi.update(userId, {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          plan: "free",
          generationsUsed: 0,
          generationsLimit: 3,
          isOnboarded: false,
        });
        
        // Create local user object
        const newUser: User = {
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

        setUser(newUser);
        setIsOnboarded(false); // New user needs onboarding
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // For demo, create/get user ID based on email
      const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`;
      
      // Try to load user from API
      try {
        const apiUser = await usersApi.get(userId);
        const user: User = {
          id: apiUser.userId,
          email: apiUser.email || email,
          firstName: apiUser.firstName || email.split("@")[0],
          lastName: apiUser.lastName,
          plan: apiUser.plan,
          generationsUsed: apiUser.generationsUsed,
          generationsLimit: apiUser.generationsLimit,
          createdAt: new Date().toISOString(),
        };
        setUser(user);
        setIsOnboarded(apiUser.isOnboarded);
      } catch {
        // Create new user if not exists
        await usersApi.update(userId, {
          email,
          firstName: email.split("@")[0],
          plan: "free",
          generationsUsed: 0,
          generationsLimit: 3,
          isOnboarded: false,
        });
        
        const newUser: User = {
          id: userId,
          email,
          firstName: email.split("@")[0],
          plan: "free",
          generationsUsed: 0,
          generationsLimit: 3,
          createdAt: new Date().toISOString(),
        };
        
        setUser(newUser);
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTelegram = async (telegramData: TelegramAuthData) => {
    setIsLoading(true);
    
    try {
      const userId = telegramData.id.toString();
      
      // Load or create user from API
      try {
        const apiUser = await usersApi.get(userId);
        const user: User = {
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
        setUser(user);
        setIsOnboarded(apiUser.isOnboarded);
      } catch {
        // Create new user
        await usersApi.update(userId, {
          email: `${telegramData.username || telegramData.id}@telegram.user`,
          firstName: telegramData.first_name,
          lastName: telegramData.last_name,
          plan: "free",
          generationsUsed: 0,
          generationsLimit: 3,
          isOnboarded: false,
        });
        
        const newUser: User = {
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

        setUser(newUser);
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error("Telegram login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setBots([]);
    setChannels([]);
    setSelectedBotId(null);
    setIsOnboarded(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BOTS_KEY);
    localStorage.removeItem(CHANNELS_KEY);
    localStorage.removeItem(ONBOARDED_KEY);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      // Add bot if provided
      if (data.botToken) {
        try {
          await addBot(data.botToken);
        } catch (e) {
          // Ignore bot validation errors during onboarding
          console.log("Bot token validation skipped:", e);
        }
      }
      
      // Add channel for analysis if provided
      if (data.channelForAnalysis) {
        try {
          await addChannel(data.channelForAnalysis);
        } catch (e) {
          console.log("Channel already exists:", e);
        }
      }
      
      // Update user plan locally first (for immediate UI update)
      if (user) {
        setUser({ ...user, plan: data.selectedPlan });
      }
      
      setIsOnboarded(true);
      
      // Update user onboarding status in API (non-blocking)
      if (user) {
        try {
          await usersApi.update(user.id, { isOnboarded: true });
        } catch (error) {
          // Don't block onboarding if API is unavailable
          console.warn("Failed to update user onboarding status in API:", error);
        }
      }
    } catch (error) {
      console.error("Onboarding completion failed:", error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update in backend via API
      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        plan: data.plan,
        generationsUsed: data.generationsUsed,
        generationsLimit: data.generationsLimit,
      };
      
      // Add isOnboarded if it's being updated
      if ('isOnboarded' in data && data.isOnboarded !== undefined) {
        updateData.isOnboarded = data.isOnboarded;
      } else if (isOnboarded !== undefined) {
        updateData.isOnboarded = isOnboarded;
      }
      
      await usersApi.update(user.id, updateData);
      
      // Update local state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error("Failed to update user:", error);
      // Still update local state
      setUser({ ...user, ...data });
    }
  };

  const addBot = async (token: string): Promise<Bot> => {
    // Validate token format
    if (!token || token.length < 10) {
      throw new Error("Токен бота слишком короткий");
    }

    // Check if bot already exists locally
    if (bots.some((b) => b.token === token)) {
      throw new Error("Этот бот уже добавлен");
    }

    try {
      // First validate the token with Telegram API
      const validation: ValidateBotResponse = await botsApi.validate(token);
      
      if (!validation.valid || !validation.bot) {
        throw new Error(validation.error || "Невалидный токен бота");
      }

      // Register bot in backend
      const registered: BotResponse = await botsApi.create({
        token,
        ownerId: user?.id || "anonymous",
      });

      const newBot: Bot = {
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

      setBots((prev) => [...prev, newBot]);
      
      if (!selectedBotId) {
        setSelectedBotId(newBot.id);
      }

      return newBot;
    } catch (error: any) {
      // If backend is not available, fallback to local-only mode
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        console.warn("Backend not available, using local-only mode");
        
        const newBot: Bot = {
          id: "bot-" + Date.now(),
          name: "My Bot (offline)",
          username: "@bot_" + Date.now().toString().slice(-6),
          token,
          isActive: true,
          subscriberCount: 0,
          postsCount: 0,
        };

        setBots((prev) => [...prev, newBot]);
        
        if (!selectedBotId) {
          setSelectedBotId(newBot.id);
        }

        return newBot;
      }
      
      throw error;
    }
  };

  const removeBot = async (botId: string) => {
    try {
      // Delete from backend
      await botsApi.delete(botId);
    } catch (error) {
      console.error("Failed to delete bot from API:", error);
    }
    
    // Update local state
    setBots((prev) => prev.filter((b) => b.id !== botId));
    
    if (selectedBotId === botId) {
      const remaining = bots.filter((b) => b.id !== botId);
      setSelectedBotId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateBot = async (botId: string, data: Partial<Bot>) => {
    try {
      // Update in backend via API
      await botsApi.update(botId, {
        channelId: data.channelId !== undefined 
          ? (typeof data.channelId === 'number' ? data.channelId.toString() : data.channelId)
          : undefined,
        isActive: data.isActive,
      });
      
      // Update local state
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
      );
    } catch (error) {
      console.error("Failed to update bot:", error);
      // Still update local state for UI responsiveness
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
      );
    }
  };

  const selectBot = (botId: string) => {
    setSelectedBotId(botId);
  };

  const addChannel = async (username: string): Promise<Channel> => {
    const normalizedUsername = username.startsWith("@") ? username : `@${username}`;

    if (channels.some((c) => c.username === normalizedUsername)) {
      throw new Error("Канал уже добавлен");
    }

    // Try to get channel info from API if we have a selected bot
    let channelInfo: Channel | null = null;
    
    if (selectedBotId) {
      const selectedBot = bots.find(b => b.id === selectedBotId);
      
      if (selectedBot) {
        try {
          const response = await channelsApi.track({
            botId: selectedBotId,
            channelId: normalizedUsername,
            type: 'source',
          });
          
          channelInfo = {
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
    const newChannel: Channel = channelInfo || {
      id: "channel-" + Date.now(),
      username: normalizedUsername,
      title: normalizedUsername.replace("@", ""),
      isTracking: true,
    };

    setChannels((prev) => [...prev, newChannel]);
    return newChannel;
  };

  const removeChannel = (channelId: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isOnboarded,
        bots,
        channels,
        selectedBotId,
        register,
        login,
        loginWithTelegram,
        logout,
        completeOnboarding,
        updateUser,
        addBot,
        removeBot,
        updateBot,
        selectBot,
        addChannel,
        removeChannel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Could redirect to login here
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
}
