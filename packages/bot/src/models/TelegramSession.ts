import { Schema, model } from 'mongoose';

/**
 * Model for storing MTProto sessions
 * Each user can have one active session for parsing
 */
const TelegramSessionSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, unique: true },
    
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

export const TelegramSessionModel = model('telegram_sessions', TelegramSessionSchema);

