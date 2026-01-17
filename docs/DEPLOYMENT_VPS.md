# Деплой на VPS: Docker + Монорепо

Данное руководство описывает, как деплоить всю систему на VPS используя Docker Compose из монорепо структуры.

## 📋 Структура монорепо для VPS

```
telegram-voronka/
├── packages/
│   ├── bot/         # Express API (деплоится на VPS)
│   ├── webapp/      # Next.js (опционально, можно на Vercel)
│   └── admin/       # Next.js (опционально, можно на Vercel)
├── infra/
│   ├── docker-compose.yml      # Основная конфигурация
│   ├── docker-compose.prod.yml # Production override
│   ├── nginx/                  # Nginx конфигурации
│   └── scripts/                # Скрипты для управления
└── .env                        # Переменные окружения
```

## 🚀 Быстрый старт

### 1. Подготовка сервера

**Требования:**
- Ubuntu 22.04+ (или другой Linux дистрибутив)
- 2+ vCPU, 4+ GB RAM, 50+ GB SSD
- Docker и Docker Compose установлены

**Установка Docker:**
```bash
# Используйте скрипт из репозитория
bash infra/scripts/install_docker.sh

# Или вручную
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Установка Docker Compose:**
```bash
sudo apt install docker-compose-plugin
# Или
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Клонирование репозитория

```bash
cd ~
git clone <YOUR_REPO_URL> telegram-voronka
cd telegram-voronka
```

### 3. Настройка переменных окружения

```bash
cd infra
cp .env.example .env
nano .env  # или используйте ваш редактор
```

**Минимальная конфигурация `.env`:**
```env
# Database
MONGO_URI=mongodb://mongodb:27017/app
REDIS_URL=redis://redis:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id

# AI
GEMINI_API_KEY=your_gemini_key
# ИЛИ
OPENAI_API_KEY=your_openai_key
AI_PROVIDER=gemini  # или openai

# URLs
WEBAPP_URL=https://webapp.voicekeeper.io
BOT_BASE_URL=https://api.voicekeeper.io
APP_BASE_URL=https://admin.voicekeeper.io

# Security
JWT_SECRET=your_strong_random_secret_here

# Browserless
BROWSERLESS_URL=ws://chromium:3000
```

### 4. Настройка Nginx

**Создайте конфигурации для доменов:**

`infra/nginx/api.conf` (для bot API):
```nginx
server {
    listen 80;
    server_name api.voicekeeper.io;

    location / {
        proxy_pass http://bot:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

`infra/nginx/webapp.conf` (для webapp, если деплоите на VPS):
```nginx
server {
    listen 80;
    server_name webapp.voicekeeper.io;

    location / {
        proxy_pass http://webapp:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

`infra/nginx/admin.conf` (для admin, если деплоите на VPS):
```nginx
server {
    listen 80;
    server_name admin.voicekeeper.io;

    location / {
        proxy_pass http://admin:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx

# Для каждого домена
sudo certbot --nginx -d api.voicekeeper.io --redirect --non-interactive --agree-tos -m your@email.com
sudo certbot --nginx -d webapp.voicekeeper.io --redirect --non-interactive --agree-tos -m your@email.com
sudo certbot --nginx -d admin.voicekeeper.io --redirect --non-interactive --agree-tos -m your@email.com
```

Автообновление сертификатов настроено автоматически через systemd timer.

### 6. Запуск сервисов

```bash
cd infra

# Сборка образов
docker compose build

# Запуск в фоне
docker compose up -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

### 7. Проверка работы

```bash
# Проверка API
curl https://api.voicekeeper.io/health

# Проверка контейнеров
docker compose ps

# Проверка логов
docker compose logs bot
```

---

## 🔄 Обновление приложения

### Автоматическое обновление (через Git)

```bash
cd ~/telegram-voronka

# Получить последние изменения
git pull origin main

# Пересобрать и перезапустить
cd infra
docker compose build
docker compose up -d

# Или используйте скрипт
bash scripts/deploy.sh
```

### Скрипт деплоя (`infra/scripts/deploy.sh`)

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd "$(dirname "$0")/.."
git pull origin main

cd infra
docker compose build
docker compose down
docker compose up -d

echo "✅ Deployment complete!"
docker compose ps
```

---

## 📦 Production конфигурация

Создайте `infra/docker-compose.prod.yml` для production override:

```yaml
version: '3.9'

services:
  bot:
    restart: always
    environment:
      - NODE_ENV=production
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  webapp:
    restart: always
    environment:
      - NODE_ENV=production
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  admin:
    restart: always
    environment:
      - NODE_ENV=production
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  mongodb:
    restart: always
    command: mongod --wiredTigerCacheSizeGB 1

  redis:
    restart: always
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

**Запуск с production конфигурацией:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🔧 Управление сервисами

### Просмотр логов

```bash
# Все логи
docker compose logs -f

# Конкретный сервис
docker compose logs -f bot

# Последние 100 строк
docker compose logs --tail=100 bot
```

### Перезапуск сервиса

```bash
docker compose restart bot
```

### Остановка и запуск

```bash
# Остановить все
docker compose stop

# Запустить все
docker compose start

# Остановить и удалить контейнеры
docker compose down

# Остановить и удалить volumes (⚠️ удалит данные)
docker compose down -v
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
docker stats

# Проверка дискового пространства
df -h
docker system df
```

---

## 💾 Backup и Restore

### MongoDB Backup

```bash
# Создать backup
docker compose exec mongodb mongodump --archive > backup-$(date +%Y%m%d).gz

# Восстановить из backup
docker compose exec -T mongodb mongorestore --archive < backup-20260117.gz
```

### Автоматический backup (cron)

Создайте `infra/scripts/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

cd "$(dirname "$0")/.."
docker compose exec -T mongodb mongodump --archive | gzip > "$BACKUP_DIR/mongo-$(date +%Y%m%d-%H%M%S).gz"

# Удалить старые backup (старше 7 дней)
find $BACKUP_DIR -name "mongo-*.gz" -mtime +7 -delete
```

Добавьте в crontab:
```bash
crontab -e
# Каждый день в 2:00
0 2 * * * /root/telegram-voronka/infra/scripts/backup.sh
```

---

## 🔐 Безопасность

### Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### Ротация логов

Docker автоматически ротирует логи через `json-file` driver с настройками в `docker-compose.prod.yml`.

### Мониторинг

Рекомендуется настроить:
- Uptime monitoring (UptimeRobot, Pingdom)
- Логирование в централизованную систему (Loki, ELK)
- Алерты на критические ошибки

---

## 🌐 Гибридный деплой (VPS + Vercel)

### Рекомендуемая конфигурация

**На VPS:**
- `bot` (Express API)
- `mongodb`
- `redis`
- `chromium`
- `nginx` (reverse proxy для API)

**На Vercel:**
- `webapp` (Next.js Mini App)
- `admin` (Next.js Admin Panel)

### Настройка

1. **VPS:** Настройте только `bot`, `mongodb`, `redis`, `chromium`
2. **Vercel:** Деплойте `webapp` и `admin` отдельно
3. **Переменные окружения:**
   - В Vercel для `webapp` и `admin`: `NEXT_PUBLIC_API_BASE=https://api.voicekeeper.io`
   - На VPS в `.env`: `BOT_BASE_URL=https://api.voicekeeper.io`

### Docker Compose для гибридного деплоя

Создайте `infra/docker-compose.vps.yml`:

```yaml
version: '3.9'

services:
  mongodb:
    # ... как в основном файле

  redis:
    # ... как в основном файле

  bot:
    # ... как в основном файле
    # Уберите зависимости от webapp и admin

  chromium:
    # ... как в основном файле

  nginx:
    # Только для API
    # Уберите зависимости от webapp и admin
```

---

## 🐛 Troubleshooting

### Проблема: Контейнер не запускается

```bash
# Проверьте логи
docker compose logs <service>

# Проверьте статус
docker compose ps

# Проверьте переменные окружения
docker compose config
```

### Проблема: Порт занят

```bash
# Найдите процесс
sudo lsof -i :8080

# Убейте процесс или измените порт в docker-compose.yml
```

### Проблема: Нехватка памяти

```bash
# Проверьте использование
docker stats

# Ограничьте ресурсы в docker-compose.yml
services:
  bot:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Проблема: MongoDB не сохраняет данные

```bash
# Проверьте volume
docker volume ls
docker volume inspect telegram-voronka_mongodb_data
```

---

## 📊 Мониторинг и метрики

### Health checks

Добавьте health checks в `docker-compose.yml`:

```yaml
services:
  bot:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Логирование

Настройте централизованное логирование:
- Loki + Grafana
- ELK Stack
- CloudWatch (если используете AWS)

---

## 📝 Чеклист деплоя

- [ ] Docker и Docker Compose установлены
- [ ] Репозиторий склонирован на сервер
- [ ] `.env` файл создан и заполнен
- [ ] DNS записи настроены (A записи на IP сервера)
- [ ] Nginx конфигурации созданы
- [ ] SSL сертификаты получены (Let's Encrypt)
- [ ] Firewall настроен (UFW)
- [ ] Сервисы запущены и работают
- [ ] Backup настроен
- [ ] Мониторинг настроен
- [ ] Документация обновлена с актуальными доменами

---

## 🔗 Полезные ссылки

- [Docker Compose документация](https://docs.docker.com/compose/)
- [Nginx документация](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Guide](../docs/DOCKER_GUIDE.md) — подробное руководство по Docker

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker compose logs -f`
2. Убедитесь, что все зависимости запущены
3. Проверьте переменные окружения
4. Обратитесь к разделу [Troubleshooting](#-troubleshooting)

