/**
 * System prompt generation from StyleProfile
 */

import type { StyleProfile } from '../model/types';

/**
 * Генерирует system prompt из StyleProfile для использования в генерации постов
 */
export function generateSystemPrompt(profile: StyleProfile): string {
  const parts: string[] = [];
  
  // Основной промпт пользователя (если есть)
  if (profile.prompt) {
    parts.push(`Стиль автора:\n${profile.prompt}`);
  }
  
  // Детали тона
  if (profile.tone) {
    const toneParts: string[] = [];
    if (profile.tone.emotionality !== undefined) {
      const level = profile.tone.emotionality > 0.7 ? 'высокая' : profile.tone.emotionality > 0.4 ? 'умеренная' : 'низкая';
      toneParts.push(`Эмоциональность: ${level}`);
    }
    if (profile.tone.assertiveness !== undefined) {
      const level = profile.tone.assertiveness > 0.7 ? 'уверенный' : profile.tone.assertiveness > 0.4 ? 'сбалансированный' : 'мягкий';
      toneParts.push(`Тон: ${level}`);
    }
    if (profile.tone.irony !== undefined && profile.tone.irony > 0.3) {
      toneParts.push(`Используется ирония`);
    }
    if (toneParts.length > 0) {
      parts.push(`Тон: ${toneParts.join(', ')}`);
    }
  }
  
  // Язык
  if (profile.language) {
    const langParts: string[] = [];
    if (profile.language.sentenceLength) {
      const length = profile.language.sentenceLength === 'short' ? 'короткие' : profile.language.sentenceLength === 'long' ? 'длинные' : 'средние';
      langParts.push(`${length} предложения`);
    }
    if (profile.language.slangLevel !== undefined && profile.language.slangLevel > 0.4) {
      langParts.push(`используется сленг`);
    }
    if (profile.language.professionalLexicon) {
      langParts.push(`профессиональная лексика`);
    }
    if (profile.language.emojiFrequency !== undefined && profile.language.emojiFrequency > 0.3) {
      langParts.push(`используются эмодзи`);
    }
    if (langParts.length > 0) {
      parts.push(`Язык: ${langParts.join(', ')}`);
    }
  }
  
  // Структура
  if (profile.structure) {
    const structParts: string[] = [];
    if (profile.structure.hookType) {
      const hook = profile.structure.hookType === 'question' ? 'вопросы' : 
                   profile.structure.hookType === 'provocation' ? 'провокации' : 
                   profile.structure.hookType === 'statement' ? 'утверждения' : 'смешанные начала';
      structParts.push(`Начало: ${hook}`);
    }
    if (profile.structure.useLists) {
      structParts.push(`используются списки`);
    }
    if (profile.structure.rhythm) {
      const rhythm = profile.structure.rhythm === 'fast' ? 'быстрый' : 
                     profile.structure.rhythm === 'slow' ? 'размеренный' : 'умеренный';
      structParts.push(`ритм: ${rhythm}`);
    }
    if (structParts.length > 0) {
      parts.push(`Структура: ${structParts.join(', ')}`);
    }
  }
  
  // Риторика
  if (profile.rhetoric) {
    const rhetParts: string[] = [];
    if (profile.rhetoric.questionsPerPost !== undefined && profile.rhetoric.questionsPerPost > 0) {
      rhetParts.push(`${profile.rhetoric.questionsPerPost} вопросов на пост`);
    }
    if (profile.rhetoric.metaphors === 'frequent') {
      rhetParts.push(`часто используются метафоры`);
    }
    if (profile.rhetoric.storytelling) {
      rhetParts.push(`используются истории`);
    }
    if (profile.rhetoric.ctaStyle && profile.rhetoric.ctaStyle !== 'none') {
      const cta = profile.rhetoric.ctaStyle === 'direct' ? 'прямой' : 'мягкий';
      rhetParts.push(`${cta} призыв к действию`);
    }
    if (rhetParts.length > 0) {
      parts.push(`Риторика: ${rhetParts.join(', ')}`);
    }
  }
  
  // Запрещенные элементы
  if (profile.forbidden) {
    const forbiddenParts: string[] = [];
    if (profile.forbidden.phrases && profile.forbidden.phrases.length > 0) {
      forbiddenParts.push(`Избегать фраз: ${profile.forbidden.phrases.join(', ')}`);
    }
    if (profile.forbidden.tones && profile.forbidden.tones.length > 0) {
      forbiddenParts.push(`Избегать тонов: ${profile.forbidden.tones.join(', ')}`);
    }
    if (forbiddenParts.length > 0) {
      parts.push(`Запрещено: ${forbiddenParts.join('; ')}`);
    }
  }
  
  // Типичные начала и окончания
  if (profile.signature) {
    const sigParts: string[] = [];
    if (profile.signature.typicalOpenings && profile.signature.typicalOpenings.length > 0) {
      sigParts.push(`Типичные начала: ${profile.signature.typicalOpenings.join(', ')}`);
    }
    if (profile.signature.typicalClosings && profile.signature.typicalClosings.length > 0) {
      sigParts.push(`Типичные окончания: ${profile.signature.typicalClosings.join(', ')}`);
    }
    if (sigParts.length > 0) {
      parts.push(`Подпись: ${sigParts.join('; ')}`);
    }
  }
  
  return parts.join('\n\n');
}

