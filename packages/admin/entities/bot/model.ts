/**
 * Bot entity model
 * Re-exports MongoDB model and types
 */

export { BotModel } from '@/lib/db/models/Bot';

// Bot types from API
export type {
  BotResponse,
  BotsListResponse,
  ValidateBotResponse,
  TelegramBotInfo,
} from '../../shared/api/types';

