// Safe API_BASE with fallback for local development
// On Vercel, this should be set via environment variables
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    // Gracefully handle missing API_BASE
    if (!this.baseUrl || this.baseUrl === 'undefined' || this.baseUrl.trim() === '') {
      throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_BASE environment variable.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle network errors
      if (!res.ok && res.status === 0) {
        throw new Error('Network error: Unable to reach API server');
      }

      let json: any;
      try {
        json = await res.json();
      } catch (parseError) {
        throw new Error(`Invalid response from API: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        const msg = json.error || json.message || `API error ${res.status}`;
        throw new Error(msg);
      }

      // Return full response for endpoints that don't wrap in { data: ... }
      return json as T;
    } catch (error) {
      // Re-throw if it's already our Error
      if (error instanceof Error) {
        throw error;
      }
      // Handle other errors (network, timeout, etc.)
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export const api = new ApiClient(API_BASE);

// ============================================
// Bot API
// ============================================

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

export const botsApi = {
  /**
   * Validate a bot token and get bot info from Telegram
   */
  validate: (token: string): Promise<ValidateBotResponse> => {
    return api.post('/bots/validate', { token });
  },

  /**
   * Register a new bot
   */
  create: (data: { token: string; ownerId: string; channelId?: string }): Promise<BotResponse> => {
    return api.post('/bots', data);
  },

  /**
   * Get bot details with stats
   */
  get: (botId: string): Promise<BotResponse> => {
    return api.get(`/bots/${botId}`);
  },

  /**
   * Update bot settings
   */
  update: (botId: string, data: { channelId?: string | null; isActive?: boolean }): Promise<BotResponse> => {
    return api.put(`/bots/${botId}`, data);
  },

  /**
   * Delete a bot
   */
  delete: (botId: string): Promise<{ success: boolean; deletedId: string }> => {
    return api.delete(`/bots/${botId}`);
  },

  /**
   * List user's bots
   */
  list: (ownerId?: string): Promise<BotsListResponse> => {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    return api.get(`/bots${query}`);
  },

  /**
   * Get bot's channel info
   */
  getChannel: (botId: string): Promise<{
    channel: {
      id: number;
      title?: string;
      username?: string;
      type: string;
      membersCount: number;
      description?: string;
    };
    historyAvailable: boolean;
    historyNote: string;
  }> => {
    return api.get(`/bots/${botId}/channel`);
  },
};

// ============================================
// Channel API
// ============================================

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

export const channelsApi = {
  /**
   * Get channel info
   */
  getInfo: (data: { channelId: string; botToken?: string; botId?: string }): Promise<ChannelInfoResponse> => {
    return api.post('/channels/info', data);
  },

  /**
   * List channels for a bot
   */
  list: (botId: string): Promise<{ channels: Array<{ id: number | string; username?: string; title?: string; type: string }> }> => {
    return api.get(`/channels?botId=${botId}`);
  },

  /**
   * Track a new channel
   */
  track: (data: { botId: string; channelId: string; type?: 'publishing' | 'source' }): Promise<{
    success: boolean;
    channel: { id: number; username?: string; title?: string; type: string };
  }> => {
    return api.post('/channels/track', data);
  },

  /**
   * Parse channel (returns limitation info)
   */
  parse: (): Promise<{
    error: string;
    reason: string;
    solutions: Array<{ name: string; description: string; complexity: string; requirement: string }>;
    workaround: string;
  }> => {
    return api.post('/channels/parse');
  },
};

// ============================================
// Posts API
// ============================================

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

// ============================================
// MTProto API (for full channel parsing)
// ============================================

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

export const mtprotoApi = {
  /**
   * Check if MTProto is configured on the server
   */
  getStatus: (): Promise<{ configured: boolean; message: string; documentation: string }> => {
    return api.get('/mtproto/status');
  },

  /**
   * Check if user has an active MTProto session
   */
  getSession: (ownerId: string): Promise<MTProtoSessionStatus> => {
    return api.get(`/mtproto/session?ownerId=${ownerId}`);
  },

  /**
   * Start authentication - sends code to phone
   */
  startAuth: (ownerId: string, phoneNumber: string): Promise<{ success: boolean; phoneCodeHash: string; message: string }> => {
    return api.post('/mtproto/auth/start', { ownerId, phoneNumber });
  },

  /**
   * Complete authentication with code
   */
  completeAuth: (data: {
    ownerId: string;
    phoneNumber: string;
    phoneCodeHash: string;
    phoneCode: string;
    password?: string;
  }): Promise<{ success: boolean; user?: any }> => {
    return api.post('/mtproto/auth/complete', data);
  },

  /**
   * Logout MTProto session
   */
  logout: (ownerId: string): Promise<{ success: boolean; message: string }> => {
    return api.post('/mtproto/auth/logout', { ownerId });
  },

  /**
   * Get channel info via MTProto
   */
  getChannelInfo: (ownerId: string, channelUsername: string): Promise<{ channel: any }> => {
    return api.post('/mtproto/channels/info', { ownerId, channelUsername });
  },

  /**
   * Parse channel messages
   */
  parseChannel: (data: {
    ownerId: string;
    channelUsername: string;
    limit?: number;
    offsetId?: number;
  }): Promise<{ posts: ParsedPost[]; hasMore: boolean; lastMessageId?: number }> => {
    return api.post('/mtproto/channels/parse', data);
  },

  /**
   * Get tracked channels
   */
  getTrackedChannels: (ownerId: string): Promise<{ channels: any[] }> => {
    return api.get(`/mtproto/channels?ownerId=${ownerId}`);
  },

  /**
   * Get parsed posts from database
   */
  getParsedPosts: (params: {
    ownerId: string;
    channelId: number;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'views';
  }): Promise<{ posts: ParsedPost[]; total: number; page: number; limit: number }> => {
    const query = new URLSearchParams();
    query.set('ownerId', params.ownerId);
    query.set('channelId', params.channelId.toString());
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    return api.get(`/mtproto/posts?${query.toString()}`);
  },

  /**
   * Delete tracked channel
   */
  deleteChannel: (ownerId: string, channelId: number): Promise<{ success: boolean }> => {
    return api.delete(`/mtproto/channels/${channelId}?ownerId=${ownerId}`);
  },

  /**
   * Get channel analytics
   */
  getChannelAnalytics: (ownerId: string, channelId: number): Promise<ChannelAnalytics> => {
    return api.get(`/mtproto/channels/${channelId}/analytics?ownerId=${ownerId}`);
  },
};

export const postsApi = {
  /**
   * List posts for a bot
   */
  list: (params: { botId: string; status?: string; page?: number; limit?: number }): Promise<PostsListResponse> => {
    const query = new URLSearchParams();
    query.set('botId', params.botId);
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    return api.get(`/posts?${query.toString()}`);
  },

  /**
   * Get a single post
   */
  get: (postId: string): Promise<Post> => {
    return api.get(`/posts/${postId}`);
  },

  /**
   * Create a new post
   */
  create: (data: {
    botId: string;
    authorId: string;
    title?: string;
    content: string;
    status?: 'draft' | 'scheduled' | 'published';
    publishTarget?: 'channel' | 'subscribers';
    scheduledAt?: string;
  }): Promise<Post> => {
    return api.post('/posts', data);
  },

  /**
   * Update a post
   */
  update: (postId: string, data: Partial<Post>): Promise<Post> => {
    return api.put(`/posts/${postId}`, data);
  },

  /**
   * Delete a post
   */
  delete: (postId: string): Promise<{ success: boolean }> => {
    return api.delete(`/posts/${postId}`);
  },
};
