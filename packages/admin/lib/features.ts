/**
 * Feature Flags System
 * 
 * Controls which features are enabled/disabled in the app.
 * Set NEXT_PUBLIC_DEMO_MODE=true for Vercel preview deployments.
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const features = {
  // Core Features
  auth: {
    enabled: !DEMO_MODE,
    telegramLogin: !DEMO_MODE,
    jwtAuth: !DEMO_MODE,
  },
  
  // Bot Management
  bots: {
    enabled: true, // UI always visible
    canCreate: !DEMO_MODE,
    canDelete: !DEMO_MODE,
    canEditToken: !DEMO_MODE,
  },
  
  // Posts
  posts: {
    enabled: true,
    canCreate: !DEMO_MODE,
    canPublish: !DEMO_MODE,
    canSchedule: !DEMO_MODE,
  },
  
  // VoiceKeeper AI
  voiceKeeper: {
    enabled: true,
    canGenerate: !DEMO_MODE,
    canAnalyzeFingerprint: !DEMO_MODE,
    maxGenerationsDemo: 0,
  },
  
  // Trend Radar
  trendRadar: {
    enabled: true,
    canScan: !DEMO_MODE,
    canAddCompetitors: !DEMO_MODE,
  },
  
  // Broadcasts
  broadcasts: {
    enabled: true,
    canCreate: !DEMO_MODE,
    canSend: !DEMO_MODE,
  },
  
  // Subscriptions
  subscriptions: {
    enabled: !DEMO_MODE,
    canPurchase: !DEMO_MODE,
  },
  
  // API Keys
  apiKeys: {
    enabled: true,
    canSave: !DEMO_MODE,
  },
} as const;

export type Features = typeof features;

/**
 * Check if a feature action is available
 */
export function isFeatureEnabled(
  feature: keyof Features,
  action?: string
): boolean {
  const featureConfig = features[feature];
  
  if (!featureConfig.enabled) {
    return false;
  }
  
  if (action && action in featureConfig) {
    return (featureConfig as Record<string, boolean>)[action] ?? false;
  }
  
  return featureConfig.enabled;
}

/**
 * Hook-friendly feature check (for use in components)
 */
export function useFeature(feature: keyof Features) {
  return {
    ...features[feature],
    isDemoMode: DEMO_MODE,
  };
}

