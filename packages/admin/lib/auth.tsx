"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  isActive: boolean;
  channelId?: string;
  channelUsername?: string;
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
  updateUser: (data: Partial<User>) => void;
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

  // Load persisted auth state
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const storedBots = localStorage.getItem(BOTS_KEY);
        const storedChannels = localStorage.getItem(CHANNELS_KEY);
        const storedOnboarded = localStorage.getItem(ONBOARDED_KEY);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        if (storedBots) {
          const parsedBots = JSON.parse(storedBots);
          setBots(parsedBots);
          if (parsedBots.length > 0 && !selectedBotId) {
            setSelectedBotId(parsedBots[0].id);
          }
        }
        
        if (storedChannels) {
          setChannels(JSON.parse(storedChannels));
        }
        
        if (storedOnboarded) {
          setIsOnboarded(JSON.parse(storedOnboarded));
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Persist auth state
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
    }
  }, [bots, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
    }
  }, [channels, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(ONBOARDED_KEY, JSON.stringify(isOnboarded));
    }
  }, [isOnboarded, isLoading]);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      // In a real app, send to backend
      // For now, create local user
      const newUser: User = {
        id: "user-" + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        telegramUsername: data.telegramUsername,
        plan: "free",
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setIsOnboarded(false); // New user needs onboarding
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
      // In a real app, verify with backend
      // For demo, check if user exists in localStorage
      const storedUser = localStorage.getItem(STORAGE_KEY);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
          setUser(parsedUser);
          return;
        }
      }
      
      // Create mock user for demo
      const newUser: User = {
        id: "user-" + Date.now(),
        email,
        firstName: email.split("@")[0],
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      
      setUser(newUser);
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
      const newUser: User = {
        id: telegramData.id.toString(),
        email: `${telegramData.username || telegramData.id}@telegram.user`,
        firstName: telegramData.first_name,
        lastName: telegramData.last_name,
        telegramId: telegramData.id,
        telegramUsername: telegramData.username,
        photoUrl: telegramData.photo_url,
        plan: "free",
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
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
      
      // Update user plan
      if (user) {
        setUser({ ...user, plan: data.selectedPlan });
      }
      
      setIsOnboarded(true);
    } catch (error) {
      console.error("Onboarding completion failed:", error);
      throw error;
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addBot = async (token: string): Promise<Bot> => {
    // Validate token format (relaxed for demo)
    if (!token || token.length < 10) {
      throw new Error("Токен бота слишком короткий");
    }

    // Check if bot already exists
    if (bots.some((b) => b.token === token)) {
      throw new Error("Этот бот уже добавлен");
    }

    // In real app, verify with Telegram API
    const newBot: Bot = {
      id: "bot-" + Date.now(),
      name: "My Bot",
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
  };

  const removeBot = (botId: string) => {
    setBots((prev) => prev.filter((b) => b.id !== botId));
    
    if (selectedBotId === botId) {
      const remaining = bots.filter((b) => b.id !== botId);
      setSelectedBotId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateBot = (botId: string, data: Partial<Bot>) => {
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
    );
  };

  const selectBot = (botId: string) => {
    setSelectedBotId(botId);
  };

  const addChannel = async (username: string): Promise<Channel> => {
    const normalizedUsername = username.startsWith("@") ? username : `@${username}`;

    if (channels.some((c) => c.username === normalizedUsername)) {
      throw new Error("Канал уже добавлен");
    }

    const newChannel: Channel = {
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
