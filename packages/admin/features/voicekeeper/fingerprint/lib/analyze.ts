/**
 * Fingerprint analysis logic
 * AI-assisted style analysis
 */

import { getApiKey } from '../api';
import type { StyleProfile } from '../model/types';

// Get available Gemini models
async function getAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (response.ok) {
      const data = await response.json();
      return (data.models || [])
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''));
    }
  } catch {
    // Fallback to default models if list fails
  }
  return ['gemma-3-1b-it', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
}

// Gemini API call
export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const models = await getAvailableModels(apiKey);
  
  if (!models.includes('gemma-3-1b-it')) {
    models.unshift('gemma-3-1b-it');
  }
  
  const apiVersions = ['v1beta', 'v1'];
  let lastError: Error | null = null;

  for (const version of apiVersions) {
    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          lastError = new Error(error.error?.message || "Gemini API error");
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) {
          return text;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
    }
  }

  throw lastError || new Error("Gemini API error: All models and versions failed. Please check your API key and available models.");
}

/**
 * Analyze text style and return StyleProfile
 */
export async function analyzeStyle(text: string, userId?: string | null): Promise<StyleProfile> {
  const apiKey = await getApiKey("gemini", userId);
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  const analysisPrompt = `Проанализируй стиль следующего текста по структурированным шкалам. 

Текст для анализа:
"""
${text}
"""

Верни ТОЛЬКО валидный JSON объект со следующей структурой:
{
  "tone": {
    "emotionality": 0.7,
    "assertiveness": 0.8,
    "irony": 0.4
  },
  "language": {
    "sentenceLength": "short | medium | long",
    "slangLevel": 0.6,
    "professionalLexicon": true,
    "emojiFrequency": 0.3
  },
  "structure": {
    "hookType": "question | statement | provocation | mixed",
    "paragraphLength": "1-2 sentences | 3-4 sentences | 5+ sentences",
    "useLists": true,
    "rhythm": "fast | medium | slow"
  },
  "rhetoric": {
    "questionsPerPost": 1,
    "metaphors": "frequent | rare | none",
    "storytelling": false,
    "ctaStyle": "soft | none | direct"
  },
  "forbidden": {
    "phrases": ["в наше время", "как известно"],
    "tones": ["mentoring", "academic"]
  },
  "signature": {
    "typicalOpenings": ["Вопрос", "Утверждение"],
    "typicalClosings": ["CTA", "Вопрос читателю"]
  }
}

Важно: Анализируй объективно, используй числа для шкал, строки для категорий.`;

  const result = await callGemini(analysisPrompt, apiKey);
  
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        tone: {
          emotionality: typeof parsed.tone?.emotionality === 'number' ? parsed.tone.emotionality : 0.5,
          assertiveness: typeof parsed.tone?.assertiveness === 'number' ? parsed.tone.assertiveness : 0.5,
          irony: typeof parsed.tone?.irony === 'number' ? parsed.tone.irony : 0.0,
        },
        language: {
          sentenceLength: ['short', 'medium', 'long'].includes(parsed.language?.sentenceLength) 
            ? parsed.language.sentenceLength 
            : 'medium',
          slangLevel: typeof parsed.language?.slangLevel === 'number' ? parsed.language.slangLevel : 0.3,
          professionalLexicon: parsed.language?.professionalLexicon === true,
          emojiFrequency: typeof parsed.language?.emojiFrequency === 'number' ? parsed.language.emojiFrequency : 0.2,
        },
        structure: {
          hookType: ['question', 'statement', 'provocation', 'mixed'].includes(parsed.structure?.hookType)
            ? parsed.structure.hookType
            : 'mixed',
          paragraphLength: ['1-2 sentences', '3-4 sentences', '5+ sentences'].includes(parsed.structure?.paragraphLength)
            ? parsed.structure.paragraphLength
            : '3-4 sentences',
          useLists: parsed.structure?.useLists === true,
          rhythm: ['fast', 'medium', 'slow'].includes(parsed.structure?.rhythm)
            ? parsed.structure.rhythm
            : 'medium',
        },
        rhetoric: {
          questionsPerPost: typeof parsed.rhetoric?.questionsPerPost === 'number' ? parsed.rhetoric.questionsPerPost : 1,
          metaphors: ['frequent', 'rare', 'none'].includes(parsed.rhetoric?.metaphors)
            ? parsed.rhetoric.metaphors
            : 'rare',
          storytelling: parsed.rhetoric?.storytelling === true,
          ctaStyle: ['soft', 'none', 'direct'].includes(parsed.rhetoric?.ctaStyle)
            ? parsed.rhetoric.ctaStyle
            : 'none',
        },
        forbidden: {
          phrases: Array.isArray(parsed.forbidden?.phrases) ? parsed.forbidden.phrases : [],
          tones: Array.isArray(parsed.forbidden?.tones) ? parsed.forbidden.tones : [],
        },
        signature: {
          typicalOpenings: Array.isArray(parsed.signature?.typicalOpenings) ? parsed.signature.typicalOpenings : [],
          typicalClosings: Array.isArray(parsed.signature?.typicalClosings) ? parsed.signature.typicalClosings : [],
        },
      };
    }
    throw new Error("No JSON found");
  } catch (error) {
    console.error("Error parsing fingerprint analysis:", error);
    return {
      tone: { emotionality: 0.5, assertiveness: 0.5, irony: 0.0 },
      language: { sentenceLength: 'medium', slangLevel: 0.3, professionalLexicon: true, emojiFrequency: 0.2 },
      structure: { hookType: 'mixed', paragraphLength: '3-4 sentences', useLists: false, rhythm: 'medium' },
      rhetoric: { questionsPerPost: 1, metaphors: 'rare', storytelling: false, ctaStyle: 'none' },
      forbidden: { phrases: [], tones: [] },
      signature: { typicalOpenings: [], typicalClosings: [] },
    };
  }
}

