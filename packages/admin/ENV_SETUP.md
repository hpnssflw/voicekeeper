# Настройка переменных окружения

## Быстрый старт

1. Скопируйте `.env.example` в `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Заполните все переменные в `.env.local` (см. инструкции ниже)

3. Перезапустите dev сервер после изменения `.env.local`

## Обязательные переменные

### 1. NEXTAUTH_SECRET

**Обязательно для работы OAuth!**

Сгенерируйте секретный ключ одним из способов:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Онлайн генератор:**
https://generate-secret.vercel.app/32

### 2. MONGO_URI

**Обязательно для работы с базой данных!**

Формат:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Пример:
```
mongodb+srv://user:pass123@my-cluster.vb8w5g8.mongodb.net/voronka?retryWrites=true&w=majority
```

## Опциональные переменные (для OAuth)

### Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте проект или выберите существующий
3. Включите **Google+ API**
4. Перейдите в **APIs & Services** → **Credentials**
5. Нажмите **Create Credentials** → **OAuth client ID**
6. Выберите **Web application**
7. Добавьте **Authorized redirect URIs**:
   - `http://localhost:3001/api/auth/callback/google` (для разработки)
   - `https://yourdomain.com/api/auth/callback/google` (для продакшена)
8. Скопируйте **Client ID** и **Client Secret** в `.env.local`

### Yandex OAuth

1. Перейдите в [Яндекс ID для разработчиков](https://oauth.yandex.ru/)
2. Нажмите **Создать новое приложение**
3. Заполните:
   - **Название**: VoiceKeeper
   - **Платформы**: Web-сервисы
   - **Callback URI #1**: `http://localhost:3001/api/auth/callback/yandex`
   - **Callback URI #2**: `https://yourdomain.com/api/auth/callback/yandex` (для продакшена)
4. Выберите права доступа:
   - ✅ Доступ к email адресу
   - ✅ Доступ к имени, фамилии и отчеству
   - ✅ Доступ к аватару
5. Сохраните и скопируйте **ID приложения** и **Пароль** в `.env.local`

## Структура файла .env.local

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=ваш-секретный-ключ

# Google OAuth (опционально)
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret

# Yandex OAuth (опционально)
YANDEX_CLIENT_ID=ваш-yandex-client-id
YANDEX_CLIENT_SECRET=ваш-yandex-client-secret

# MongoDB (обязательно)
MONGO_URI=ваш-mongodb-uri

# API (опционально)
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

## Важные замечания

1. **`.env.local` не коммитится в git** - он уже в `.gitignore`
2. **`.env.example` коммитится** - это шаблон для других разработчиков
3. После изменения `.env.local` **перезапустите dev сервер**
4. В **production** все переменные должны быть установлены в настройках хостинга (Vercel, etc.)

## Проверка настроек

После настройки переменных проверьте:

1. Запустите dev сервер: `npm run dev`
2. Откройте консоль браузера - не должно быть ошибок о переменных окружения
3. Попробуйте войти через OAuth (если настроили)

## Troubleshooting

### Ошибка: "NEXTAUTH_SECRET is not set"
- Убедитесь, что `NEXTAUTH_SECRET` установлен в `.env.local`
- Перезапустите dev сервер после добавления переменной

### Ошибка: "MONGO_URI is not configured"
- Проверьте, что `MONGO_URI` установлен в `.env.local`
- Убедитесь, что URI правильного формата
- Проверьте доступность MongoDB кластера

### OAuth не работает
- Проверьте, что все OAuth переменные установлены
- Убедитесь, что redirect URIs правильно настроены в провайдерах
- Проверьте логи в консоли браузера и сервера

