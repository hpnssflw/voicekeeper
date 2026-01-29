/**
 * Fingerprint API methods
 * API key and fingerprint management
 */

import { usersApi } from '../../../../shared/api';
import type { StyleProfile } from '../model/types';

// Cache for API keys (in-memory, cleared on page reload)
const apiKeyCache: { [key: string]: string | null } = {};

// Get user ID helper
function getUserId(userId?: string | null): string | null {
  if (userId) return userId;
  return null;
}

/**
 * Get API key for a provider
 */
export async function getApiKey(provider: "gemini" | "openai", userId?: string | null): Promise<string | null> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) return null;
  
  const cacheKey = `${resolvedUserId}_${provider}`;
  
  if (apiKeyCache[cacheKey] !== undefined) {
    return apiKeyCache[cacheKey];
  }
  
  try {
    const response = await usersApi.hasApiKey(resolvedUserId, provider);
    apiKeyCache[cacheKey] = response.key || null;
    return response.key || null;
  } catch {
    apiKeyCache[cacheKey] = null;
    return null;
  }
}

/**
 * Set API key for a provider
 */
export async function setApiKey(provider: "gemini" | "openai", key: string, userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, {
      [provider === "gemini" ? "geminiApiKey" : "openaiApiKey"]: key || null,
    });
    const cacheKey = `${resolvedUserId}_${provider}`;
    apiKeyCache[cacheKey] = key || null;
  } catch (error) {
    throw new Error(`Failed to save API key: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get AI provider preference
 */
export async function getAiProvider(userId?: string | null): Promise<"gemini" | "openai"> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) return "gemini";
  
  try {
    const settings = await usersApi.getSettings(resolvedUserId);
    return settings.aiProvider || "gemini";
  } catch {
    return "gemini";
  }
}

/**
 * Set AI provider preference
 */
export async function setAiProvider(provider: "gemini" | "openai", userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, { aiProvider: provider });
  } catch (error) {
    throw new Error(`Failed to save AI provider: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get fingerprint from MongoDB
 */
export async function getFingerprint(userId?: string | null): Promise<StyleProfile | null> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) return null;
  
  try {
    const settings = await usersApi.getSettings(resolvedUserId);
    return settings.fingerprint || null;
  } catch {
    return null;
  }
}

/**
 * Set fingerprint to MongoDB
 */
export async function setFingerprint(profile: StyleProfile, userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, { fingerprint: profile });
  } catch (error) {
    throw new Error(`Failed to save fingerprint: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Test API key
 */
export async function testApiKey(provider: "gemini" | "openai", key: string): Promise<boolean> {
  if (provider === "gemini") {
    try {
      // Import analyze function to use callGemini
      const { callGemini } = await import('../lib/analyze');
      await callGemini("Test", key);
      return true;
    } catch {
      return false;
    }
  }
  // OpenAI test logic would go here
  return false;
}

