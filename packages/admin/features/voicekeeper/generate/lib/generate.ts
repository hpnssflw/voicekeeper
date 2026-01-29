/**
 * Post generation logic
 */

import { getApiKey, callGemini, generateSystemPrompt } from '@/features/voicekeeper/fingerprint';
import type { GenerationParams, GenerationResult } from '../model/types';

/**
 * Generate post using AI
 */
export async function generatePost(params: GenerationParams, userId?: string | null): Promise<GenerationResult> {
  const apiKey = await getApiKey("gemini", userId);
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  const systemPrompt = params.fingerprint ? generateSystemPrompt(params.fingerprint) : "";
  
  const prompt = `${systemPrompt ? `System: ${systemPrompt}\n\n` : ''}Создай пост на тему: ${params.topic}
Тон: ${params.tone}
Длина: ${params.length}
${params.includeEmoji ? 'Используй эмодзи' : 'Без эмодзи'}
${params.includeCta ? 'Добавь призыв к действию' : 'Без призыва к действию'}
${params.customInstructions ? `Дополнительные инструкции: ${params.customInstructions}` : ''}`;

  const result = await callGemini(prompt, apiKey);
  
  return {
    content: result,
    alternatives: [],
    confidence: 0.8,
  };
}

