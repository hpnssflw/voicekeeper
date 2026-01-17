# Docker Quick Start 🚀

## Быстрые команды

### Запуск
```bash
# Все сервисы
docker compose up -d

# Только инфраструктура (MongoDB + Redis)
docker compose up -d mongodb redis

# Backend (API + инфраструктура)
docker compose up -d mongodb redis bot

# Frontend (Webapp + Admin + Backend)
docker compose up -d mongodb redis bot webapp admin
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
| Bot API | 8080 | `http://localhost:8080` |
| Webapp | 3000 | `http://localhost:3000` |
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

Создайте `.env` в `infra/`:
```env
# Обязательные
TELEGRAM_BOT_TOKEN=your_token
GEMINI_API_KEY=your_key  # или OPENAI_API_KEY
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379
```

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

