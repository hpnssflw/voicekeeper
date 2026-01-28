# 🚀 Быстрый запуск проекта

## Вариант 1: Docker (рекомендуется) 🐳

### Шаг 1: Настройте переменные окружения

Создайте файл `infra/.env`:

```bash
cd infra
```

Создайте `.env` файл со следующим содержимым:

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

### Шаг 2: Запустите все сервисы

```bash
cd infra
docker-compose --profile full up -d
```

### Шаг 3: Проверьте статус

```bash
docker-compose ps
```

### Шаг 4: Откройте приложение

- **Admin Panel**: http://localhost:3001
- **Bot API**: http://localhost:4000

---

## Вариант 2: Локальная разработка 💻

### Шаг 1: Запустите инфраструктуру (MongoDB + Redis)

```bash
cd infra
docker-compose up -d mongodb redis
```

### Шаг 2: Установите зависимости

```bash
# В корне проекта
npm install
```

### Шаг 3: Настройте переменные окружения

**Bot сервис** (`packages/bot/.env`):
```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
MONGO_URI=mongodb://localhost:27017/app
REDIS_URL=redis://localhost:6379
PORT=4000
```

**Admin** (`packages/admin/.env.local`):
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_here
MONGO_URI=mongodb://localhost:27017/app
```

### Шаг 4: Запустите сервисы

**Терминал 1 - Bot API:**
```bash
cd packages/bot
npm run dev
```

**Терминал 2 - Admin Panel:**
```bash
cd packages/admin
npm run dev
```

### Шаг 5: Откройте приложение

- **Admin Panel**: http://localhost:3001
- **Bot API**: http://localhost:4000

---

## Полезные команды

### Docker

```bash
# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f bot
docker-compose logs -f admin

# Остановка всех сервисов
docker-compose down

# Пересборка после изменений
docker-compose build bot
docker-compose --profile full up -d bot

# Остановка с удалением данных (⚠️ удалит данные)
docker-compose down -v
```

### Локальная разработка

```bash
# Остановка инфраструктуры
cd infra
docker-compose down

# Перезапуск инфраструктуры
docker-compose restart mongodb redis
```

---

## Профили Docker Compose

```bash
# Все сервисы (production-like)
docker-compose --profile full up -d

# Только MTProto (MongoDB + Redis + Bot + Admin)
docker-compose --profile mtproto up -d

# Только Backend (MongoDB + Redis + Bot + Chromium)
docker-compose --profile backend up -d

# Только инфраструктура (MongoDB + Redis)
docker-compose up -d mongodb redis

# С инструментами разработки (Mongo Express + Redis Commander)
docker-compose --profile tools up -d mongodb redis
```

---

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

### MongoDB не запускается

```bash
# Проверьте логи
docker-compose logs mongodb

# Проверьте, не занят ли порт 27017
netstat -an | findstr 27017  # Windows
lsof -i :27017              # Linux/Mac
```

---

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

