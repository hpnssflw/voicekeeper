# VoiceKeeper: Персональный AI-стратег для контента в Telegram

Монорепо для платформы управления контентом в Telegram с AI-генерацией постов.

## 📦 Структура монорепо

```
telegram-voronka/
├── packages/
│   ├── bot/         # Express API + Telegram Bot + Workers
│   └── admin/       # Next.js Admin Panel
├── infra/           # Docker конфигурации и скрипты
└── docs/            # Документация
```

## 🚀 Быстрый старт

### Локальная разработка

**Windows (PowerShell):**
```powershell
# Запуск инфраструктуры одной командой
.\scripts\dev-start.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/dev-start.sh
./scripts/dev-start.sh
```

**Ручной запуск:**
```bash
# Установка зависимостей
npm install

# Запуск инфраструктуры (MongoDB + Redis)
cd infra
docker compose up -d mongodb redis

# Запуск bot (терминал 1)
cd packages/bot
npm run dev

# Запуск admin (терминал 2)
cd packages/admin
npm run dev
```

📖 **Полное руководство:** [DEVELOPMENT.md](DEVELOPMENT.md)

### Docker (полный стек)

```bash
cd infra
docker compose up -d
```

## 📚 Документация

- **[🔥 Локальная разработка](DEVELOPMENT.md)** — полное руководство по запуску и тестированию
- **[Архитектура](docs/ARCHITECTURE.md)** — структура проекта и компоненты
- **[Техническая спецификация](docs/TECHNICAL_SPEC.md)** — полная спецификация системы
- **[VoiceKeeper Spec](docs/VOICEKEEPER_SPEC.md)** — спецификация AI-функционала
- **[Docker Guide](docs/DOCKER_GUIDE.md)** — запуск отдельных компонентов через Docker
- **[Деплой на Vercel](docs/DEPLOYMENT_VERCEL.md)** — деплой Next.js приложений на Vercel
- **[Деплой на VPS](docs/DEPLOYMENT_VPS.md)** — деплой на VPS через Docker
- **[Mobile-First Design](docs/MOBILE_FIRST.md)** — руководство по mobile-first подходу

## 🌐 Деплой

### Vercel (Frontend)

**Admin** деплоится на Vercel:

1. Создайте проект в Vercel
2. Укажите Root Directory: `packages/admin`
3. Настройте переменные окружения

Подробнее: [DEPLOYMENT_VERCEL.md](docs/DEPLOYMENT_VERCEL.md)

### VPS (Backend)

**Bot**, **MongoDB**, **Redis**, **Chromium** деплоятся на VPS через Docker:

```bash
cd infra
docker compose up -d
```

Подробнее: [DEPLOYMENT_VPS.md](docs/DEPLOYMENT_VPS.md)

### Гибридный деплой (Рекомендуется)

- **VPS:** Bot API, MongoDB, Redis, Chromium
- **Vercel:** Admin Panel

## 🛠️ Технологии

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** MongoDB (Mongoose), Redis (ioredis)
- **Queue:** BullMQ (Redis)
- **Telegram:** Telegraf (Bot API), gramjs (MTProto для парсинга)
- **AI:** Gemini / OpenAI GPT-4o
- **Infrastructure:** Docker, Docker Compose, Nginx

## 📱 Mobile-First

Проект использует mobile-first подход. Все компоненты адаптивны и оптимизированы для мобильных устройств.

Подробнее: [MOBILE_FIRST.md](docs/MOBILE_FIRST.md)

## 🔧 Разработка

### Структура пакетов

- `packages/bot/` — Express сервер, Telegram Bot, Workers
- `packages/admin/` — Next.js Admin Panel с полным функционалом

### Скрипты

```bash
# В корне монорепо
npm install          # Установка всех зависимостей

# В каждом пакете
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен версии
```

## 📖 Дополнительные ресурсы

- [Docker Quick Start](infra/DOCKER_QUICKSTART.md) — быстрая шпаргалка по Docker
- [Bot Structure](docs/BOT_STRUCTURE.md) — структура bot пакета
- [Deployment Guide](docs/DEPLOYMENT.md) — общий гайд по деплою

## 📝 Лицензия

Private project


