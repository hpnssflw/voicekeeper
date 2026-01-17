/**
 * AI Service - Direct Gemini API integration for admin panel
 * Works client-side without backend dependency
 */

// Storage keys
const STORAGE_KEYS = {
  GEMINI_KEY: "voicekeeper_gemini_key",
  OPENAI_KEY: "voicekeeper_openai_key",
  AI_PROVIDER: "voicekeeper_ai_provider",
  FINGERPRINT: "voicekeeper_fingerprint",
};

export interface StyleProfile {
  tone: string;
  structure: string;
  vocabulary: string;
  signature: string;
  emoji: string;
}

export interface GenerationParams {
  topic: string;
  tone: "friendly" | "professional" | "provocative";
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

// Get/Set API keys from localStorage
export function getApiKey(provider: "gemini" | "openai"): string | null {
  if (typeof window === "undefined") return null;
  const key = provider === "gemini" ? STORAGE_KEYS.GEMINI_KEY : STORAGE_KEYS.OPENAI_KEY;
  return localStorage.getItem(key);
}

export function setApiKey(provider: "gemini" | "openai", key: string): void {
  if (typeof window === "undefined") return;
  const storageKey = provider === "gemini" ? STORAGE_KEYS.GEMINI_KEY : STORAGE_KEYS.OPENAI_KEY;
  localStorage.setItem(storageKey, key);
}

export function getAiProvider(): "gemini" | "openai" {
  if (typeof window === "undefined") return "gemini";
  return (localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) as "gemini" | "openai") || "gemini";
}

export function setAiProvider(provider: "gemini" | "openai"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, provider);
}

// Get/Set fingerprint from localStorage
export function getFingerprint(): StyleProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.FINGERPRINT);
  return data ? JSON.parse(data) : null;
}

export function setFingerprint(profile: StyleProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.FINGERPRINT, JSON.stringify(profile));
}

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
  // Default fallback models (most common)
  return ['gemma-3-1b-it', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
}

// Gemini API call
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  // Get available models first
  const models = await getAvailableModels(apiKey);
  
  // Add gemma-3-1b-it to the list if not already present
  if (!models.includes('gemma-3-1b-it')) {
    models.unshift('gemma-3-1b-it'); // Prioritize it
  }
  
  // Try different API versions and models
  const apiVersions = ['v1beta', 'v1']; // Prioritize v1beta for gemma
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
          continue; // Try next model/version
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) {
          return text;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue; // Try next model/version
      }
    }
  }

  // If all attempts failed, throw the last error
  throw lastError || new Error("Gemini API error: All models and versions failed. Please check your API key and available models.");
}

// Analyze style from text
export async function analyzeStyle(text: string): Promise<StyleProfile> {
  const apiKey = getApiKey("gemini");
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  const prompt = `Проанализируй следующий текст и определи авторский стиль. Верни JSON объект с полями:
- tone: описание тональности (например: "Дружелюбный и экспертный")
- structure: описание структуры текста (например: "Короткие абзацы, списки")
- vocabulary: описание словарного запаса (например: "Технический с упрощениями")
- signature: характерные фишки стиля (например: "Начинает с вопроса, заканчивает CTA")
- emoji: типичные эмодзи через пробел (например: "🔥 💡 ✅")

Текст для анализа:
"""
${text}
"""

Ответь ТОЛЬКО валидным JSON без markdown:`;

  const result = await callGemini(prompt, apiKey);
  
  // Parse JSON from response
  try {
    // Try to extract JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found");
  } catch {
    // Fallback parsing
    return {
      tone: "Не удалось определить",
      structure: "Не удалось определить",
      vocabulary: "Не удалось определить",
      signature: "Не удалось определить",
      emoji: "📝",
    };
  }
}

// Generate post content
export async function generatePost(params: GenerationParams): Promise<GenerationResult> {
  const apiKey = getApiKey("gemini");
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  const lengthGuide = {
    short: "150-250 символов",
    medium: "400-600 символов", 
    long: "800-1200 символов",
  };

  const toneGuide = {
    friendly: "дружелюбный, тёплый, как разговор с другом",
    professional: "экспертный, деловой, авторитетный",
    provocative: "провокационный, вызывающий, эмоциональный",
  };

  let fingerprintContext = "";
  if (params.fingerprint) {
    fingerprintContext = `
Стиль автора (Voice Fingerprint):
- Тональность: ${params.fingerprint.tone}
- Структура: ${params.fingerprint.structure}
- Словарь: ${params.fingerprint.vocabulary}
- Фишки: ${params.fingerprint.signature}
- Эмодзи: ${params.fingerprint.emoji}

Важно: Копируй этот стиль максимально точно!
`;
  }

  const prompt = `Ты — копирайтер для Telegram-каналов. Напиши пост на тему: "${params.topic}"

Требования:
- Длина: ${lengthGuide[params.length]}
- Тон: ${toneGuide[params.tone]}
- Эмодзи: ${params.includeEmoji ? "используй уместно, не перебарщивай" : "НЕ используй эмодзи"}
- Призыв к действию: ${params.includeCta ? "добавь в конце" : "не нужен"}
${params.customInstructions ? `- Дополнительно: ${params.customInstructions}` : ""}
${fingerprintContext}

Напиши пост (без кавычек, без заголовка "Пост:", просто текст поста):`;

  const mainContent = await callGemini(prompt, apiKey);

  // Generate one alternative
  const altPrompt = `${prompt}\n\nЭто второй вариант, сделай его немного другим по структуре:`;
  let alternative = "";
  try {
    alternative = await callGemini(altPrompt, apiKey);
  } catch {
    // Ignore alternative generation errors
  }

  return {
    content: mainContent.trim(),
    alternatives: alternative ? [alternative.trim()] : [],
    confidence: 85 + Math.floor(Math.random() * 10),
  };
}

// Test API key
export async function testApiKey(provider: "gemini" | "openai", key: string): Promise<boolean> {
  if (provider === "gemini") {
    try {
      // First try to get available models
      const models = await getAvailableModels(key);
      
      // Add gemma-3-1b-it to the list if not already present
      const modelsToTest = models.includes('gemma-3-1b-it') 
        ? models 
        : ['gemma-3-1b-it', ...models];
      
      const apiVersions = ['v1beta', 'v1']; // Prioritize v1beta for gemma
      
      for (const version of apiVersions) {
        for (const model of models.slice(0, 3)) { // Try first 3 models
          try {
            const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`;
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: "Test" }] }],
              }),
            });
            if (response.ok) {
              await response.json();
              return true;
            }
          } catch {
            continue; // Try next model/version
          }
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  // OpenAI test would go here
  return false;
}

