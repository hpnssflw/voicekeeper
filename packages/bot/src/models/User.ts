import { Schema, model } from 'mongoose';

/**
 * User model for storing user preferences and settings
 * Includes API keys, fingerprint, and other user-specific data
 */
const UserSchema = new Schema(
  {
    // User identification
    userId: { type: String, required: true, unique: true }, // From auth system (Telegram ID or email)
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    
    // AI Settings
    aiProvider: { type: String, enum: ['gemini', 'openai'], default: 'gemini' },
    geminiApiKey: { type: String }, // Encrypted in production
    openaiApiKey: { type: String }, // Encrypted in production
    
    // Voice Fingerprint
    fingerprint: {
      tone: { type: String },
      structure: { type: String },
      vocabulary: { type: String },
      signature: { type: String },
      emoji: { type: String },
    },
    
    // Subscription and limits
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
    generationsUsed: { type: Number, default: 0 },
    generationsLimit: { type: Number, default: 3 }, // Based on plan
    
    // Onboarding
    isOnboarded: { type: Boolean, default: false },
    
    // Settings
    language: { type: String, default: 'ru' },
    preferences: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Index for faster lookups
UserSchema.index({ userId: 1 });

export const UserModel = model('users', UserSchema);

