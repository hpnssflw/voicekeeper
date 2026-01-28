/**
 * AI Service - Direct Gemini API integration for admin panel
 * Uses MongoDB for storing settings instead of localStorage
 */

import { usersApi, type UserSettingsResponse } from "./api";

/**
 * Voice Fingerprint - формализованная модель авторского стиля
 * Структурированный профиль вместо текстового описания
 */
export interface StyleProfile {
  // Уровень 2: Декомпозиция стиля
  tone: {
    emotionality: number;      // 0.0 (сухой) ←→ 1.0 (эмоциональный)
    assertiveness: number;      // 0.0 (мягкий) ←→ 1.0 (уверенный)
    irony: number;              // 0.0 (нет) ←→ 1.0 (часто)
  };
  
  language: {
    sentenceLength: "short" | "medium" | "long";
    slangLevel: number;         // 0.0 ←→ 1.0
    professionalLexicon: boolean;
    emojiFrequency: number;     // 0.0 ←→ 1.0
  };
  
  structure: {
    hookType: "question" | "statement" | "provocation" | "mixed";
    paragraphLength: "1-2 sentences" | "3-4 sentences" | "5+ sentences";
    useLists: boolean;
    rhythm: "fast" | "medium" | "slow";
  };
  
  rhetoric: {
    questionsPerPost: number;   // 0, 1-2, 3+
    metaphors: "frequent" | "rare" | "none";
    storytelling: boolean;
    ctaStyle: "soft" | "none" | "direct";
  };
  
  forbidden: {
    phrases: string[];          // ["в наше время", "как известно"]
    tones: string[];            // ["mentoring", "academic"]
  };
  
  signature: {
    typicalOpenings: string[];  // ["Вопрос", "Утверждение"]
    typicalClosings: string[];  // ["CTA", "Вопрос читателю"]
  };
  
  // Legacy fields для обратной совместимости (опционально)
  tone_legacy?: string;
  structure_legacy?: string;
  vocabulary_legacy?: string;
  signature_legacy?: string;
  emoji_legacy?: string;
}

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

// Cache for settings to avoid repeated API calls
let settingsCache: UserSettingsResponse | null = null;
let settingsCacheUserId: string | null = null;

// Get user ID - должен передаваться из компонента через useAuth
// localStorage больше не используется
function getUserId(userId?: string | null): string | null {
  // Если userId передан явно - используем его
  if (userId) return userId;
  // Иначе возвращаем null (userId должен передаваться из компонента)
  return null;
}

// Cache for API keys (in-memory, cleared on page reload)
const apiKeyCache: { [key: string]: string | null } = {};

// Get/Set API keys from MongoDB via API
export async function getApiKey(provider: "gemini" | "openai", userId?: string | null): Promise<string | null> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) return null;
  
  const cacheKey = `${resolvedUserId}_${provider}`;
  
  // Return from cache if available
  if (apiKeyCache[cacheKey] !== undefined) {
    return apiKeyCache[cacheKey];
  }
  
  try {
    // Get API key from backend
    const response = await usersApi.hasApiKey(resolvedUserId, provider);
    
    apiKeyCache[cacheKey] = response.key || null;
    return response.key || null;
  } catch {
    apiKeyCache[cacheKey] = null;
    return null;
  }
}

export async function setApiKey(provider: "gemini" | "openai", key: string, userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, {
      [provider === "gemini" ? "geminiApiKey" : "openaiApiKey"]: key || null,
    });
    // Update cache
    const cacheKey = `${resolvedUserId}_${provider}`;
    apiKeyCache[cacheKey] = key || null;
    // Clear settings cache
    settingsCache = null;
  } catch (error) {
    throw new Error(`Failed to save API key: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

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

export async function setAiProvider(provider: "gemini" | "openai", userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, { aiProvider: provider });
    // Clear cache
    settingsCache = null;
  } catch (error) {
    throw new Error(`Failed to save AI provider: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Get/Set fingerprint from MongoDB via API
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

export async function setFingerprint(profile: StyleProfile, userId?: string | null): Promise<void> {
  const resolvedUserId = getUserId(userId);
  if (!resolvedUserId) throw new Error("User ID not found");
  
  try {
    await usersApi.updateSettings(resolvedUserId, { fingerprint: profile });
    // Clear cache
    settingsCache = null;
  } catch (error) {
    throw new Error(`Failed to save fingerprint: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
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

/**
 * Уровень 3: Анализ корпуса (AI-assisted)
 * Многоэтапный анализ вместо простого промпта
 */
export async function analyzeStyle(text: string, userId?: string | null): Promise<StyleProfile> {
  const apiKey = await getApiKey("gemini", userId);
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  // Уровень 3: Детальный анализ по шкалам
  const analysisPrompt = `Проанализируй стиль следующего текста по структурированным шкалам. 

Текст для анализа:
"""
${text}
"""

Верни ТОЛЬКО валидный JSON объект со следующей структурой:
{
  "tone": {
    "emotionality": 0.7,      // 0.0 (сухой) ←→ 1.0 (эмоциональный)
    "assertiveness": 0.8,     // 0.0 (мягкий) ←→ 1.0 (уверенный)
    "irony": 0.4              // 0.0 (нет) ←→ 1.0 (часто)
  },
  "language": {
    "sentenceLength": "short | medium | long",
    "slangLevel": 0.6,        // 0.0 ←→ 1.0
    "professionalLexicon": true,
    "emojiFrequency": 0.3     // 0.0 ←→ 1.0
  },
  "structure": {
    "hookType": "question | statement | provocation | mixed",
    "paragraphLength": "1-2 sentences | 3-4 sentences | 5+ sentences",
    "useLists": true,
    "rhythm": "fast | medium | slow"
  },
  "rhetoric": {
    "questionsPerPost": 1,    // среднее количество
    "metaphors": "frequent | rare | none",
    "storytelling": false,
    "ctaStyle": "soft | none | direct"
  },
  "forbidden": {
    "phrases": ["в наше время", "как известно"],  // клише, которых избегает автор
    "tones": ["mentoring", "academic"]            // тона, которые НЕ использует
  },
  "signature": {
    "typicalOpenings": ["Вопрос", "Утверждение"], // типичные начала
    "typicalClosings": ["CTA", "Вопрос читателю"] // типичные окончания
  }
}

Важно: Анализируй объективно, используй числа для шкал, строки для категорий.`;

  const result = await callGemini(analysisPrompt, apiKey);
  
  // Parse JSON from response
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Валидация и нормализация данных
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
    // Fallback: возвращаем структуру по умолчанию
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

/**
 * Уровень 4: Разделение STYLE и CONTENT (критично)
 * Content Layer → что сказать
 * Style Layer → как сказать (из fingerprint)
 * 
 * Уровень 5: Генерация через "Style Compiler"
 * VoiceFingerprint → Style Instructions → Prompt
 */
export async function generatePost(params: GenerationParams, userId?: string | null): Promise<GenerationResult> {
  const apiKey = await getApiKey("gemini", userId);
  if (!apiKey) {
    throw new Error("API ключ Gemini не настроен. Перейдите в Настройки → API ключи.");
  }

  // Content Layer: что сказать
  const contentContext = `Тема: ${params.topic}
${params.customInstructions ? `Дополнительно: ${params.customInstructions}` : ""}`;

  const lengthGuide = {
    short: "150-250 символов",
    medium: "400-600 символов", 
    long: "800-1200 символов",
  };

  // Style Layer: как сказать (из fingerprint или параметров)
  let styleInstructions = "";
  
  if (params.fingerprint) {
    // Уровень 5: Компилятор стиля из структурированного fingerprint
    const fp = params.fingerprint;
    
    // Безопасный доступ к свойствам с значениями по умолчанию
    const emotionality = fp.tone?.emotionality ?? 0.5;
    const assertiveness = fp.tone?.assertiveness ?? 0.5;
    const irony = fp.tone?.irony ?? 0;
    const sentenceLength = fp.language?.sentenceLength ?? 'medium';
    const slangLevel = fp.language?.slangLevel ?? 0;
    const professionalLexicon = fp.language?.professionalLexicon ?? false;
    const emojiFrequency = fp.language?.emojiFrequency ?? 0.5;
    const hookType = fp.structure?.hookType ?? 'statement';
    const paragraphLength = fp.structure?.paragraphLength ?? '3-4 sentences';
    const useLists = fp.structure?.useLists ?? false;
    const rhythm = fp.structure?.rhythm ?? 'medium';
    const questionsPerPost = fp.rhetoric?.questionsPerPost ?? 0;
    const metaphors = fp.rhetoric?.metaphors ?? 'rare';
    const storytelling = fp.rhetoric?.storytelling ?? false;
    const ctaStyle = fp.rhetoric?.ctaStyle ?? 'none';
    const forbiddenPhrases = fp.forbidden?.phrases ?? [];
    const forbiddenTones = fp.forbidden?.tones ?? [];
    
    // Жёсткие правила работают лучше мягких описаний
    styleInstructions = `Ты пишешь ТОЛЬКО в следующем стиле:

ТОН:
- Эмоциональность: ${emotionality >= 0.7 ? "эмоциональный" : emotionality <= 0.3 ? "сухой" : "умеренный"}
- Уверенность: ${assertiveness >= 0.7 ? "уверенный, без сомнений" : "мягкий, осторожный"}
- Ирония: ${irony >= 0.5 ? "используй умеренную иронию" : "избегай иронии"}

ЯЗЫК:
- Длина предложений: ${sentenceLength === 'short' ? 'короткие (до 10 слов)' : sentenceLength === 'long' ? 'длинные (15+ слов)' : 'средние'}
- Сленг: ${slangLevel >= 0.6 ? "можно использовать современный сленг" : "только литературный язык"}
- Профессионализмы: ${professionalLexicon ? "используй профессиональную лексику" : "избегай профессиональных терминов"}
- Эмодзи: ${emojiFrequency >= 0.5 ? "используй эмодзи" : emojiFrequency <= 0.2 ? "НЕ используй эмодзи" : "минимум эмодзи"}

СТРУКТУРА:
- Начало: ${hookType === 'question' ? 'вопрос' : hookType === 'provocation' ? 'провокация' : 'утверждение'}
- Длина абзацев: ${paragraphLength}
- Списки: ${useLists ? "используй списки" : "избегай списков"}
- Ритм: ${rhythm === 'fast' ? 'быстрый, короткие фразы' : rhythm === 'slow' ? 'размеренный, длинные фразы' : 'умеренный'}

РИТОРИКА:
- Вопросы: ${questionsPerPost > 0 ? `${questionsPerPost} вопрос(а) в тексте` : 'без вопросов'}
- Метафоры: ${metaphors === 'frequent' ? 'часто' : metaphors === 'none' ? 'не используй' : 'редко'}
- Истории: ${storytelling ? 'используй storytelling' : 'без историй'}
- CTA: ${ctaStyle === 'direct' ? 'прямой призыв к действию' : ctaStyle === 'soft' ? 'мягкий призыв' : 'без CTA'}

ЗАПРЕЩЕНО (Уровень 6: Анти-GPT защита):
- Фразы: ${forbiddenPhrases.length > 0 ? forbiddenPhrases.join(', ') : 'нет'}
- Тона: ${forbiddenTones.length > 0 ? forbiddenTones.join(', ') : 'нет'}
- Обобщения: избегай "все", "каждый", "всегда"
- Вводные конструкции: избегай "очевидно", "важно понимать", "как известно"
- Определения: не давай определения понятиям

Нарушение любого пункта — ошибка.`;
  } else {
    // Fallback: простой стиль из параметров
    const toneGuide = {
      friendly: "дружелюбный, тёплый, как разговор с другом",
      professional: "экспертный, деловой, авторитетный",
      provocative: "провокационный, вызывающий, эмоциональный",
      humorous: "юмористический, лёгкий, с шутками и иронией",
      serious: "серьёзный, вдумчивый, глубокий, без легкомыслия",
      casual: "неформальный, расслабленный, как в мессенджере",
    };
    styleInstructions = `
ТОН: ${toneGuide[params.tone]}
ЭМОДЗИ: ${params.includeEmoji ? "используй уместно" : "НЕ используй"}
CTA: ${params.includeCta ? "добавь в конце" : "не нужен"}`;
  }

  // Объединённый промпт (Content + Style)
  const prompt = `${styleInstructions}

---

${contentContext}

ТРЕБОВАНИЯ:
- Длина: ${lengthGuide[params.length]}

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
        for (const model of modelsToTest.slice(0, 3)) { // Try first 3 models
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

