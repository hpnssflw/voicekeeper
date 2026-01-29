/**
 * Fingerprint feature types
 */

/**
 * Voice Fingerprint - формализованная модель авторского стиля
 * Структурированный профиль вместо текстового описания
 */
export interface StyleProfile {
  // Промпт для описания стиля (основной способ настройки)
  prompt?: string;              // Текстовое описание стиля пользователя
  
  // Уровень 2: Декомпозиция стиля (генерируется из промпта или заполняется вручную)
  tone?: {
    emotionality: number;      // 0.0 (сухой) ←→ 1.0 (эмоциональный)
    assertiveness: number;      // 0.0 (мягкий) ←→ 1.0 (уверенный)
    irony: number;              // 0.0 (нет) ←→ 1.0 (часто)
  };
  
  language?: {
    sentenceLength: "short" | "medium" | "long";
    slangLevel: number;         // 0.0 ←→ 1.0
    professionalLexicon: boolean;
    emojiFrequency: number;     // 0.0 ←→ 1.0
  };
  
  structure?: {
    hookType: "question" | "statement" | "provocation" | "mixed";
    paragraphLength: "1-2 sentences" | "3-4 sentences" | "5+ sentences";
    useLists: boolean;
    rhythm: "fast" | "medium" | "slow";
  };
  
  rhetoric?: {
    questionsPerPost: number;   // 0, 1-2, 3+
    metaphors: "frequent" | "rare" | "none";
    storytelling: boolean;
    ctaStyle: "soft" | "none" | "direct";
  };
  
  forbidden?: {
    phrases: string[];          // ["в наше время", "как известно"]
    tones: string[];            // ["mentoring", "academic"]
  };
  
  signature?: {
    typicalOpenings: string[];  // ["Вопрос", "Утверждение"]
    typicalClosings: string[];  // ["CTA", "Вопрос читателю"]
  };
  
  // Метаданные
  tags?: string[];              // Теги стиля (генерируются автоматически)
  summary?: string;             // Краткая выжимка стиля
  satisfaction?: "like" | "dislike" | null;  // Оценка пользователя
  
  // Legacy fields для обратной совместимости (опционально)
  tone_legacy?: string;
  structure_legacy?: string;
  vocabulary_legacy?: string;
  signature_legacy?: string;
  emoji_legacy?: string;
}

// Legacy profile type for migration
export interface LegacyProfile {
  tone: string;
  structure: string;
  vocabulary: string;
  signature: string;
  emoji: string;
}

