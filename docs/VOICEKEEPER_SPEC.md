# VoiceKeeper: Персональный AI-стратег для контента в Telegram

## Техническая спецификация для разработки

**Версия документа:** 1.0  
**Дата:** 17.01.2026  
**Статус:** В разработке

---

## 📋 Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Архитектура решения](#2-архитектура-решения)
3. [Модель данных](#3-модель-данных)
4. [API спецификация](#4-api-спецификация)
5. [AI-пайплайн](#5-ai-пайплайн)
6. [Очереди и воркеры](#6-очереди-и-воркеры)
7. [Frontend интеграция](#7-frontend-интеграция)
8. [План разработки](#8-план-разработки)
9. [Критерии приёмки](#9-критерии-приёмки)

---

## 1. Обзор проекта

### 1.1 Суть продукта

**VoiceKeeper** — AI-агент для авторов Telegram-каналов (5-100K подписчиков), который:
- Анализирует уникальный стиль автора (**Digital Voice Fingerprint**)
- Мониторит конкурентов и тренды в нише (**Trend Radar**)
- Генерирует посты на стыке тренда и авторского стиля (**Контекстная генерация**)

### 1.2 Целевая аудитория

- Авторы Telegram-каналов с 5K-100K подписчиков
- Контент-маркетологи и SMM-специалисты
- Предприниматели с экспертным контентом

### 1.3 Бизнес-модель

| Тариф | Цена/мес | Лимиты |
|-------|----------|--------|
| **Free** | 0 ₽ | 3 генерации/мес, базовый Voice Fingerprint |
| **Pro** | 750 ₽ | 50 генераций/мес, полный Voice Fingerprint |
| **Business** | 2500 ₽ | Безлимит, Trend Radar, API доступ |

### 1.4 Ключевые метрики успеха

- Time-to-content: сокращение на 60%
- Engagement rate: рост на 15% за месяц
- Retention (Pro+): >70% на 3-й месяц

---

## 2. Архитектура решения

### 2.1 Обновлённый стек

```
packages/
  bot/           # Express + Telegraf + BullMQ workers + REST API
  webapp/        # Next.js 16 Telegram Mini App (для пользователей)
  admin/         # NEW: Next.js 16 Admin Panel (для управления)
infra/
  docker-compose.yml
```

### 2.2 Разделение интерфейсов

| Компонент | Порт | Назначение |
|-----------|------|------------|
| **webapp** | 3000 | Telegram Mini App для авторов (VoiceKeeper UI) |
| **admin** | 3001 | Админ-панель для управления инфраструктурой |
| **bot** | 8080 | Backend API + Telegram webhook |
| **chromium** | 3333 | Browserless для парсинга каналов |

### 2.3 Admin Panel — Управление инфраструктурой

Отдельное Next.js приложение (`packages/admin`) для:

- **Управление ботами** — добавление/удаление Telegram-ботов, настройка токенов
- **API ключи** — Gemini/OpenAI API keys, выбор AI-провайдера
- **Каналы для парсинга** — управление конкурентами для Trend Radar
- **Мультибот** — поддержка нескольких ботов в одном аккаунте
- **Подписчики** — просмотр и экспорт аудитории
- **Рассылки** — массовые отправки сообщений
- **VoiceKeeper** — полный доступ к AI-функциям

**Страницы Admin Panel:**
```
/                      # Dashboard — сводка по всем ботам
/bots                  # Управление ботами (добавить токен, канал)
/posts                 # Все посты всех ботов
/broadcasts            # Рассылки
/subscribers           # Подписчики
/voicekeeper           # AI-стратег (dashboard)
/voicekeeper/generate  # Генерация постов
/voicekeeper/fingerprint # Настройка Voice Fingerprint
/trends                # Trend Radar (premium)
/settings              # Профиль, уведомления
/settings/api-keys     # API ключи (Gemini, OpenAI, Browserless)
```

### 2.4 Расширения Backend для VoiceKeeper

```
packages/bot/src/
  ai/                          # NEW: AI интеграции
    providers/
      gemini.provider.ts       # Gemini 1.5 Flash (MVP)
      openai.provider.ts       # GPT-4o (продакшен)
    services/
      voice-fingerprint.ts     # Анализ авторского стиля
      trend-radar.ts           # Мониторинг конкурентов
      content-generator.ts     # Генерация контента
    prompts/
      fingerprint.prompt.ts    # Промпты для анализа стиля
      generation.prompt.ts     # Промпты для генерации
      
  models/
    VoiceFingerprint.ts        # NEW: Профиль стиля автора
    Competitor.ts              # NEW: Конкуренты для мониторинга
    TrendSnapshot.ts           # NEW: Снимки трендов
    Generation.ts              # NEW: История генераций
    Subscription.ts            # NEW: Подписки пользователей

  workers/
    fingerprint.worker.ts      # NEW: Анализ стиля (async)
    trend-scan.worker.ts       # NEW: Сканирование конкурентов
    generation.worker.ts       # NEW: Генерация контента

  queues/
    fingerprint.queue.ts       # NEW
    trend.queue.ts             # NEW
    generation.queue.ts        # NEW
```

### 2.5 Инфраструктура (docker-compose.yml)

```yaml
version: '3.9'
services:
  mongodb:
    image: mongo:6.0
    ports: ["27017:27017"]
    volumes: [mongodb_data:/data/db]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  bot:
    build: ../packages/bot
    ports: ["8080:8080"]
    environment:
      - MONGO_URI=mongodb://mongodb:27017/app
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - BROWSERLESS_URL=ws://chromium:3000

  webapp:
    build: ../packages/webapp
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_BASE=http://bot:8080

  admin:                         # NEW
    build: ../packages/admin
    ports: ["3001:3001"]
    environment:
      - NEXT_PUBLIC_API_BASE=http://bot:8080

  chromium:                      # NEW - для парсинга каналов
    image: browserless/chrome:latest
    ports: ["3333:3000"]
    environment:
      - MAX_CONCURRENT_SESSIONS=5
      - TIMEOUT=60000

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
```

**Зачем Chromium:** Для парсинга публичных Telegram-каналов через `t.me/s/channel` (Server-side rendering для Trend Radar).

### 2.4 Переменные окружения (новые)

```env
# AI Providers
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key        # для продакшена
AI_PROVIDER=gemini                     # gemini | openai

# Trend Radar
BROWSERLESS_URL=ws://chromium:3000
TREND_SCAN_INTERVAL_HOURS=6

# Subscriptions
STRIPE_SECRET_KEY=sk_...               # или ЮKassa
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 3. Модель данных

### 3.1 VoiceFingerprint (Профиль стиля автора)

```typescript
// packages/bot/src/models/VoiceFingerprint.ts
import { model, Schema, Types } from 'mongoose';

const VoiceFingerprintSchema = new Schema({
  // Связи
  userId: { type: Types.ObjectId, ref: 'users', required: true },
  botId: { type: Types.ObjectId, ref: 'bots' }, // опционально
  
  // Источники анализа
  sources: [{
    type: { type: String, enum: ['channel', 'posts', 'manual'] },
    channelUsername: String,  // @channel_name
    postIds: [Types.ObjectId],
    sampleCount: Number,
    analyzedAt: Date,
  }],
  
  // NLP-характеристики стиля
  style: {
    // Структура
    avgParagraphLength: Number,      // средняя длина абзаца (слов)
    avgSentenceLength: Number,       // средняя длина предложения
    paragraphsPerPost: Number,       // абзацев на пост
    usesBulletPoints: Boolean,       // использует списки
    usesEmoji: Boolean,              // использует эмодзи
    emojiDensity: Number,            // эмодзи на 100 слов
    
    // Лексика
    vocabularyRichness: Number,      // уникальность словаря (0-1)
    formalityScore: Number,          // формальность (0-1)
    sentimentTone: String,           // positive/neutral/negative
    dominantTopics: [String],        // основные темы
    
    // Паттерны
    openingPatterns: [String],       // типичные начала постов
    closingPatterns: [String],       // типичные концовки
    ctaStyle: String,                // стиль call-to-action
    
    // Характерные элементы
    signaturePhrases: [String],      // фирменные фразы
    forbiddenPhrases: [String],      // избегаемые слова
    preferredHashtags: [String],
  },
  
  // Примеры постов (для контекста генерации)
  examplePosts: [{
    text: String,
    engagement: Number,              // 0-100 score
    topics: [String],
  }],
  
  // Метаданные
  version: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'analyzing', 'ready', 'failed'], default: 'pending' },
  lastAnalyzedAt: Date,
  confidence: Number,                // 0-100, насколько уверен в профиле
  
}, { timestamps: true });

VoiceFingerprintSchema.index({ userId: 1 });
VoiceFingerprintSchema.index({ status: 1 });

export const VoiceFingerprintModel = model('voice_fingerprints', VoiceFingerprintSchema);
```

### 3.2 Competitor (Конкуренты для мониторинга)

```typescript
// packages/bot/src/models/Competitor.ts
import { model, Schema, Types } from 'mongoose';

const CompetitorSchema = new Schema({
  // Владелец
  userId: { type: Types.ObjectId, ref: 'users', required: true },
  
  // Данные канала
  channelUsername: { type: String, required: true }, // @channel
  channelTitle: String,
  subscriberCount: Number,
  
  // Настройки мониторинга
  isActive: { type: Boolean, default: true },
  scanFrequency: { type: String, enum: ['hourly', '6h', 'daily'], default: '6h' },
  
  // Последнее сканирование
  lastScanAt: Date,
  lastPostId: String,                // ID последнего обработанного поста
  
  // Статистика
  totalPostsAnalyzed: { type: Number, default: 0 },
  avgEngagement: Number,
  
}, { timestamps: true });

CompetitorSchema.index({ userId: 1 });
CompetitorSchema.index({ isActive: 1, lastScanAt: 1 });

export const CompetitorModel = model('competitors', CompetitorSchema);
```

### 3.3 TrendSnapshot (Снимки трендов)

```typescript
// packages/bot/src/models/TrendSnapshot.ts
import { model, Schema, Types } from 'mongoose';

const TrendSnapshotSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'users', required: true },
  
  // Период снимка
  periodStart: Date,
  periodEnd: Date,
  
  // Горячие темы
  hotTopics: [{
    topic: String,
    score: Number,                   // 0-100, насколько горячая тема
    mentionCount: Number,
    avgEngagement: Number,
    examples: [{
      competitorId: Types.ObjectId,
      postPreview: String,
      engagement: Number,
    }],
    trend: String,                   // rising/stable/falling
  }],
  
  // Упущенные темы (у конкурентов есть, у автора нет)
  missedTopics: [{
    topic: String,
    competitorCount: Number,         // сколько конкурентов пишут
    lastMentioned: Date,
    potentialScore: Number,          // потенциал темы
  }],
  
  // Общая статистика
  competitorsAnalyzed: Number,
  postsAnalyzed: Number,
  
}, { timestamps: true });

TrendSnapshotSchema.index({ userId: 1, createdAt: -1 });

export const TrendSnapshotModel = model('trend_snapshots', TrendSnapshotSchema);
```

### 3.4 Generation (История генераций)

```typescript
// packages/bot/src/models/Generation.ts
import { model, Schema, Types } from 'mongoose';

const GenerationSchema = new Schema({
  // Связи
  userId: { type: Types.ObjectId, ref: 'users', required: true },
  botId: { type: Types.ObjectId, ref: 'bots' },
  fingerprintId: { type: Types.ObjectId, ref: 'voice_fingerprints' },
  
  // Входные параметры
  input: {
    topic: String,                   // тема для генерации
    trendId: String,                 // ID тренда (если из Trend Radar)
    tone: String,                    // желаемый тон
    length: String,                  // short/medium/long
    includeEmoji: Boolean,
    includeCta: Boolean,
    customInstructions: String,      // доп. инструкции от автора
  },
  
  // Результат
  output: {
    generatedText: String,
    alternativeVersions: [String],   // 2-3 варианта
    suggestedTitle: String,
    suggestedButtons: [{
      text: String,
      action: String,
    }],
    confidenceScore: Number,         // насколько AI уверен
  },
  
  // Метаданные
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  aiProvider: String,                // gemini/openai
  aiModel: String,                   // gemini-1.5-flash
  tokensUsed: Number,
  processingTimeMs: Number,
  error: String,
  
  // Обратная связь
  feedback: {
    rating: Number,                  // 1-5
    wasPublished: Boolean,
    publishedPostId: Types.ObjectId,
    userComment: String,
  },
  
}, { timestamps: true });

GenerationSchema.index({ userId: 1, createdAt: -1 });
GenerationSchema.index({ status: 1 });

export const GenerationModel = model('generations', GenerationSchema);
```

### 3.5 Subscription (Подписки)

```typescript
// packages/bot/src/models/Subscription.ts
import { model, Schema, Types } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'users', required: true, unique: true },
  
  // План
  plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
  
  // Платежи
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  
  // Периоды
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: Boolean,
  
  // Лимиты и использование
  limits: {
    generationsPerMonth: { type: Number, default: 3 },
    competitorsToTrack: { type: Number, default: 0 },
    trendRadarAccess: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
  },
  
  usage: {
    generationsThisMonth: { type: Number, default: 0 },
    lastResetAt: Date,
  },
  
  // История
  history: [{
    plan: String,
    startedAt: Date,
    endedAt: Date,
    reason: String,                  // upgrade/downgrade/cancel
  }],
  
}, { timestamps: true });

SubscriptionSchema.index({ userId: 1 }, { unique: true });
SubscriptionSchema.index({ plan: 1 });

export const SubscriptionModel = model('subscriptions', SubscriptionSchema);
```

### 3.6 Расширение модели User

```typescript
// Добавить в существующую модель users
{
  // ... existing fields ...
  
  // VoiceKeeper extensions
  voiceFingerprintId: { type: Types.ObjectId, ref: 'voice_fingerprints' },
  onboardingCompleted: { type: Boolean, default: false },
  preferences: {
    defaultTone: String,
    defaultLength: String,
    notifyOnTrends: { type: Boolean, default: true },
    language: { type: String, default: 'ru' },
  },
}
```

---

## 4. API спецификация

### 4.1 Voice Fingerprint API

```
POST   /api/fingerprint/analyze
GET    /api/fingerprint
PUT    /api/fingerprint
DELETE /api/fingerprint
```

#### POST /api/fingerprint/analyze
Запускает анализ стиля автора.

**Request:**
```json
{
  "sources": [
    { "type": "channel", "channelUsername": "@my_channel" },
    { "type": "posts", "postIds": ["id1", "id2"] }
  ]
}
```

**Response:**
```json
{
  "data": {
    "fingerprintId": "fp_abc123",
    "status": "analyzing",
    "estimatedTimeMinutes": 3
  }
}
```

#### GET /api/fingerprint
Получить текущий профиль стиля.

**Response:**
```json
{
  "data": {
    "id": "fp_abc123",
    "status": "ready",
    "confidence": 85,
    "style": {
      "avgParagraphLength": 45,
      "formalityScore": 0.3,
      "sentimentTone": "positive",
      "dominantTopics": ["маркетинг", "продуктивность"],
      "signaturePhrases": ["друзья", "на самом деле"],
      "emojiDensity": 2.5
    },
    "lastAnalyzedAt": "2026-01-17T10:00:00Z"
  }
}
```

### 4.2 Competitor & Trends API (Premium)

```
POST   /api/competitors
GET    /api/competitors
DELETE /api/competitors/:id
GET    /api/trends/latest
GET    /api/trends/history
POST   /api/trends/scan          # Принудительное сканирование
```

#### GET /api/trends/latest
Получить последний снимок трендов.

**Response:**
```json
{
  "data": {
    "periodStart": "2026-01-10T00:00:00Z",
    "periodEnd": "2026-01-17T00:00:00Z",
    "hotTopics": [
      {
        "topic": "AI-инструменты для бизнеса",
        "score": 92,
        "trend": "rising",
        "examples": [
          {
            "postPreview": "5 AI-инструментов, которые...",
            "engagement": 4500
          }
        ]
      }
    ],
    "missedTopics": [
      {
        "topic": "личный бренд в 2026",
        "competitorCount": 4,
        "potentialScore": 78
      }
    ]
  }
}
```

### 4.3 Generation API

```
POST   /api/generate
GET    /api/generations
GET    /api/generations/:id
POST   /api/generations/:id/feedback
POST   /api/generations/:id/publish
```

#### POST /api/generate
Создать новый пост.

**Request:**
```json
{
  "topic": "Как использовать ChatGPT для написания постов",
  "trendId": "trend_abc",        // опционально
  "tone": "friendly",            // friendly/professional/provocative
  "length": "medium",            // short/medium/long
  "includeEmoji": true,
  "includeCta": true,
  "customInstructions": "Добавь личную историю в начале"
}
```

**Response:**
```json
{
  "data": {
    "generationId": "gen_xyz789",
    "status": "processing",
    "estimatedTimeSeconds": 15
  }
}
```

#### GET /api/generations/:id

**Response (completed):**
```json
{
  "data": {
    "id": "gen_xyz789",
    "status": "completed",
    "output": {
      "generatedText": "Друзья, расскажу историю...",
      "alternativeVersions": [
        "Вы когда-нибудь задумывались...",
        "Сегодня я провёл эксперимент..."
      ],
      "suggestedTitle": "ChatGPT для контента",
      "suggestedButtons": [
        { "text": "Читать продолжение", "action": "url" }
      ],
      "confidenceScore": 88
    },
    "tokensUsed": 1250,
    "processingTimeMs": 4200
  }
}
```

#### POST /api/generations/:id/publish
Создать пост из генерации.

**Request:**
```json
{
  "versionIndex": 0,             // какую версию публиковать
  "scheduledAt": "2026-01-18T10:00:00Z",
  "publishTarget": "channel"
}
```

### 4.4 Subscription API

```
GET    /api/subscription
POST   /api/subscription/checkout
POST   /api/subscription/portal
POST   /api/subscription/webhook    # Stripe webhook
```

---

## 5. AI-пайплайн

### 5.1 Провайдер Gemini (MVP)

```typescript
// packages/bot/src/ai/providers/gemini.provider.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';

export class GeminiProvider {
  private client: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = this.client.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      }
    });
  }

  async generate(prompt: string): Promise<{ text: string; tokensUsed: number }> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    
    return {
      text: response.text(),
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
    };
  }

  async analyzeStyle(posts: string[]): Promise<StyleAnalysis> {
    const prompt = buildFingerprintPrompt(posts);
    const result = await this.generate(prompt);
    return parseStyleAnalysis(result.text);
  }
}
```

### 5.2 Сервис Voice Fingerprint

```typescript
// packages/bot/src/ai/services/voice-fingerprint.ts
import { GeminiProvider } from '../providers/gemini.provider';
import { FINGERPRINT_PROMPT } from '../prompts/fingerprint.prompt';

export class VoiceFingerprintService {
  private ai = new GeminiProvider();

  async analyzeFromPosts(posts: string[]): Promise<FingerprintResult> {
    // 1. Предобработка текстов
    const cleanedPosts = posts.map(p => this.cleanPost(p));
    
    // 2. Базовый NLP-анализ (без AI)
    const basicMetrics = this.calculateBasicMetrics(cleanedPosts);
    
    // 3. AI-анализ для сложных паттернов
    const prompt = FINGERPRINT_PROMPT
      .replace('{{POSTS}}', cleanedPosts.join('\n---\n'))
      .replace('{{BASIC_METRICS}}', JSON.stringify(basicMetrics));
    
    const aiResult = await this.ai.generate(prompt);
    const parsed = this.parseAIResponse(aiResult.text);
    
    return {
      ...basicMetrics,
      ...parsed,
      confidence: this.calculateConfidence(cleanedPosts.length, parsed),
    };
  }

  private calculateBasicMetrics(posts: string[]) {
    // Считаем метрики без AI
    return {
      avgParagraphLength: this.avgParagraphLength(posts),
      avgSentenceLength: this.avgSentenceLength(posts),
      usesBulletPoints: posts.some(p => /^[\-\•\*]\s/m.test(p)),
      usesEmoji: posts.some(p => /[\u{1F300}-\u{1F9FF}]/u.test(p)),
      emojiDensity: this.calculateEmojiDensity(posts),
      vocabularyRichness: this.calculateVocabularyRichness(posts),
    };
  }
}
```

### 5.3 Промпт для анализа стиля

```typescript
// packages/bot/src/ai/prompts/fingerprint.prompt.ts
export const FINGERPRINT_PROMPT = `
Ты — эксперт по NLP и анализу авторского стиля в социальных сетях.

Проанализируй следующие посты автора и создай Digital Voice Fingerprint — 
детальный профиль его уникального стиля письма.

=== ПОСТЫ АВТОРА ===
{{POSTS}}

=== БАЗОВЫЕ МЕТРИКИ (уже рассчитаны) ===
{{BASIC_METRICS}}

=== ЗАДАНИЕ ===
Определи и верни в формате JSON:

{
  "formalityScore": 0.0-1.0,        // 0=очень неформальный, 1=формальный
  "sentimentTone": "positive|neutral|negative|mixed",
  "dominantTopics": ["тема1", "тема2", "тема3"],
  "openingPatterns": ["паттерн1", "паттерн2"],
  "closingPatterns": ["паттерн1", "паттерн2"],
  "ctaStyle": "мягкий|прямой|отсутствует",
  "signaturePhrases": ["фраза1", "фраза2"],
  "forbiddenPhrases": ["слово1", "слово2"],
  "preferredHashtags": ["#тег1", "#тег2"],
  "writingPersonality": "краткое описание личности автора в 1-2 предложениях"
}

Отвечай ТОЛЬКО валидным JSON без markdown-обёртки.
`;
```

### 5.4 Промпт для генерации контента

```typescript
// packages/bot/src/ai/prompts/generation.prompt.ts
export const GENERATION_PROMPT = `
Ты — AI-помощник для создания контента в Telegram. Твоя задача — написать пост
В ТОЧНОМ СТИЛЕ автора, сохраняя его уникальный голос.

=== ПРОФИЛЬ СТИЛЯ АВТОРА (Digital Voice Fingerprint) ===
{{FINGERPRINT}}

=== ПРИМЕРЫ УСПЕШНЫХ ПОСТОВ АВТОРА ===
{{EXAMPLES}}

=== ПАРАМЕТРЫ ГЕНЕРАЦИИ ===
Тема: {{TOPIC}}
Тон: {{TONE}}
Длина: {{LENGTH}}
Включить эмодзи: {{INCLUDE_EMOJI}}
Включить CTA: {{INCLUDE_CTA}}
Дополнительные инструкции: {{CUSTOM_INSTRUCTIONS}}

=== КОНТЕКСТ ТРЕНДА (если есть) ===
{{TREND_CONTEXT}}

=== ЗАДАНИЕ ===
1. Напиши пост в стиле автора на заданную тему
2. Используй его типичные обороты и структуру
3. Сохраняй уровень формальности и тональность
4. НЕ КОПИРУЙ примеры, создай ОРИГИНАЛЬНЫЙ контент

Верни JSON:
{
  "mainVersion": "текст основной версии поста",
  "alternativeVersions": ["версия 2", "версия 3"],
  "suggestedTitle": "заголовок для редактора",
  "explanation": "почему этот пост соответствует стилю автора"
}
`;
```

### 5.5 Сервис парсинга Telegram-каналов

```typescript
// packages/bot/src/ai/services/channel-parser.ts
import puppeteer from 'puppeteer-core';
import { env } from '../../config/env';

export class ChannelParser {
  private browserWSEndpoint: string;

  constructor() {
    this.browserWSEndpoint = env.BROWSERLESS_URL;
  }

  async parseChannel(username: string, limit: number = 50): Promise<ChannelPost[]> {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.browserWSEndpoint,
    });

    try {
      const page = await browser.newPage();
      
      // Публичное превью канала
      await page.goto(`https://t.me/s/${username.replace('@', '')}`, {
        waitUntil: 'networkidle2',
      });

      // Скроллим для загрузки постов
      await this.autoScroll(page, limit);

      // Парсим посты
      const posts = await page.evaluate(() => {
        const messages = document.querySelectorAll('.tgme_widget_message');
        return Array.from(messages).map(msg => {
          const text = msg.querySelector('.tgme_widget_message_text')?.textContent || '';
          const views = msg.querySelector('.tgme_widget_message_views')?.textContent || '0';
          const date = msg.querySelector('.tgme_widget_message_date time')?.getAttribute('datetime');
          
          return {
            text: text.trim(),
            views: this.parseViews(views),
            date,
          };
        });
      });

      return posts.slice(0, limit);
    } finally {
      await browser.close();
    }
  }

  private async autoScroll(page: any, targetPosts: number) {
    // Скроллинг для подгрузки постов
    let previousHeight = 0;
    let scrollAttempts = 0;
    
    while (scrollAttempts < 20) {
      const postsCount = await page.evaluate(() => 
        document.querySelectorAll('.tgme_widget_message').length
      );
      
      if (postsCount >= targetPosts) break;
      
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(1000);
      
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) break;
      
      previousHeight = newHeight;
      scrollAttempts++;
    }
  }
}
```

---

## 6. Очереди и воркеры

### 6.1 Новые очереди

```typescript
// packages/bot/src/queues/index.ts - расширить
import { Queue } from 'bullmq';
import { redisConnection } from '../infra/redis';

// Existing
export const publishQueue = new Queue('publish', { connection: redisConnection });

// VoiceKeeper queues
export const fingerprintQueue = new Queue('fingerprint', { connection: redisConnection });
export const trendQueue = new Queue('trend-scan', { connection: redisConnection });
export const generationQueue = new Queue('generation', { connection: redisConnection });
```

### 6.2 Fingerprint Worker

```typescript
// packages/bot/src/workers/fingerprint.worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../infra/redis';
import { VoiceFingerprintService } from '../ai/services/voice-fingerprint';
import { VoiceFingerprintModel } from '../models/VoiceFingerprint';
import { ChannelParser } from '../ai/services/channel-parser';

interface FingerprintJob {
  fingerprintId: string;
  userId: string;
  sources: Array<{
    type: 'channel' | 'posts';
    channelUsername?: string;
    postIds?: string[];
  }>;
}

export const fingerprintWorker = new Worker<FingerprintJob>(
  'fingerprint',
  async (job: Job<FingerprintJob>) => {
    const { fingerprintId, sources } = job.data;
    
    console.log(`🔍 Processing fingerprint job: ${fingerprintId}`);
    
    await VoiceFingerprintModel.findByIdAndUpdate(fingerprintId, { status: 'analyzing' });
    
    try {
      // 1. Собираем тексты постов
      const posts: string[] = [];
      const channelParser = new ChannelParser();
      
      for (const source of sources) {
        if (source.type === 'channel' && source.channelUsername) {
          const channelPosts = await channelParser.parseChannel(source.channelUsername, 30);
          posts.push(...channelPosts.map(p => p.text).filter(t => t.length > 50));
        }
        // ... обработка других источников
      }
      
      if (posts.length < 5) {
        throw new Error('Недостаточно постов для анализа (минимум 5)');
      }
      
      // 2. Анализируем стиль
      const fingerprintService = new VoiceFingerprintService();
      const result = await fingerprintService.analyzeFromPosts(posts);
      
      // 3. Сохраняем результат
      await VoiceFingerprintModel.findByIdAndUpdate(fingerprintId, {
        style: result,
        examplePosts: posts.slice(0, 5).map(text => ({ text, topics: result.dominantTopics })),
        status: 'ready',
        confidence: result.confidence,
        lastAnalyzedAt: new Date(),
      });
      
      console.log(`✅ Fingerprint completed: ${fingerprintId}, confidence: ${result.confidence}`);
      
    } catch (error: any) {
      console.error(`❌ Fingerprint failed: ${fingerprintId}`, error.message);
      await VoiceFingerprintModel.findByIdAndUpdate(fingerprintId, { 
        status: 'failed',
        error: error.message,
      });
      throw error;
    }
  },
  { connection: redisConnection, concurrency: 2 }
);
```

### 6.3 Trend Scan Worker

```typescript
// packages/bot/src/workers/trend-scan.worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../infra/redis';
import { CompetitorModel } from '../models/Competitor';
import { TrendSnapshotModel } from '../models/TrendSnapshot';
import { ChannelParser } from '../ai/services/channel-parser';
import { GeminiProvider } from '../ai/providers/gemini.provider';

interface TrendScanJob {
  userId: string;
  competitorIds: string[];
}

export const trendScanWorker = new Worker<TrendScanJob>(
  'trend-scan',
  async (job: Job<TrendScanJob>) => {
    const { userId, competitorIds } = job.data;
    
    console.log(`📊 Starting trend scan for user: ${userId}`);
    
    const channelParser = new ChannelParser();
    const ai = new GeminiProvider();
    const allPosts: Array<{ competitor: string; text: string; views: number }> = [];
    
    // 1. Парсим посты конкурентов
    for (const competitorId of competitorIds) {
      const competitor = await CompetitorModel.findById(competitorId);
      if (!competitor) continue;
      
      try {
        const posts = await channelParser.parseChannel(competitor.channelUsername, 20);
        allPosts.push(...posts.map(p => ({
          competitor: competitor.channelUsername,
          text: p.text,
          views: p.views,
        })));
        
        await CompetitorModel.findByIdAndUpdate(competitorId, {
          lastScanAt: new Date(),
          totalPostsAnalyzed: competitor.totalPostsAnalyzed + posts.length,
        });
      } catch (err) {
        console.warn(`Failed to parse ${competitor.channelUsername}:`, err);
      }
    }
    
    // 2. AI-анализ трендов
    const trendAnalysis = await ai.generate(
      buildTrendAnalysisPrompt(allPosts)
    );
    
    const trends = parseTrendAnalysis(trendAnalysis.text);
    
    // 3. Сохраняем снимок
    await TrendSnapshotModel.create({
      userId,
      periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      hotTopics: trends.hotTopics,
      missedTopics: trends.missedTopics,
      competitorsAnalyzed: competitorIds.length,
      postsAnalyzed: allPosts.length,
    });
    
    console.log(`✅ Trend scan completed: ${trends.hotTopics.length} hot topics found`);
  },
  { connection: redisConnection, concurrency: 1 }
);
```

### 6.4 Generation Worker

```typescript
// packages/bot/src/workers/generation.worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../infra/redis';
import { GenerationModel } from '../models/Generation';
import { VoiceFingerprintModel } from '../models/VoiceFingerprint';
import { ContentGenerator } from '../ai/services/content-generator';

interface GenerationJob {
  generationId: string;
  userId: string;
  fingerprintId: string;
  input: {
    topic: string;
    tone: string;
    length: string;
    includeEmoji: boolean;
    includeCta: boolean;
    customInstructions?: string;
    trendContext?: string;
  };
}

export const generationWorker = new Worker<GenerationJob>(
  'generation',
  async (job: Job<GenerationJob>) => {
    const { generationId, fingerprintId, input } = job.data;
    const startTime = Date.now();
    
    console.log(`✍️ Generating content: ${generationId}`);
    
    await GenerationModel.findByIdAndUpdate(generationId, { status: 'processing' });
    
    try {
      // 1. Загружаем профиль стиля
      const fingerprint = await VoiceFingerprintModel.findById(fingerprintId);
      if (!fingerprint || fingerprint.status !== 'ready') {
        throw new Error('Voice fingerprint not ready');
      }
      
      // 2. Генерируем контент
      const generator = new ContentGenerator();
      const result = await generator.generate({
        fingerprint: fingerprint.style,
        examples: fingerprint.examplePosts,
        ...input,
      });
      
      const processingTimeMs = Date.now() - startTime;
      
      // 3. Сохраняем результат
      await GenerationModel.findByIdAndUpdate(generationId, {
        status: 'completed',
        output: {
          generatedText: result.mainVersion,
          alternativeVersions: result.alternativeVersions,
          suggestedTitle: result.suggestedTitle,
          confidenceScore: result.confidence,
        },
        tokensUsed: result.tokensUsed,
        processingTimeMs,
      });
      
      console.log(`✅ Generation completed: ${generationId}, ${processingTimeMs}ms`);
      
    } catch (error: any) {
      console.error(`❌ Generation failed: ${generationId}`, error.message);
      await GenerationModel.findByIdAndUpdate(generationId, {
        status: 'failed',
        error: error.message,
      });
      throw error;
    }
  },
  { connection: redisConnection, concurrency: 3 }
);
```

### 6.5 Запуск воркеров

```typescript
// packages/bot/src/workers/index.ts
export * from './publish.worker';
export * from './fingerprint.worker';
export * from './trend-scan.worker';
export * from './generation.worker';

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await fingerprintWorker.close();
  await trendScanWorker.close();
  await generationWorker.close();
  process.exit(0);
});
```

---

## 7. Frontend интеграция

### 7.1 Архитектура Frontend

Проект использует **два отдельных Next.js приложения**:

| Приложение | Порт | Целевая аудитория |
|------------|------|-------------------|
| `packages/webapp` | 3000 | Telegram Mini App (авторы контента) |
| `packages/admin` | 3001 | Веб-админка (администраторы) |

### 7.2 Admin Panel (packages/admin)

**Полноценная панель управления** с тёмной темой и современным UI.

```
packages/admin/
  app/
    page.tsx                   # Dashboard
    bots/page.tsx              # Управление ботами
    posts/page.tsx             # Все посты
    broadcasts/page.tsx        # Рассылки
    subscribers/page.tsx       # Подписчики
    voicekeeper/
      page.tsx                 # VoiceKeeper Dashboard
      generate/page.tsx        # AI-генерация
      fingerprint/page.tsx     # Настройка стиля
    trends/page.tsx            # Trend Radar
    settings/
      page.tsx                 # Общие настройки
      api-keys/page.tsx        # API ключи
  components/
    ui/                        # Базовые компоненты (Button, Card, Input...)
    layout/
      sidebar.tsx              # Боковое меню
      header.tsx               # Шапка с поиском
      bot-selector.tsx         # Переключатель ботов
```

**Ключевые особенности Admin Panel:**
- Тёмная тема по умолчанию
- Мультибот-селектор в хедере
- Полноценное управление API ключами
- VoiceKeeper с генерацией и Trend Radar

### 7.3 Telegram Mini App (packages/webapp)

Упрощённый интерфейс для быстрых действий внутри Telegram.

```
packages/webapp/app/(mini)/mini/
  page.tsx                     # Создание поста (существует)
  voicekeeper/
    page.tsx                   # Быстрая генерация
```

### 7.2 Основной дашборд VoiceKeeper

```tsx
// packages/webapp/app/(mini)/mini/voicekeeper/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function VoiceKeeperDashboard() {
  const [fingerprint, setFingerprint] = useState<Fingerprint | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fp, sub, gens] = await Promise.all([
      api.get('/api/fingerprint'),
      api.get('/api/subscription'),
      api.get('/api/generations?limit=5'),
    ]);
    setFingerprint(fp.data);
    setSubscription(sub.data);
    setRecentGenerations(gens.data);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Voice Fingerprint Status */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">🎭 Твой Digital Voice</h2>
        {fingerprint?.status === 'ready' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span>Профиль готов (уверенность: {fingerprint.confidence}%)</span>
            </div>
            <p className="text-sm text-gray-600">
              Тональность: {fingerprint.style.sentimentTone}, 
              Темы: {fingerprint.style.dominantTopics.join(', ')}
            </p>
            <Button variant="outline" size="sm">Обновить профиль</Button>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-2">Профиль не настроен</p>
            <Button href="/mini/voicekeeper/fingerprint">
              Настроить Voice Fingerprint
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Generate */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">✨ Быстрая генерация</h2>
        <QuickGenerateForm 
          disabled={fingerprint?.status !== 'ready'}
          remainingGenerations={subscription?.limits.generationsPerMonth - subscription?.usage.generationsThisMonth}
        />
      </Card>

      {/* Recent Generations */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">📝 Последние генерации</h2>
        <div className="space-y-2">
          {recentGenerations.map(gen => (
            <GenerationPreview key={gen.id} generation={gen} />
          ))}
        </div>
      </Card>

      {/* Trend Radar Teaser (if not premium) */}
      {!subscription?.limits.trendRadarAccess && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-lg font-semibold mb-2">📡 Trend Radar</h2>
          <p className="text-sm text-gray-600 mb-3">
            Отслеживай конкурентов и находи горячие темы в своей нише
          </p>
          <Button href="/mini/voicekeeper/subscription">
            Подключить Pro
          </Button>
        </Card>
      )}
    </div>
  );
}
```

### 7.3 Страница генерации

```tsx
// packages/webapp/app/(mini)/mini/voicekeeper/generate/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';

const generateSchema = z.object({
  topic: z.string().min(5, 'Тема слишком короткая').max(200),
  tone: z.enum(['friendly', 'professional', 'provocative']),
  length: z.enum(['short', 'medium', 'long']),
  includeEmoji: z.boolean(),
  includeCta: z.boolean(),
  customInstructions: z.string().max(500).optional(),
});

type GenerateForm = z.infer<typeof generateSchema>;

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const form = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      tone: 'friendly',
      length: 'medium',
      includeEmoji: true,
      includeCta: true,
    },
  });

  const onSubmit = async (data: GenerateForm) => {
    setIsGenerating(true);
    try {
      // 1. Запускаем генерацию
      const { data: { generationId } } = await api.post('/api/generate', data);
      
      // 2. Поллинг статуса
      let attempts = 0;
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 1000));
        const { data: gen } = await api.get(`/api/generations/${generationId}`);
        
        if (gen.status === 'completed') {
          setResult(gen);
          break;
        }
        if (gen.status === 'failed') {
          throw new Error(gen.error);
        }
        attempts++;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">✨ Создать пост</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Тема поста</label>
          <textarea
            {...form.register('topic')}
            placeholder="О чём хочешь написать?"
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тон</label>
            <select {...form.register('tone')} className="w-full p-2 border rounded">
              <option value="friendly">Дружелюбный</option>
              <option value="professional">Профессиональный</option>
              <option value="provocative">Провокационный</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Длина</label>
            <select {...form.register('length')} className="w-full p-2 border rounded">
              <option value="short">Короткий</option>
              <option value="medium">Средний</option>
              <option value="long">Длинный</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('includeEmoji')} />
            <span>Эмодзи</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('includeCta')} />
            <span>Призыв к действию</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дополнительно</label>
          <textarea
            {...form.register('customInstructions')}
            placeholder="Добавь личную историю, упомяни продукт..."
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {isGenerating ? '⏳ Генерируем...' : '✨ Создать пост'}
        </button>
      </form>

      {result && (
        <GenerationResult 
          result={result}
          onPublish={() => {/* publish logic */}}
        />
      )}
    </div>
  );
}
```

---

## 8. План разработки

### 8.1 Фаза 1: Core Infrastructure (1 неделя)

| # | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 1.1 | Модели данных (VoiceFingerprint, Generation, Subscription) | 🔴 High | 4h |
| 1.2 | Gemini Provider + базовые промпты | 🔴 High | 6h |
| 1.3 | Очереди fingerprint + generation | 🔴 High | 4h |
| 1.4 | API endpoints (fingerprint, generate) | 🔴 High | 6h |
| 1.5 | Базовый парсер каналов (без Browserless) | 🟡 Med | 4h |

**Deliverable:** Можно загрузить посты вручную → получить fingerprint → сгенерировать контент

### 8.2 Фаза 2: Mini App UI (1 неделя)

| # | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 2.1 | VoiceKeeper дашборд | 🔴 High | 4h |
| 2.2 | Страница настройки Fingerprint | 🔴 High | 6h |
| 2.3 | Страница генерации + результаты | 🔴 High | 6h |
| 2.4 | Интеграция с существующими постами | 🟡 Med | 4h |
| 2.5 | UI подписки (заглушка) | 🟡 Med | 2h |

**Deliverable:** Полный flow от анализа до публикации в Mini App

### 8.3 Фаза 3: Trend Radar (1 неделя)

| # | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 3.1 | Browserless setup в docker-compose | 🟡 Med | 2h |
| 3.2 | Модели Competitor + TrendSnapshot | 🟡 Med | 3h |
| 3.3 | Channel Parser (Puppeteer) | 🟡 Med | 6h |
| 3.4 | Trend Scan Worker | 🟡 Med | 6h |
| 3.5 | API + UI для Trend Radar | 🟡 Med | 6h |
| 3.6 | Cron job для автоматического сканирования | 🟢 Low | 2h |

**Deliverable:** Пользователь может добавить конкурентов и видеть тренды

### 8.4 Фаза 4: Subscriptions & Limits (0.5 недели)

| # | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 4.1 | Subscription модель + middleware | 🟡 Med | 4h |
| 4.2 | Stripe/ЮKassa интеграция | 🟡 Med | 6h |
| 4.3 | Лимиты генераций + paywall UI | 🟡 Med | 4h |

**Deliverable:** Монетизация работает

### 8.5 Фаза 5: Polish & Launch (0.5 недели)

| # | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 5.1 | Onboarding flow | 🟡 Med | 4h |
| 5.2 | Уведомления в Telegram | 🟢 Low | 3h |
| 5.3 | Аналитика использования | 🟢 Low | 3h |
| 5.4 | Тестирование E2E | 🔴 High | 6h |

---

## 9. Критерии приёмки

### 9.1 MVP (Фазы 1-2)

- [ ] Пользователь может загрузить 10+ постов для анализа стиля
- [ ] Voice Fingerprint генерируется за <3 минут
- [ ] Сгенерированный пост соответствует стилю автора (субъективно)
- [ ] Можно опубликовать сгенерированный пост в канал
- [ ] Free tier: 3 генерации/месяц работают

### 9.2 Full Product (Фазы 3-5)

- [ ] Trend Radar показывает релевантные темы из конкурентов
- [ ] Платная подписка работает (оплата → доступ)
- [ ] Лимиты корректно ограничивают бесплатных пользователей
- [ ] Уведомления о новых трендах приходят в Telegram
- [ ] Onboarding конвертирует >50% новых пользователей в настроенный профиль

---

## Приложения

### A. Зависимости (добавить в packages/bot/package.json)

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "puppeteer-core": "^23.0.0",
    "stripe": "^17.0.0"
  }
}
```

### B. Переменные окружения (.env.example)

```env
# AI
GEMINI_API_KEY=
AI_PROVIDER=gemini

# Trend Radar
BROWSERLESS_URL=ws://localhost:3333

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### C. Миграции

```javascript
// infra/scripts/migrate-voicekeeper.js
db.users.updateMany({}, { 
  $set: { 
    voiceFingerprintId: null, 
    onboardingCompleted: false 
  } 
});

db.subscriptions.createIndex({ userId: 1 }, { unique: true });
db.voice_fingerprints.createIndex({ userId: 1 });
db.generations.createIndex({ userId: 1, createdAt: -1 });
```

---

**Документ является источником истины для разработки VoiceKeeper.**  
Изменения вносятся через PR с обновлением этого файла.

