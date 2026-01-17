# Docker Infrastructure

Директория содержит конфигурации Docker Compose для запуска всех компонентов системы.

## 📁 Файлы

- `docker-compose.yml` - Основная конфигурация (все сервисы)
- `docker-compose.minimal.yml` - Только MongoDB + Redis
- `docker-compose.backend.yml` - Backend (MongoDB + Redis + Bot + Chromium)
- `docker-compose.dev.yml` - Override для разработки
- `nginx/` - Конфигурации Nginx
- `.env` - Переменные окружения (создайте из `.env.example`)

## 🚀 Быстрый старт

```bash
# 1. Создайте .env файл
cp .env.example .env
# Отредактируйте .env и укажите ваши токены

# 2. Запустите все сервисы
docker compose up -d

# 3. Проверьте статус
docker compose ps

# 4. Просмотрите логи
docker compose logs -f
```

## 📖 Документация

- **Полное руководство:** [docs/DOCKER_GUIDE.md](../docs/DOCKER_GUIDE.md)
- **Быстрая шпаргалка:** [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)

## 🔧 Полезные команды

```bash
# Запуск отдельных сервисов
docker compose up -d mongodb redis
docker compose up -d bot

# Логи
docker compose logs -f bot

# Пересборка
docker compose build bot
docker compose up -d bot

# Остановка
docker compose down
```

## 🌐 Порты

| Сервис | Порт | URL |
|--------|------|-----|
| MongoDB | 27017 | `mongodb://localhost:27017` |
| Redis | 6379 | `redis://localhost:6379` |
| Bot API | 8080 | `http://localhost:8080` |
| Webapp | 3000 | `http://localhost:3000` |
| Admin | 3001 | `http://localhost:3001` |
| Chromium | 3333 | `ws://localhost:3333` |
| Nginx | 80, 443 | `http://localhost` |

## ⚙️ Переменные окружения

Создайте `.env` файл с обязательными переменными:

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# AI (выберите один)
GEMINI_API_KEY=your_key
# ИЛИ
OPENAI_API_KEY=your_key
AI_PROVIDER=gemini  # или openai

# URLs (опционально)
WEBAPP_URL=http://localhost:3000
```

## 📝 Примеры использования

### Только инфраструктура для локальной разработки

```bash
docker compose -f docker-compose.minimal.yml up -d
```

Затем запустите `bot`, `webapp`, `admin` локально через `npm run dev`.

### Backend в Docker, Frontend локально

```bash
docker compose -f docker-compose.backend.yml up -d
```

### Полная конфигурация для тестирования

```bash
docker compose up -d
```

## 🐛 Troubleshooting

См. раздел [Troubleshooting](../docs/DOCKER_GUIDE.md#troubleshooting) в полной документации.

**Быстрая проверка:**
```bash
# Статус всех контейнеров
docker compose ps

# Логи проблемного сервиса
docker compose logs bot | grep -i error

# Перезапуск
docker compose restart bot
```

