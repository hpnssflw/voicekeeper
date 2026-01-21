# Настройка OAuth2 (Google и Яндекс)

## Что нужно для работы OAuth2

### 1. Переменные окружения

Создайте файл `.env.local` в корне `packages/admin` со следующими переменными:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Yandex OAuth
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
```

### 2. Генерация NEXTAUTH_SECRET

Выполните команду для генерации секретного ключа:

```bash
openssl rand -base64 32
```

Или используйте онлайн-генератор: https://generate-secret.vercel.app/32

### 3. Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**
4. Нажмите **Create Credentials** → **OAuth client ID**
5. Выберите тип приложения: **Web application**
6. Добавьте **Authorized redirect URIs**:
   - `http://localhost:3001/api/auth/callback/google` (для разработки)
   - `https://yourdomain.com/api/auth/callback/google` (для продакшена)
7. Скопируйте **Client ID** и **Client Secret** в `.env.local`

### 4. Настройка Яндекс OAuth

1. Перейдите в [Яндекс ID для разработчиков](https://oauth.yandex.ru/)
2. Нажмите **Создать новое приложение**
3. Заполните данные:
   - **Название**: VoiceKeeper (или ваше название)
   - **Платформы**: Web-сервисы
   - **Callback URI #1**: `http://localhost:3001/api/auth/callback/yandex`
   - **Callback URI #2**: `https://yourdomain.com/api/auth/callback/yandex` (для продакшена)
4. Выберите права доступа:
   - **Доступ к email адресу**
   - **Доступ к имени, фамилии и отчеству**
   - **Доступ к аватару**
5. Сохраните приложение
6. Скопируйте **ID приложения** (Client ID) и **Пароль** (Client Secret) в `.env.local`

### 5. Проверка работы

После настройки:

1. Запустите приложение: `npm run dev`
2. Перейдите на страницу входа: `http://localhost:3001/login`
3. Нажмите кнопку **Войти через Google** или **Войти через Яндекс**
4. Разрешите доступ приложению
5. Вы должны быть перенаправлены в дашборд

## Структура файлов

- `lib/auth-config.ts` - Конфигурация NextAuth с провайдерами
- `app/api/auth/[...nextauth]/route.ts` - API route для NextAuth
- `app/api/auth/sync/route.ts` - Синхронизация OAuth сессии с нашей системой
- `app/(auth)/login/page.tsx` - Страница входа с кнопками OAuth
- `components/providers/session-provider.tsx` - Провайдер сессии NextAuth

## Интеграция с существующей системой

OAuth пользователи автоматически синхронизируются с существующей системой пользователей через API `/api/auth/sync`. При первом входе создается новый пользователь в MongoDB с данными из OAuth провайдера.

