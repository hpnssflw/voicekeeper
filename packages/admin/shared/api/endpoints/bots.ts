/**
 * Bots API endpoints
 */

import { api } from '../client';
import type { BotResponse, BotsListResponse, ValidateBotResponse } from '../types';

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
   * Uses admin API (/api/bots) instead of bot API
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

