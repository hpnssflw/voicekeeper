import { Schema, model } from 'mongoose';

const BotSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    botUsername: { type: String, required: true, unique: true },
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

export const BotModel = model('bots', BotSchema);
