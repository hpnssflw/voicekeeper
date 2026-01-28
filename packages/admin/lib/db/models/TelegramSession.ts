import { Schema, model, models } from 'mongoose';

/**
 * Model for storing MTProto sessions
 * Each user can have one active session for parsing and posting
 */
const TelegramSessionSchema = new Schema(
  {
    ownerId: { type: String, required: true, unique: true, index: true },
    
    // Session string (encrypted in production)
    sessionString: { type: String, required: true },
    
    // User info from Telegram
    phoneNumber: { type: String },
    userId: { type: Number }, // Telegram user ID
    username: { type: String },
    firstName: { type: String },
    
    // Session status
    isActive: { type: Boolean, default: true },
    lastUsed: { type: Date },
    
    // For rate limiting
    requestsToday: { type: Number, default: 0 },
    lastRequestReset: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Проверка существования модели для избежания ошибки OverwriteModelError при hot-reload в Next.js
export const TelegramSessionModel = models.telegram_sessions || model('telegram_sessions', TelegramSessionSchema);

