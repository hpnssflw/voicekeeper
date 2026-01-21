import { Schema, model, models } from 'mongoose';

/**
 * Bot model for storing Telegram bots
 * Linked to user via userId (String, not ObjectId, to match auth system)
 */
const BotSchema = new Schema(
  {
    ownerId: { type: String, required: true }, // userId from auth system
    botUsername: { type: String, required: true },
    tokenHash: { type: String },
    tokenPlain: { type: String }, // MVP only; replace with encrypted storage later
    isActive: { type: Boolean, default: true },
    
    // Telegram bot info
    telegramId: { type: Number },
    firstName: { type: String },
    
    // Connected channel info
    channelId: { type: Schema.Types.Mixed }, // Can be number or string like @username
    channelUsername: { type: String },
    channelTitle: { type: String },
    
    // Stats (cached, updated periodically)
    subscriberCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for faster lookups
BotSchema.index({ ownerId: 1 });
BotSchema.index({ botUsername: 1 });
BotSchema.index({ ownerId: 1, botUsername: 1 }, { unique: true });

// Prevent OverwriteModelError in Next.js hot-reload
export const BotModel = models.bots || model('bots', BotSchema);

