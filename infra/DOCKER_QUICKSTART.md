# Docker Quick Start 🚀

## Быстрые команды

### Запуск
```bash
# Все сервисы (production-like)
docker compose --profile full up -d

# Только MTProto (MongoDB + Redis + Bot + Admin)
docker compose --profile mtproto up -d

# Только Backend (MongoDB + Redis + Bot + Chromium)
docker compose --profile backend up -d

# Только инфраструктура (MongoDB + Redis) - для локальной разработки
docker compose up -d mongodb redis

# С инструментами разработки
docker compose --profile tools up -d mongodb redis
```

### Остановка
```bash
# Все сервисы
docker compose down

# Конкретный сервис
docker compose stop bot
```

### Логи
```bash
# Все логи
docker compose logs -f

# Конкретный сервис
docker compose logs -f bot
```

### Пересборка
```bash
# Конкретный сервис
docker compose build bot
docker compose up -d bot

# Все сервисы
docker compose build
docker compose up -d
```

## Порты

| Сервис | Порт | URL |
|--------|------|-----|
| MongoDB | 27017 | `mongodb://localhost:27017` |
| Redis | 6379 | `redis://localhost:6379` |
| Bot API | 4000 | `http://localhost:4000` |
| Admin | 3001 | `http://localhost:3001` |
| Chromium | 3333 | `ws://localhost:3333` |
| Nginx | 80, 443 | `http://localhost` |

## Проверка статуса

```bash
# Список контейнеров
docker compose ps

# Использование ресурсов
docker stats
```

## Переменные окружения

Создайте `.env` в `infra/` (можно скопировать из `.env.example`):
```env
# Обязательные для MTProto
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash

# Опционально
TELEGRAM_BOT_TOKEN=your_token
GEMINI_API_KEY=your_key  # или OPENAI_API_KEY
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379
BOT_PORT=4000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_here
```

**Важно**: `TELEGRAM_API_ID` и `TELEGRAM_API_HASH` обязательны для работы MTProto (парсинг и постинг в каналы).
Получите их на https://my.telegram.org/apps

## Troubleshooting

```bash
# Проверка логов
docker compose logs bot | grep -i error

# Перезапуск сервиса
docker compose restart bot

# Очистка (⚠️ удалит данные)
docker compose down -v
```

📖 **Полная документация:** [docs/DOCKER_GUIDE.md](../docs/DOCKER_GUIDE.md)

