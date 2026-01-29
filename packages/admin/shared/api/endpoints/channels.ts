/**
 * Channels API endpoints
 */

import { api } from '../client';
import type { ChannelInfoResponse } from '../types';

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

