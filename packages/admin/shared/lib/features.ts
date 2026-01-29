/**
 * Feature Flags System
 * 
 * Controls which features are enabled/disabled in the app.
 * Set NEXT_PUBLIC_DEMO_MODE=true for Vercel preview deployments.
 */

// PRODUCTION MODE - all features enabled
export const DEMO_MODE = false;

export const features = {
  // Core Features - All enabled
  auth: {
    enabled: true,
    telegramLogin: true,
    jwtAuth: true,
  },
  
  // Bot Management - All enabled
  bots: {
    enabled: true,
    canCreate: true,
    canDelete: true,
    canEditToken: true,
  },
  
  // Posts - All enabled
  posts: {
    enabled: true,
    canCreate: true,
    canPublish: true,
    canSchedule: true,
  },
  
  // VoiceKeeper AI - All enabled
  voiceKeeper: {
    enabled: true,
    canGenerate: true,
    canAnalyzeFingerprint: true,
    maxGenerationsDemo: 50,
  },
  
  // Trend Radar - All enabled
  trendRadar: {
    enabled: true,
    canScan: true,
    canAddCompetitors: true,
  },
  
  // Broadcasts - All enabled
  broadcasts: {
    enabled: true,
    canCreate: true,
    canSend: true,
  },
  
  // Subscriptions - All enabled
  subscriptions: {
    enabled: true,
    canPurchase: true,
  },
  
  // API Keys - All enabled
  apiKeys: {
    enabled: true,
    canSave: true,
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
export function useFeature<K extends keyof Features>(feature: K): Features[K] & { isDemoMode: boolean } {
  return {
    ...features[feature],
    isDemoMode: DEMO_MODE,
  };
}

