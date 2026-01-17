import { Schema, model } from 'mongoose';

/**
 * Model for channels being tracked/parsed
 */
const ParsedChannelSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
    
    // Channel info
    channelId: { type: Number, required: true }, // Telegram channel ID
    username: { type: String },
    title: { type: String },
    about: { type: String },
    participantsCount: { type: Number },
    
    // Tracking settings
    isActive: { type: Boolean, default: true },
    parseFrequency: { type: String, enum: ['hourly', 'daily', 'weekly'], default: 'daily' },
    lastParsedAt: { type: Date },
    lastParsedMessageId: { type: Number }, // For incremental parsing
    
    // Stats
    totalPostsParsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for owner + channel
ParsedChannelSchema.index({ ownerId: 1, channelId: 1 }, { unique: true });

export const ParsedChannelModel = model('parsed_channels', ParsedChannelSchema);

/**
 * Model for storing parsed posts from channels
 */
const ParsedPostSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
    channelId: { type: Number, required: true, index: true },
    
    // Telegram message data
    messageId: { type: Number, required: true },
    date: { type: Date, required: true },
    
    // Content
    text: { type: String },
    entities: { type: Schema.Types.Mixed }, // Formatting entities
    
    // Media
    hasMedia: { type: Boolean, default: false },
    mediaType: { type: String }, // 'photo', 'video', 'document', etc.
    mediaFileId: { type: String },
    
    // Engagement (if available)
    views: { type: Number },
    forwards: { type: Number },
    reactions: { type: Schema.Types.Mixed },
    
    // Analysis
    wordCount: { type: Number },
    hasLinks: { type: Boolean },
    hasHashtags: { type: Boolean },
    hashtags: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index for unique posts
ParsedPostSchema.index({ channelId: 1, messageId: 1 }, { unique: true });

export const ParsedPostModel = model('parsed_posts', ParsedPostSchema);

