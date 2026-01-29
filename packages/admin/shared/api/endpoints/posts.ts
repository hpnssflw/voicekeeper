/**
 * Posts API endpoints
 */

import { api } from '../client';
import type { Post, PostsListResponse } from '../types';

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

