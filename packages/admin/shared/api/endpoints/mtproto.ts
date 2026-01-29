/**
 * MTProto API endpoints
 */

import { api } from '../client';
import type { MTProtoSessionStatus, ParsedPost, ChannelAnalytics } from '../types';

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
  startAuth: (ownerId: string, phoneNumber: string): Promise<{ success: boolean; phoneCodeHash: string; phoneCodeType?: string; message: string }> => {
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

  /**
   * Post message to channel via MTProto
   */
  postToChannel: (data: {
    ownerId: string;
    channelUsername: string;
    message: string;
    parseMode?: 'html' | 'markdown';
    silent?: boolean;
    scheduleDate?: string;
  }): Promise<{ success: boolean; messageId?: number; message?: string }> => {
    return api.post('/mtproto/channels/post', data);
  },
};

