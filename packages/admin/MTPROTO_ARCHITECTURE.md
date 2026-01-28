# Архитектура MTProto в проекте

## Проблема

Next.js API routes работают в **serverless окружении**, где:
- Каждый запрос может обрабатываться в отдельном процессе/контейнере
- Соединения не сохраняются между запросами
- Невозможно поддерживать долгоживущие соединения для MTProto

## Решение

Использование **отдельного Node.js сервиса** (`packages/bot`) как постоянного процесса:

```
┌─────────────────┐         HTTP          ┌──────────────┐
│   Next.js       │  ───────────────────>  │  Bot Service │
│   (Admin)       │                        │  (Express)   │
│                 │  <───────────────────  │              │
│  API Routes     │      Response          │  MTProto     │
│  (Proxies)      │                        │  Service     │
└─────────────────┘                        └──────────────┘
     Port 3001                                  Port 4000
   (Serverless)                              (Long-running)
```

## Поток данных

1. **Пользователь** → Admin UI (`/dashboard/channels`)
2. **Admin UI** → Admin API (`/api/mtproto/auth/start`)
3. **Admin API** → Bot Service (`http://localhost:4000/api/mtproto/auth/start`)
4. **Bot Service** → Telegram MTProto API (долгоживущее соединение)
5. **Telegram** → Push уведомление в приложение Telegram
6. **Пользователь** вводит код → Admin API → Bot Service → Telegram

## Преимущества

✅ **Долгоживущие соединения** - Bot сервис поддерживает соединения между запросами
✅ **Коды приходят в Telegram** - соединение активно, код приходит как push-уведомление
✅ **Единая точка входа** - Admin API остается единым интерфейсом
✅ **Масштабируемость** - Bot сервис можно масштабировать отдельно

## Структура файлов

### Admin (`packages/admin/`)
- `app/api/mtproto/**/route.ts` - проксируют запросы к bot сервису
- `lib/api.ts` - API клиент (использует `/api/mtproto/*`)
- `app/(dashboard)/dashboard/channels/page.tsx` - UI для работы с каналами

### Bot (`packages/bot/`)
- `src/services/mtproto.service.ts` - реальная логика MTProto
- `src/routes/mtproto.routes.ts` - Express routes для MTProto
- `src/models/TelegramSession.ts` - модель сессий
- `src/models/ParsedChannel.ts` - модели каналов и постов

## Запуск

1. **Bot сервис** (обязательно первым):
   ```bash
   cd packages/bot
   npm run dev
   ```

2. **Admin**:
   ```bash
   cd packages/admin
   npm run dev
   ```

## Переменные окружения

### Bot сервис:
```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
MONGO_URI=mongodb://...
PORT=4000
```

### Admin:
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

## Важно

⚠️ **Bot сервис должен быть запущен** перед использованием MTProto функций в Admin
⚠️ **Соединения поддерживаются в Bot сервисе**, поэтому коды приходят в Telegram
⚠️ **Одна MongoDB база** используется обоими сервисами

