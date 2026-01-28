# Docker Compose для Telegram Voronka

## Быстрый старт

### 1. Настройте переменные окружения

Создайте файл `.env` в директории `infra/`:

```env
# MTProto (обязательно для парсинга и постинга в каналы)
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_here

# Опционально
TELEGRAM_BOT_TOKEN=your_bot_token
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

**Важно**: Получите `TELEGRAM_API_ID` и `TELEGRAM_API_HASH` на https://my.telegram.org/apps

### 2. Запустите сервисы

Используйте **profiles** для выбора нужных сервисов:

```bash
cd infra

# Все сервисы (production-like)
docker-compose --profile full up -d

# Только MTProto (MongoDB + Redis + Bot + Admin)
docker-compose --profile mtproto up -d

# Только Backend (MongoDB + Redis + Bot + Chromium)
docker-compose --profile backend up -d

# Только инфраструктура (MongoDB + Redis) - для локальной разработки
docker-compose up -d mongodb redis

# С инструментами разработки (Mongo Express + Redis Commander)
docker-compose --profile tools up -d mongodb redis
```

## Профили (Profiles)

| Профиль | Сервисы | Назначение |
|---------|---------|------------|
| **full** | Все сервисы + nginx | Production-like окружение |
| **mtproto** | MongoDB + Redis + Bot + Admin | Только MTProto функциональность |
| **backend** | MongoDB + Redis + Bot + Chromium | Backend API |
| **tools** | Mongo Express + Redis Commander | Инструменты для разработки |
| *(без профиля)* | MongoDB + Redis | Только инфраструктура |

## Примеры использования

### Локальная разработка

```bash
# Запустить только инфраструктуру
docker-compose up -d mongodb redis

# Сервисы запускать локально через npm
cd ../packages/bot && npm run dev
cd ../packages/admin && npm run dev
```

### MTProto функциональность

```bash
# Запустить MTProto сервисы
docker-compose --profile mtproto up -d

# Открыть Admin: http://localhost:3001
```

### Полное окружение

```bash
# Все сервисы
docker-compose --profile full up -d

# С инструментами разработки
docker-compose --profile full --profile tools up -d
```

## Логи

```bash
# Все логи
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f bot
docker-compose logs -f admin
```

## Пересборка после изменений

```bash
# Пересобрать конкретный сервис
docker-compose build bot
docker-compose --profile mtproto up -d bot

# Пересобрать все
docker-compose build
docker-compose --profile full up -d
```

## Остановка

```bash
# Остановить все
docker-compose down

# Остановить с удалением volumes (⚠️ удалит данные)
docker-compose down -v
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
| Mongo Express | 8081 | `http://localhost:8081` |
| Redis Commander | 8082 | `http://localhost:8082` |

## Troubleshooting

### Bot сервис не запускается

```bash
# Проверьте логи
docker-compose logs bot

# Проверьте переменные окружения
docker-compose config | grep TELEGRAM_API
```

### Admin не может подключиться к Bot

```bash
# Проверьте, что Bot запущен
docker-compose ps bot

# Проверьте переменную NEXT_PUBLIC_API_BASE
docker-compose exec admin env | grep NEXT_PUBLIC_API_BASE
```

### Коды не приходят в Telegram

1. Убедитесь, что `TELEGRAM_API_ID` и `TELEGRAM_API_HASH` установлены
2. Проверьте логи Bot сервиса: `docker-compose logs -f bot`
3. Убедитесь, что Bot сервис работает как постоянный процесс

## Дополнительная документация

- [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) - Быстрые команды
- [../packages/admin/MTPROTO_DOCKER.md](../packages/admin/MTPROTO_DOCKER.md) - Подробная инструкция по MTProto в Docker
- [../packages/admin/MTPROTO_SETUP.md](../packages/admin/MTPROTO_SETUP.md) - Настройка MTProto
