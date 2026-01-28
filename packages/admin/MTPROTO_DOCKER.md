# Запуск MTProto в Docker

## Быстрый старт

### 1. Настройте переменные окружения

Создайте файл `infra/.env`:

```env
# MTProto (обязательно для парсинга и постинга)
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash

# Database
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379

# Ports
BOT_PORT=4000

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_here
```

### 2. Запустите MTProto сервисы

```bash
cd infra
docker-compose --profile mtproto up -d
```

Или все сервисы:

```bash
cd infra
docker-compose --profile full up -d
```

### 3. Проверьте статус

```bash
docker-compose ps
```

Должны быть запущены:
- `mongodb` (MongoDB)
- `redis` (Redis)
- `bot` (Bot API с MTProto)
- `admin` (Admin панель)

### 4. Откройте Admin

Откройте в браузере: `http://localhost:3001`

## Структура сервисов

```
┌─────────────┐
│   MongoDB   │ (27017)
└─────────────┘
       ↑
       │
┌─────────────┐         HTTP          ┌──────────────┐
│    Admin    │  ───────────────────>  │  Bot Service │
│  (Next.js)  │                        │  (Express)   │
│   :3001     │  <───────────────────  │    :4000     │
└─────────────┘      Response          └──────────────┘
       ↑                                    ↑
       │                                    │
       └─────────── MongoDB ───────────────┘
```

## Логи

```bash
# Все логи
docker-compose logs -f

# Логи Bot сервиса (MTProto)
docker-compose logs -f bot

# Логи Admin
docker-compose logs -f admin
```

## Пересборка после изменений

```bash
# Пересобрать Bot сервис
docker-compose build bot
docker-compose up -d bot

# Пересобрать Admin
docker-compose build admin
docker-compose up -d admin

# Пересобрать все
docker-compose build
docker-compose up -d
```

## Остановка

```bash
# Остановить все
docker-compose down

# Остановить с удалением volumes (⚠️ удалит данные)
docker-compose down -v
```

## Troubleshooting

### Bot сервис не запускается

```bash
# Проверьте логи
docker-compose logs bot

# Проверьте, что переменные окружения установлены
docker-compose config | grep TELEGRAM_API
```

### Admin не может подключиться к Bot

```bash
# Проверьте, что Bot запущен
docker-compose ps bot

# Проверьте healthcheck
docker-compose exec bot wget -qO- http://localhost:4000/health

# Проверьте переменную NEXT_PUBLIC_API_BASE в Admin
docker-compose exec admin env | grep NEXT_PUBLIC_API_BASE
```

### Коды не приходят в Telegram

1. Убедитесь, что `TELEGRAM_API_ID` и `TELEGRAM_API_HASH` установлены в Bot сервисе
2. Проверьте логи Bot сервиса: `docker-compose logs -f bot`
3. Убедитесь, что Bot сервис работает как постоянный процесс (не serverless)

## Production

Для продакшена:

1. Используйте секреты Docker или внешний secrets manager
2. Настройте правильные URL для `NEXT_PUBLIC_API_BASE` и `NEXTAUTH_URL`
3. Используйте reverse proxy (nginx) для HTTPS
4. Настройте мониторинг и логирование

