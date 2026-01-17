import { model, Schema, Types } from 'mongoose';

const BotSubscriberSchema = new Schema(
  {
    botId: { type: Types.ObjectId, required: true },
    userId: { type: Types.ObjectId },
    telegramId: { type: Number, required: true },
    status: { type: String, enum: ['active', 'blocked', 'left'], default: 'active' },
    tags: [String],
    joinedAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for unique botId + telegramId
BotSubscriberSchema.index({ botId: 1, telegramId: 1 }, { unique: true });
BotSubscriberSchema.index({ botId: 1, status: 1 });

export const BotSubscriberModel = model('bot_subscribers', BotSubscriberSchema);

