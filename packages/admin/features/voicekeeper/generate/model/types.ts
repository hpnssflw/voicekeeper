/**
 * Generate feature types
 */

import type { StyleProfile } from '@/features/voicekeeper/fingerprint';

export interface GenerationParams {
  topic: string;
  tone: "friendly" | "professional" | "provocative" | "humorous" | "serious" | "casual";
  length: "short" | "medium" | "long";
  includeEmoji: boolean;
  includeCta: boolean;
  customInstructions?: string;
  fingerprint?: StyleProfile;
}

export interface GenerationResult {
  content: string;
  alternatives: string[];
  confidence: number;
}

