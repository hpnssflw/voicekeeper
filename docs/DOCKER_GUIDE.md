# Docker Guide: Запуск отдельных компонентов

Данное руководство описывает, как запускать отдельные компоненты системы через Docker Compose для разработки, тестирования и продакшена.

## 📋 Содержание

- [Архитектура сервисов](#архитектура-сервисов)
- [Быстрый старт](#быстрый-старт)
- [Запуск отдельных сервисов](#запуск-отдельных-сервисов)
- [Комбинации сервисов](#комбинации-сервисов)
- [Переменные окружения](#переменные-окружения)
- [Полезные команды](#полезные-команды)
- [Troubleshooting](#troubleshooting)

---

## Архитектура сервисов

Система состоит из следующих Docker-сервисов:

| Сервис | Описание | Порт | Зависимости |
|--------|----------|------|-------------|
| `mongodb` | База данных MongoDB | 27017 | - |
| `redis` | Кэш и очереди (Bull) | 6379 | - |
| `bot` | Express API + Telegram Bot + Workers | 8080 | mongodb, redis |
| `webapp` | Next.js Mini App (Telegram) | 3000 | bot |
| `admin` | Next.js Admin Panel | 3001 | bot |
| `chromium` | Browserless для парсинга | 3333 | - |
| `nginx` | Reverse proxy | 80, 443 | webapp, admin, bot |

---

## Быстрый старт

### Полный запуск всех сервисов

```bash
cd infra
docker compose up -d
```

### Альтернативные конфигурации

В директории `infra/` доступны дополнительные compose-файлы для разных сценариев:

**Минимальная конфигурация (только инфраструктура):**
```bash
docker compose -f docker-compose.minimal.yml up -d
```

**Backend только (MongoDB + Redis + Bot + Chromium):**
```bash
docker compose -f docker-compose.backend.yml up -d
```

**Development режим (с hot-reload):**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Остановка всех сервисов

```bash
cd infra
docker compose down
```

### Остановка с удалением volumes (⚠️ удалит данные)

```bash
cd infra
docker compose down -v
```

---

## Запуск отдельных сервисов

### 1. MongoDB (база данных)

**Запуск:**
```bash
cd infra
docker compose up -d mongodb
```

**Проверка:**
```bash
docker compose ps mongodb
docker compose logs mongodb
```

**Подключение:**
```bash
# Через MongoDB CLI
docker compose exec mongodb mongosh

# Или через внешний клиент
mongodb://localhost:27017
```

**Переменные окружения:**
- Данные сохраняются в volume `mongodb_data`
- Порт: `27017`

**Остановка:**
```bash
docker compose stop mongodb
```

---

### 2. Redis (кэш и очереди)

**Запуск:**
```bash
cd infra
docker compose up -d redis
```

**Проверка:**
```bash
docker compose ps redis
docker compose logs redis
```

**Подключение:**
```bash
# Через Redis CLI
docker compose exec redis redis-cli

# Проверка подключения
docker compose exec redis redis-cli ping
# Должно вернуть: PONG
```

**Переменные окружения:**
- Порт: `6379`
- URL: `redis://localhost:6379`

**Остановка:**
```bash
docker compose stop redis
```

---

### 3. Bot (API + Telegram Bot + Workers)

**Запуск:**
```bash
cd infra
docker compose up -d bot
```

**Требуемые зависимости:**
- `mongodb` (должен быть запущен)
- `redis` (должен быть запущен)

**Проверка:**
```bash
docker compose ps bot
docker compose logs -f bot

# Проверка API
curl http://localhost:8080/health
```

**Переменные окружения (`.env` в `infra/`):**
```env
# Обязательные
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379
TELEGRAM_BOT_TOKEN=your_bot_token

# AI (один из)
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=gemini  # или openai

# Опциональные
PORT=8080
WEBAPP_URL=http://localhost:3000
BROWSERLESS_URL=ws://chromium:3000
```

**Пересборка после изменений:**
```bash
cd infra
docker compose build bot
docker compose up -d bot
```

**Остановка:**
```bash
docker compose stop bot
```

---

### 4. Webapp (Next.js Mini App для Telegram)

**Запуск:**
```bash
cd infra
docker compose up -d webapp
```

**Проверка:**
```bash
docker compose ps webapp
docker compose logs -f webapp

# Откройте в браузере
open http://localhost:3000
```

**Переменные окружения:**
```env
NEXT_PUBLIC_API_BASE=http://bot:8080
```

**Пересборка:**
```bash
cd infra
docker compose build webapp
docker compose up -d webapp
```

**Остановка:**
```bash
docker compose stop webapp
```

---

### 5. Admin (Next.js Admin Panel)

**Запуск:**
```bash
cd infra
docker compose up -d admin
```

**Проверка:**
```bash
docker compose ps admin
docker compose logs -f admin

# Откройте в браузере
open http://localhost:3001
```

**Переменные окружения:**
```env
NEXT_PUBLIC_API_BASE=http://bot:8080
NEXT_PUBLIC_DEMO_MODE=false  # true для демо-режима
```

**Пересборка:**
```bash
cd infra
docker compose build admin
docker compose up -d admin
```

**Остановка:**
```bash
docker compose stop admin
```

---

### 6. Chromium (Browserless для парсинга)

**Запуск:**
```bash
cd infra
docker compose up -d chromium
```

**Проверка:**
```bash
docker compose ps chromium
docker compose logs chromium

# Проверка WebSocket
curl http://localhost:3333
```

**Переменные окружения:**
```env
MAX_CONCURRENT_SESSIONS=5
TIMEOUT=60000
CONNECTION_TIMEOUT=60000
```

**Использование:**
- WebSocket URL: `ws://localhost:3333`
- Используется для парсинга публичных Telegram-каналов (Trend Radar)

**Остановка:**
```bash
docker compose stop chromium
```

---

### 7. Nginx (Reverse Proxy)

**Запуск:**
```bash
cd infra
docker compose up -d nginx
```

**Требуемые зависимости:**
- `webapp` (должен быть запущен)
- `admin` (должен быть запущен)
- `bot` (должен быть запущен)

**Проверка:**
```bash
docker compose ps nginx
docker compose logs -f nginx

# Проверка конфигурации
docker compose exec nginx nginx -t
```

**Конфигурация:**
- Файлы конфигурации: `infra/nginx/*.conf`
- Порт HTTP: `80`
- Порт HTTPS: `443`

**Перезагрузка конфигурации:**
```bash
docker compose exec nginx nginx -s reload
```

**Остановка:**
```bash
docker compose stop nginx
```

---

## Комбинации сервисов

### Минимальная конфигурация (только инфраструктура)

```bash
cd infra
docker compose up -d mongodb redis
```

Используйте для локальной разработки, когда запускаете `bot`, `webapp`, `admin` локально (не в Docker).

---

### Backend только (API + инфраструктура)

```bash
cd infra
docker compose up -d mongodb redis bot
```

Доступ:
- API: `http://localhost:8080`
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`

---

### Frontend только (Webapp + Admin + Bot)

```bash
cd infra
docker compose up -d mongodb redis bot webapp admin
```

Доступ:
- Webapp: `http://localhost:3000`
- Admin: `http://localhost:3001`
- API: `http://localhost:8080`

---

### Полная конфигурация (все сервисы)

```bash
cd infra
docker compose up -d
```

Включает все сервисы, включая `chromium` и `nginx`.

---

### Production-like (без nginx, для разработки)

```bash
cd infra
docker compose up -d mongodb redis bot webapp admin chromium
```

---

## Переменные окружения

### Создание `.env` файла

```bash
cd infra
cp .env.example .env
```

### Основные переменные

**Обязательные для Bot:**
```env
# Database
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id

# AI (выберите один провайдер)
GEMINI_API_KEY=your_gemini_key
# ИЛИ
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=gemini  # или openai

# URLs
WEBAPP_URL=http://localhost:3000
BROWSERLESS_URL=ws://chromium:3000
```

**Для Admin:**
```env
NEXT_PUBLIC_API_BASE=http://bot:8080
NEXT_PUBLIC_DEMO_MODE=false
```

**Для Webapp:**
```env
NEXT_PUBLIC_API_BASE=http://bot:8080
```

---

## Полезные команды

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f bot
docker compose logs -f webapp
docker compose logs -f admin

# Последние 100 строк
docker compose logs --tail=100 bot
```

### Перезапуск сервиса

```bash
docker compose restart bot
docker compose restart webapp
```

### Пересборка и перезапуск

```bash
# Пересобрать образ
docker compose build bot

# Пересобрать и перезапустить
docker compose up -d --build bot
```

### Очистка

```bash
# Остановить и удалить контейнеры
docker compose down

# Удалить контейнеры и volumes (⚠️ удалит данные)
docker compose down -v

# Удалить неиспользуемые образы
docker image prune -a

# Удалить все неиспользуемые ресурсы
docker system prune -a --volumes
```

### Проверка статуса

```bash
# Список всех контейнеров
docker compose ps

# Детальная информация
docker compose ps -a

# Использование ресурсов
docker stats
```

### Выполнение команд внутри контейнера

```bash
# MongoDB shell
docker compose exec mongodb mongosh

# Redis CLI
docker compose exec redis redis-cli

# Node.js shell в bot
docker compose exec bot sh

# Bash в admin
docker compose exec admin sh
```

### Просмотр переменных окружения

```bash
docker compose exec bot env
```

---

## Troubleshooting

### Проблема: Сервис не запускается

**Решение:**
1. Проверьте логи: `docker compose logs <service>`
2. Убедитесь, что зависимости запущены
3. Проверьте переменные окружения в `.env`

**Пример:**
```bash
# Bot не может подключиться к MongoDB
docker compose logs bot | grep -i mongo

# Проверьте, запущен ли MongoDB
docker compose ps mongodb
```

---

### Проблема: Порт уже занят

**Решение:**
1. Найдите процесс, использующий порт:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Linux/Mac
   lsof -i :8080
   ```

2. Измените порт в `docker-compose.yml`:
   ```yaml
   ports:
     - "8081:8080"  # Внешний:Внутренний
   ```

---

### Проблема: Изменения в коде не применяются

**Решение:**
1. Пересоберите образ:
   ```bash
   docker compose build <service>
   docker compose up -d <service>
   ```

2. Для разработки используйте volume mounts (см. раздел "Разработка с hot-reload")

---

### Проблема: MongoDB данные потеряны

**Решение:**
1. Проверьте, что volume существует:
   ```bash
   docker volume ls | grep mongodb
   ```

2. Восстановите из backup (если есть):
   ```bash
   docker compose exec mongodb mongorestore --archive < backup.gz
   ```

---

### Проблема: Redis очередь не работает

**Решение:**
1. Проверьте подключение:
   ```bash
   docker compose exec redis redis-cli ping
   ```

2. Проверьте URL в `.env`:
   ```env
   REDIS_URL=redis://redis:6379
   ```

3. Очистите очередь (если нужно):
   ```bash
   docker compose exec redis redis-cli FLUSHALL
   ```

---

### Разработка с hot-reload

Для разработки с автоматической перезагрузкой используйте локальный запуск вместо Docker:

**Backend (bot):**
```bash
cd packages/bot
npm run dev
```

**Frontend (webapp/admin):**
```bash
cd packages/webapp  # или packages/admin
npm run dev
```

**Инфраструктура в Docker:**
```bash
cd infra
docker compose up -d mongodb redis chromium
```

---

### Просмотр использования ресурсов

```bash
# В реальном времени
docker stats

# Конкретный контейнер
docker stats bot
```

---

### Backup и Restore

**MongoDB Backup:**
```bash
docker compose exec mongodb mongodump --archive > backup.gz
```

**MongoDB Restore:**
```bash
docker compose exec -T mongodb mongorestore --archive < backup.gz
```

**Redis Backup:**
```bash
docker compose exec redis redis-cli SAVE
docker compose cp redis:/data/dump.rdb ./redis-backup.rdb
```

---

## Примеры сценариев

### Сценарий 1: Локальная разработка Backend

```bash
# Запустить только инфраструктуру
cd infra
docker compose up -d mongodb redis

# Запустить bot локально
cd ../packages/bot
npm run dev
```

---

### Сценарий 2: Тестирование Frontend

```bash
# Запустить backend в Docker
cd infra
docker compose up -d mongodb redis bot

# Запустить frontend локально
cd ../packages/admin
npm run dev
```

---

### Сценарий 3: Production-like окружение

```bash
# Запустить все сервисы
cd infra
docker compose up -d

# Проверить статус
docker compose ps

# Проверить логи
docker compose logs -f
```

---

### Сценарий 4: Отладка конкретного сервиса

```bash
# Запустить только нужные зависимости
cd infra
docker compose up -d mongodb redis

# Запустить сервис в foreground для просмотра логов
docker compose up bot
```

---

## Дополнительные ресурсы

- [Docker Compose документация](https://docs.docker.com/compose/)
- [MongoDB в Docker](https://hub.docker.com/_/mongo)
- [Redis в Docker](https://hub.docker.com/_/redis)
- [Browserless документация](https://www.browserless.io/docs/docker)

---

## Поддержка

При возникновении проблем:
1. Проверьте логи: `docker compose logs <service>`
2. Убедитесь, что все зависимости запущены
3. Проверьте переменные окружения в `.env`
4. Обратитесь к разделу [Troubleshooting](#troubleshooting)

