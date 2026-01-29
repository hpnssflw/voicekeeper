/**
 * Users API endpoints
 */

import { api } from '../client';
import type { UserResponse } from '../types';

// Note: StyleProfile will be imported from features/voicekeeper when needed
// For now, using any to avoid circular dependency
export interface UserSettingsResponse {
  aiProvider?: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiApiKey?: string;
  fingerprint?: any; // Will be typed as StyleProfile from features/voicekeeper
}

export const usersApi = {
  /**
   * Get user data
   * Uses Next.js API route: /api/users/[userId]
   */
  get: (userId: string): Promise<UserResponse> => {
    return api.get(`/users/${userId}`);
  },

  /**
   * Update user data
   * Uses Next.js API route: /api/users/[userId]
   */
  update: (userId: string, data: Partial<UserResponse>): Promise<UserResponse> => {
    return api.put(`/users/${userId}`, data);
  },

  /**
   * Get user settings (API keys, fingerprint)
   * Uses Next.js API route: /api/users/[userId]/settings
   */
  getSettings: (userId: string): Promise<UserSettingsResponse> => {
    return api.get(`/users/${userId}/settings`);
  },

  /**
   * Update user settings (API keys, fingerprint)
   * Uses Next.js API route: /api/users/[userId]/settings
   */
  updateSettings: (userId: string, data: {
    aiProvider?: 'gemini' | 'openai';
    geminiApiKey?: string | null;
    openaiApiKey?: string | null;
    fingerprint?: import('@/features/voicekeeper/fingerprint').StyleProfile | null;
  }): Promise<{ success: boolean; aiProvider?: string; fingerprintUpdated?: boolean; apiKeysUpdated?: boolean }> => {
    return api.put(`/users/${userId}/settings`, data);
  },

  /**
   * Check if API key exists and get it
   * Uses Next.js API route: /api/users/[userId]/api-key
   */
  hasApiKey: (userId: string, provider: 'gemini' | 'openai'): Promise<{ hasKey: boolean; key: string | null }> => {
    return api.get(`/users/${userId}/api-key?provider=${provider}`);
  },

  /**
   * Delete user profile
   * Uses Next.js API route: /api/users/[userId]
   */
  delete: (userId: string): Promise<{ success: boolean; message: string; userId: string }> => {
    return api.delete(`/users/${userId}`);
  },
};

