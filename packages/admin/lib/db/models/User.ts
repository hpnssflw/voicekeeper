import { Schema, model, models } from 'mongoose';

/**
 * User model for storing user preferences and settings
 * Same schema as bot package for consistency
 */
const UserSchema = new Schema(
  {
    // User identification
    userId: { type: String, required: true },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    
    // AI Settings
    aiProvider: { type: String, enum: ['gemini', 'openai'], default: 'gemini' },
    geminiApiKey: { type: String },
    openaiApiKey: { type: String },
    
    // Voice Fingerprint (Уровень 2: Декомпозиция стиля)
    // Структурированный профиль вместо текстового описания
    fingerprint: {
      // Tone (тон)
      tone: {
        emotionality: { type: Number, min: 0, max: 1 },      // 0.0 (сухой) ←→ 1.0 (эмоциональный)
        assertiveness: { type: Number, min: 0, max: 1 },     // 0.0 (мягкий) ←→ 1.0 (уверенный)
        irony: { type: Number, min: 0, max: 1 },             // 0.0 (нет) ←→ 1.0 (часто)
      },
      
      // Language (язык)
      language: {
        sentenceLength: { type: String, enum: ['short', 'medium', 'long'] },
        slangLevel: { type: Number, min: 0, max: 1 },
        professionalLexicon: { type: Boolean },
        emojiFrequency: { type: Number, min: 0, max: 1 },
      },
      
      // Structure (структура)
      structure: {
        hookType: { type: String, enum: ['question', 'statement', 'provocation', 'mixed'] },
        paragraphLength: { type: String, enum: ['1-2 sentences', '3-4 sentences', '5+ sentences'] },
        useLists: { type: Boolean },
        rhythm: { type: String, enum: ['fast', 'medium', 'slow'] },
      },
      
      // Rhetoric (риторика)
      rhetoric: {
        questionsPerPost: { type: Number, min: 0 },
        metaphors: { type: String, enum: ['frequent', 'rare', 'none'] },
        storytelling: { type: Boolean },
        ctaStyle: { type: String, enum: ['soft', 'none', 'direct'] },
      },
      
      // Forbidden (анти-GPT защита)
      forbidden: {
        phrases: [{ type: String }],  // черный список клише
        tones: [{ type: String }],    // запрещенные тона
      },
      
      // Signature (фирменные фишки)
      signature: {
        typicalOpenings: [{ type: String }],
        typicalClosings: [{ type: String }],
      },
      
      // Legacy fields для обратной совместимости (опционально)
      tone_legacy: { type: String },
      structure_legacy: { type: String },
      vocabulary_legacy: { type: String },
      signature_legacy: { type: String },
      emoji_legacy: { type: String },
    },
    
    // Subscription and limits
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
    generationsUsed: { type: Number, default: 0 },
    generationsLimit: { type: Number, default: 3 },
    
    // Onboarding
    isOnboarded: { type: Boolean, default: false },
    
    // Settings
    language: { type: String, default: 'ru' },
    preferences: { type: Map, of: Schema.Types.Mixed, default: {} },
    
    // OAuth integration
    photoUrl: { type: String },
    provider: { type: String }, // 'google', 'yandex', 'telegram', etc.
  },
  { timestamps: true }
);

UserSchema.index({ userId: 1 });

// Проверка существования модели для избежания ошибки OverwriteModelError при hot-reload в Next.js
export const UserModel = models.users || model('users', UserSchema);

