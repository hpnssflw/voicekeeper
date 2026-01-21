import { Schema, model, models, Types } from 'mongoose';

const MediaSchema = new Schema({
  type: { type: String },
  fileId: String,
  storageKey: String,
  caption: String,
  order: Number,
});

const ButtonSchema = new Schema({
  text: String,
  action: String,
  value: String,
  row: Number,
});

const PostSchema = new Schema(
  {
    botId: { type: Schema.Types.ObjectId, required: true, ref: 'bots' },
    // authorId is String to match auth system (same as Bot.ownerId)
    // This allows linking posts to users via userId string (e.g., "user-plzv92-gmail-com")
    authorId: { type: String, required: true },
    title: String,
    content: String,
    type: { type: String, default: 'text' },
    media: [MediaSchema],
    buttons: [ButtonSchema],
    status: { type: String, enum: ['draft', 'scheduled', 'published', 'archived'], default: 'draft' },
    publishTarget: { type: String, enum: ['channel', 'subscribers'], default: 'channel' },
    scheduledAt: Date,
    metrics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    deletedAt: Date,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Indexes for faster lookups
PostSchema.index({ botId: 1 });
PostSchema.index({ authorId: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ botId: 1, status: 1 });
PostSchema.index({ deletedAt: 1 });

// Prevent OverwriteModelError in Next.js hot-reload
// Force recreate model to ensure schema changes are applied
if (models.posts) {
  delete models.posts;
}
export const PostModel = model('posts', PostSchema);

