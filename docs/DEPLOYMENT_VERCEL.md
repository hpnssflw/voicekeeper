# Деплой на Vercel: Монорепо структура

Данное руководство описывает, как деплоить отдельные Next.js приложения из монорепо на Vercel.

## 📋 Структура монорепо

```
telegram-voronka/
├── packages/
│   ├── webapp/      # Next.js Mini App для Telegram
│   ├── admin/       # Next.js Admin Panel
│   └── bot/         # Express API (деплоится отдельно на VPS/Railway)
├── infra/           # Docker конфигурации
└── docs/            # Документация
```

## 🚀 Деплой на Vercel

### Вариант 1: Отдельные проекты (Рекомендуется)

Каждое приложение (`webapp` и `admin`) должно быть отдельным проектом в Vercel.

#### 1. Подготовка репозитория

Убедитесь, что в корне каждого пакета есть `vercel.json`:

- `packages/webapp/vercel.json`
- `packages/admin/vercel.json`

#### 2. Создание проектов в Vercel

**Для Webapp:**
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Нажмите "Add New Project"
3. Импортируйте ваш Git репозиторий
4. **Важно:** В настройках проекта:
   - **Root Directory:** `packages/webapp`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (или оставьте по умолчанию)
   - **Output Directory:** `.next` (или оставьте по умолчанию)
   - **Install Command:** `npm install` (или оставьте по умолчанию)

**Для Admin:**
1. Создайте второй проект в Vercel
2. Используйте тот же репозиторий
3. **Root Directory:** `packages/admin`
4. Остальные настройки аналогично

#### 3. Переменные окружения

**Webapp (`packages/webapp`):**
```env
NEXT_PUBLIC_API_BASE=https://api.voicekeeper.io
NEXT_PUBLIC_DEMO_MODE=false
```

**Admin (`packages/admin`):**
```env
NEXT_PUBLIC_API_BASE=https://api.voicekeeper.io
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://admin.voicekeeper.vercel.app
```

#### 4. Настройка через Vercel CLI (альтернатива)

```bash
# Установите Vercel CLI
npm i -g vercel

# Для webapp
cd packages/webapp
vercel

# Для admin
cd packages/admin
vercel
```

При первом запуске Vercel спросит:
- Link to existing project? → No (создайте новый)
- What's your project's name? → `voicekeeper-webapp` / `voicekeeper-admin`
- In which directory is your code located? → `./` (уже в packages/webapp)
- Override settings? → No (используйте vercel.json)

---

### Вариант 2: Monorepo через Vercel CLI

Если вы хотите управлять обоими проектами из одного места:

```bash
# В корне монорепо
vercel

# При настройке укажите:
# - Root Directory: packages/webapp или packages/admin
# - Или создайте vercel.json в корне с настройками
```

---

## ⚙️ Конфигурация vercel.json

### Webapp (`packages/webapp/vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_DEMO_MODE": "false",
    "NEXT_PUBLIC_API_BASE": "https://api.voicekeeper.io"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ]
}
```

**Особенности:**
- `X-Frame-Options: ALLOWALL` — необходимо для Telegram Mini App (iframe)
- `NEXT_PUBLIC_API_BASE` — URL вашего API (bot сервис)

### Admin (`packages/admin/vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_DEMO_MODE": "false",
    "NEXT_PUBLIC_APP_URL": "https://admin.voicekeeper.vercel.app"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.voicekeeper.io/api/:path*"
    }
  ]
}
```

**Особенности:**
- `X-Frame-Options: DENY` — защита от iframe (admin не должен открываться в iframe)
- Rewrites для проксирования API запросов

---

## 🔧 Настройка Next.js для монорепо

### Webapp (`packages/webapp/next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Для Telegram Mini App
  experimental: {
    turbo: true
  },
  swcMinify: true,
  // Если используете shared компоненты из других пакетов
  transpilePackages: [],
};

export default nextConfig;
```

### Admin (`packages/admin/next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Для Docker деплоя
  // Если используете shared компоненты
  transpilePackages: [],
};

export default nextConfig;
```

---

## 📦 Управление зависимостями

### Проблема: Shared зависимости

Если `webapp` и `admin` используют общие зависимости, есть два подхода:

**Вариант 1: Дублирование зависимостей (проще для Vercel)**
- Каждый пакет имеет свой `package.json` с полным списком зависимостей
- Vercel установит зависимости только для указанного Root Directory

**Вариант 2: Workspace зависимости (сложнее)**
- Используйте npm workspaces
- В `vercel.json` добавьте:
  ```json
  {
    "installCommand": "cd ../.. && npm install && cd packages/webapp && npm run build"
  }
  ```
- Или используйте Turborepo для оптимизации сборки

---

## 🔄 CI/CD и автоматический деплой

### GitHub Actions (опционально)

Создайте `.github/workflows/deploy-webapp.yml`:

```yaml
name: Deploy Webapp to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'packages/webapp/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_WEBAPP_PROJECT_ID }}
          working-directory: ./packages/webapp
```

Аналогично для `admin`.

---

## 🌐 Домены и окружения

### Production

- Webapp: `https://webapp.voicekeeper.io`
- Admin: `https://admin.voicekeeper.io`

### Preview (автоматически)

- Каждая ветка/PR получает свой preview URL
- Например: `https://voicekeeper-webapp-git-feature-branch.vercel.app`

### Staging

Создайте отдельные проекты для staging окружения или используйте preview deployments.

---

## 🐛 Troubleshooting

### Проблема: Build fails с "Cannot find module"

**Решение:**
1. Убедитесь, что `Root Directory` в Vercel настроен правильно
2. Проверьте, что все зависимости указаны в `package.json` пакета
3. Если используете workspace, настройте `installCommand` в `vercel.json`

### Проблема: Переменные окружения не работают

**Решение:**
1. Убедитесь, что переменные начинаются с `NEXT_PUBLIC_` для клиентских
2. Перезапустите деплой после изменения переменных
3. Проверьте, что переменные добавлены в правильный проект

### Проблема: Webapp не открывается в Telegram

**Решение:**
1. Проверьте `X-Frame-Options: ALLOWALL` в headers
2. Убедитесь, что домен добавлен в Telegram Bot Settings
3. Проверьте CORS настройки на API сервере

### Проблема: API запросы не работают

**Решение:**
1. Проверьте `NEXT_PUBLIC_API_BASE` в переменных окружения
2. Убедитесь, что API сервер доступен и CORS настроен
3. Используйте rewrites в `vercel.json` для проксирования

---

## 📊 Мониторинг и аналитика

### Vercel Analytics

Включите Vercel Analytics в настройках проекта для отслеживания производительности.

### Логи

```bash
# Просмотр логов через CLI
vercel logs webapp
vercel logs admin

# Или через Dashboard → Project → Deployments → View Function Logs
```

---

## 🔐 Безопасность

1. **Не коммитьте `.env` файлы** — используйте Vercel Environment Variables
2. **Используйте разные токены** для production и preview
3. **Настройте CORS** на API сервере для разрешенных доменов
4. **Используйте HTTPS** (Vercel предоставляет автоматически)

---

## 📝 Чеклист деплоя

- [ ] Созданы отдельные проекты в Vercel для `webapp` и `admin`
- [ ] Настроен `Root Directory` для каждого проекта
- [ ] Добавлены переменные окружения
- [ ] Проверен `vercel.json` в каждом пакете
- [ ] Протестирован build локально: `cd packages/webapp && npm run build`
- [ ] Настроены домены (опционально)
- [ ] Проверена работа в production
- [ ] Настроены preview deployments для PR

---

## 🔗 Полезные ссылки

- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что Root Directory настроен правильно
3. Проверьте переменные окружения
4. Обратитесь к разделу [Troubleshooting](#-troubleshooting)

