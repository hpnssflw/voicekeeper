import { Schema, model } from 'mongoose';

const BotSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    botUsername: { type: String, required: true, unique: true },
    tokenHash: { type: String },
    tokenPlain: { type: String }, // MVP only; replace with encrypted storage later
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BotModel = model('bots', BotSchema);


