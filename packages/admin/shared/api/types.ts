/**
 * Shared API types
 */

// Bot API Types
export interface TelegramBotInfo {
  id: number;
  username: string;
  firstName: string;
  canJoinGroups?: boolean;
  canReadAllGroupMessages?: boolean;
  supportsInlineQueries?: boolean;
}

export interface ValidateBotResponse {
  valid: boolean;
  bot?: TelegramBotInfo;
  error?: string;
}

export interface BotResponse {
  id: string;
  username: string;
  firstName?: string;
  telegramId?: number;
  isActive: boolean;
  channel?: {
    id: number | string;
    username?: string;
    title?: string;
    membersCount?: number;
  } | null;
  stats?: {
    postsCount: number;
    publishedCount: number;
  };
  createdAt?: string;
}

export interface BotsListResponse {
  bots: Array<{
    id: string;
    username: string;
    firstName?: string;
    telegramId?: number;
    isActive: boolean;
    channelId?: number | string;
    channelUsername?: string;
    channelTitle?: string;
    postsCount: number;
    createdAt?: string;
  }>;
}

// Channel API Types
export interface ChannelInfoResponse {
  channel: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    description?: string;
    membersCount: number;
    hasPhoto: boolean;
    inviteLink?: string;
  };
  botAccess: {
    role: string;
    canPost: boolean;
    canReadHistory: boolean;
  };
  apiLimitations: {
    historyAccess: string;
    recommendation: string;
  };
}

// Posts API Types
export interface Post {
  _id: string;
  botId: string;
  authorId: string;
  title?: string;
  content?: string;
  type?: string;
  status: 'draft' | 'scheduled' | 'published';
  publishTarget?: 'channel' | 'subscribers';
  scheduledAt?: string;
  metrics?: {
    views: number;
    clicks: number;
    conversions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostsListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

// MTProto API Types
export interface MTProtoSessionStatus {
  authenticated: boolean;
  user?: {
    userId: number;
    username?: string;
    firstName?: string;
    lastUsed?: string;
  } | null;
}

export interface ParsedPost {
  _id: string;
  channelId: number;
  messageId: number;
  date: string;
  text: string;
  hasMedia: boolean;
  mediaType?: string;
  views?: number;
  forwards?: number;
  wordCount: number;
  hasLinks: boolean;
  hasHashtags: boolean;
  hashtags: string[];
}

export interface ChannelAnalytics {
  totalPosts: number;
  postsWithMedia: number;
  mediaPercentage: number;
  avgViews: number;
  topHashtags: Array<{ tag: string; count: number }>;
  postsByDay: Array<{ date: string; count: number; avgViews: number }>;
}

// Users API Types
export interface UserResponse {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  plan: 'free' | 'pro' | 'business';
  generationsUsed: number;
  generationsLimit: number;
  isOnboarded: boolean;
  language?: string;
  photoUrl?: string;
  provider?: string;
}

// Note: UserSettingsResponse depends on StyleProfile from features/voicekeeper
// Will be imported there or re-exported

