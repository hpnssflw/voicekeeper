# Настройка переменных окружения в Vercel

## ⚠️ ВАЖНО: Секретные переменные НЕ в vercel.json!

Файл `vercel.json` коммитится в git, поэтому **НЕ добавляйте туда секретные переменные**:
- ❌ `NEXTAUTH_SECRET`
- ❌ `GOOGLE_CLIENT_SECRET`
- ❌ `YANDEX_CLIENT_SECRET`
- ❌ `MONGO_URI`

## Публичные переменные в vercel.json

В `vercel.json` уже добавлены публичные переменные:
- ✅ `NEXT_PUBLIC_DEMO_MODE`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXT_PUBLIC_API_BASE`
- ✅ `NEXTAUTH_URL`

## Секретные переменные через Vercel UI

Добавьте секретные переменные через Vercel Dashboard:

1. Перейдите в ваш проект на Vercel: https://vercel.com/dashboard
2. Откройте **Settings** → **Environment Variables**
3. Добавьте следующие переменные для **Production**, **Preview** и **Development**:

### Обязательные секреты:

```
NEXTAUTH_SECRET=<ваш-секретный-ключ>
```

### MongoDB:

```
MONGO_URI=<ваш-mongodb-uri>
```

### Google OAuth (если используете):

```
GOOGLE_CLIENT_ID=<ваш-google-client-id>
GOOGLE_CLIENT_SECRET=<ваш-google-client-secret>
```

### Yandex OAuth (если используете):

```
YANDEX_CLIENT_ID=<ваш-yandex-client-id>
YANDEX_CLIENT_SECRET=<ваш-yandex-client-secret>
```

## Альтернатива: Vercel CLI

Можно добавить переменные через CLI:

```bash
# Установите Vercel CLI если еще не установлен
npm i -g vercel

# Войдите в аккаунт
vercel login

# Добавьте переменные
vercel env add NEXTAUTH_SECRET production
vercel env add MONGO_URI production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add YANDEX_CLIENT_ID production
vercel env add YANDEX_CLIENT_SECRET production
```

## Проверка переменных

После добавления переменных:

1. Перезапустите деплой (или дождитесь следующего коммита)
2. Проверьте логи сборки - не должно быть ошибок о недостающих переменных
3. Проверьте работу OAuth (если настроили)

## Структура переменных

### В vercel.json (публичные):
```json
{
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://voicekeeper.vercel.app",
    "NEXTAUTH_URL": "https://voicekeeper.vercel.app"
  }
}
```

### В Vercel Environment Variables (секреты):
- `NEXTAUTH_SECRET`
- `MONGO_URI`
- `GOOGLE_CLIENT_ID` (опционально)
- `GOOGLE_CLIENT_SECRET` (опционально)
- `YANDEX_CLIENT_ID` (опционально)
- `YANDEX_CLIENT_SECRET` (опционально)

