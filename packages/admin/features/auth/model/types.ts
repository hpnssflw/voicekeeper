/**
 * Auth feature types
 */

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

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bots: Bot[];
  channels: Channel[];
  selectedBotId: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithTelegram: (telegramData: TelegramAuthData) => Promise<void>;
  loginWithOAuth: (provider: "google") => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  addBot: (token: string) => Promise<Bot>;
  removeBot: (botId: string) => void;
  updateBot: (botId: string, data: Partial<Bot>) => void;
  selectBot: (botId: string) => void;
  addChannel: (username: string) => Promise<Channel>;
  removeChannel: (channelId: string) => void;
}

