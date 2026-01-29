/**
 * Legacy profile migration
 */

import type { StyleProfile, LegacyProfile } from '../model/types';

// Default style profile structure
export const defaultStyleProfile: StyleProfile = {
  tone: { emotionality: 0.5, assertiveness: 0.5, irony: 0.0 },
  language: { sentenceLength: 'medium', slangLevel: 0.3, professionalLexicon: true, emojiFrequency: 0.2 },
  structure: { hookType: 'mixed', paragraphLength: '3-4 sentences', useLists: false, rhythm: 'medium' },
  rhetoric: { questionsPerPost: 1, metaphors: 'rare', storytelling: false, ctaStyle: 'none' },
  forbidden: { phrases: [], tones: [] },
  signature: { typicalOpenings: [], typicalClosings: [] },
};

// Проверка, является ли StyleProfile старым форматом (legacy)
export function isLegacyProfile(profile: any): profile is LegacyProfile {
  return typeof profile === 'object' && 
         typeof profile.tone === 'string' && 
         !profile.tone?.emotionality;
}

// Миграция legacy профиля в новую структуру (базовая)
export function migrateLegacyProfile(legacy: LegacyProfile): StyleProfile {
  return {
    ...defaultStyleProfile,
    tone_legacy: legacy.tone,
    structure_legacy: legacy.structure,
    vocabulary_legacy: legacy.vocabulary,
    signature_legacy: legacy.signature,
    emoji_legacy: legacy.emoji,
  };
}

