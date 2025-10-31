import { model, Schema, Types } from 'mongoose';

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
    botId: { type: Types.ObjectId, required: true },
    authorId: { type: Types.ObjectId, required: true },
    title: String,
    content: String,
    type: String,
    media: [MediaSchema],
    buttons: [ButtonSchema],
    status: { type: String, default: 'draft' },
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

export const PostModel = model('posts', PostSchema);


