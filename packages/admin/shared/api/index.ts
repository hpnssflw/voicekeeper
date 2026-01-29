/**
 * Shared API module
 * Exports all API clients and types
 */

export { api, ApiClient, API_BASE, getBotApiBase, type ApiResponse } from './client';
export * from './types';
export { botsApi } from './endpoints/bots';
export { channelsApi } from './endpoints/channels';
export { postsApi } from './endpoints/posts';
export { mtprotoApi } from './endpoints/mtproto';
export { usersApi, type UserSettingsResponse } from './endpoints/users';

