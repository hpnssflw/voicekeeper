# Troubleshooting Docker

## Проблема: Не удается подключиться к Docker Hub

### Ошибка:
```
failed to resolve reference "docker.io/library/mongo:6.0": 
failed to do request: Head "https://registry-1.docker.io/v2/library/mongo/manifests/6.0": 
dial tcp: lookup registry-1.docker.io: no such host
```

### Решения:

#### 1. Проверьте подключение к интернету

```bash
# Проверьте доступность Docker Hub
ping registry-1.docker.io

# Или через браузер откройте
https://hub.docker.com
```

#### 2. Проверьте настройки DNS в Docker Desktop

**Windows:**
1. Откройте Docker Desktop
2. Settings → Resources → Network
3. Попробуйте изменить DNS на:
   - `8.8.8.8` (Google DNS)
   - `1.1.1.1` (Cloudflare DNS)

#### 3. Перезапустите Docker Desktop

```powershell
# Остановите Docker Desktop
# Запустите снова
```

#### 4. Очистите DNS кеш

```powershell
# Windows PowerShell (от имени администратора)
ipconfig /flushdns
```

#### 5. Проверьте прокси/VPN

Если используете VPN или прокси:
- Временно отключите VPN
- Или настройте прокси в Docker Desktop (Settings → Resources → Proxies)

#### 6. Используйте альтернативный DNS

Создайте файл `C:\ProgramData\Docker\config\daemon.json`:

```json
{
  "dns": ["8.8.8.8", "1.1.1.1"]
}
```

Перезапустите Docker Desktop.

#### 7. Проверьте файрвол/антивирус

Убедитесь, что файрвол или антивирус не блокирует Docker.

---

## Проблема: Предупреждения о переменных окружения

### Предупреждения:
```
The "TELEGRAM_API_ID" variable is not set. Defaulting to a blank string.
```

### Решение:

Создайте файл `infra/.env`:

```env
# Обязательные для MTProto
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
NEXTAUTH_SECRET=your_secret_here

# Опциональные
TELEGRAM_BOT_TOKEN=your_bot_token
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
TELEGRAM_CHANNEL_ID=your_channel_id
```

**Важно:** Предупреждения об опциональных переменных (GEMINI_API_KEY, OPENAI_API_KEY, TELEGRAM_BOT_TOKEN) можно игнорировать, если они не нужны.

---

## Проблема: Контейнеры не запускаются

### Проверьте логи:

```bash
docker-compose logs mongodb
docker-compose logs bot
docker-compose logs admin
```

### Проверьте статус:

```bash
docker-compose ps
```

### Пересоберите образы:

```bash
docker-compose build --no-cache
docker-compose --profile full up -d
```

---

## Проблема: Порт уже занят

### Ошибка:
```
Error: bind: address already in use
```

### Решение:

```powershell
# Windows - найти процесс на порту
netstat -ano | findstr :3001
netstat -ano | findstr :4000
netstat -ano | findstr :27017

# Убить процесс (замените PID на реальный)
taskkill /PID <PID> /F
```

Или измените порты в `docker-compose.yml`.

---

## Проблема: MongoDB не подключается

### Проверьте:

```bash
# Проверьте, что MongoDB запущен
docker-compose ps mongodb

# Проверьте логи
docker-compose logs mongodb

# Попробуйте подключиться
docker-compose exec mongodb mongosh
```

---

## Проблема: Admin не может подключиться к Bot

### Проверьте:

```bash
# Проверьте, что Bot запущен
docker-compose ps bot

# Проверьте переменную NEXT_PUBLIC_API_BASE
docker-compose exec admin env | grep NEXT_PUBLIC_API_BASE

# Должно быть: NEXT_PUBLIC_API_BASE=http://bot:4000/api
```

---

## Дополнительная помощь

Если проблема не решена:
1. Проверьте логи: `docker-compose logs -f`
2. Перезапустите Docker Desktop
3. Проверьте версию Docker: `docker --version`
4. Обновите Docker Desktop до последней версии

