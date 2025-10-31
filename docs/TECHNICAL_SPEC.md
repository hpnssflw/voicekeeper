## Техническое задание: Платформа управления Telegram-воронками

### 1. Цели и результат
- Создать платформу из админки (Next.js Mini App) и Telegram-бота (Express), позволяющую создавать/редактировать/публиковать контент, управлять рассылками и получать аналитику.
- Обеспечить безопасность, надежность и масштабируемость, готовность к продакшену.

### 2. Объем работ (Scope)
- Backend: Express Telegram Bot, REST API, очереди задач, интеграция с MongoDB/Redis, интеграция с Telegram Bot API.
- Frontend: Next.js 14 App Router, Radix UI, React Hook Form + Yup, Tailwind CSS, Yandex Metrika.
- БД: MongoDB модели, индексы, TTL, миграции (скрипты).
- Инфраструктура: Docker Compose, Nginx, SSL, деплой на VPS, бэкапы, мониторинг.
- Безопасность: Telegram Login, JWT, RBAC, rate limit, хранение секретов.

### 3. Архитектура (высокоуровнево)
- Express Bot/API: вебхуки Telegram, бизнес-логика, публикации/рассылки, REST endpoints для админки.
- Next.js Mini App: административный интерфейс, авторизация, управление контентом, аналитика.
- MongoDB: хранение пользователей, ботов, подписчиков, постов, рассылок, событий, агрегатов.
- Redis: очереди BullMQ, отложенные задачи, rate-limit, кэш.
- Object Storage (S3-совместимый): хранение медиа, CDN.
- Nginx: reverse proxy, HTTP→HTTPS, SSL (Let’s Encrypt).
- Docker/Compose: изоляция, reproducible окружения.

### 4. Компоненты и ответственности
- Express Telegram Bot:
  - Вебхук Telegram: прием update, маршрутизация, команды.
  - Публикации и рассылки: формирование сообщений, батчинг, ретраи.
  - Трекинг событий: просмотры, клики, конверсии.
  - REST API для админки (JWT + RBAC).
- Next.js Mini App:
  - UI: боты, посты, рассылки, аналитика.
  - Формы: RHF + Yup, предпросмотр markdown, загрузка медиа.
  - Авторизация: Telegram Login → верификация → JWT.
  - Интеграции: Яндекс Метрика/Вебвизор/цели.
- Очереди BullMQ:
  - publish: отложенные и массовые отправки с rate-limit и DLQ.
  - analytics: агрегации (ежечасно/ежедневно).
- БД:
  - Индексы, уникальные ключи, soft-delete, TTL.

### 5. Модель данных (MongoDB, коллекции)
1) users  
- Поля: telegramId(unique), username, firstName, lastName, languageCode, isBot, roles[], subscription {plan, expiresAt}, createdAt, lastActivityAt  
- Индексы: telegramId(unique), lastActivityAt(desc)

2) bots  
- Поля: ownerId, title, botUsername(unique), botTokenHash, webhookUrl, isActive, settings {welcomeMessage, menuButtonText, analyticsEnabled, timezone}, permissions [{userId, role}], createdAt  
- Индексы: ownerId, botUsername(unique), permissions.userId

3) bot_subscribers  
- Поля: botId, userId?, telegramId, status('active','blocked','left'), tags[], joinedAt, lastActivityAt  
- Индексы: botId+telegramId(unique), status, tags, lastActivityAt

4) posts  
- Поля: botId, authorId, title, content(Markdown), type('text','image','gallery','poll'), media[{type,fileId,storageKey,caption,order}], buttons[{text,action('url','post','web_app'),value,row}], status('draft','scheduled','published','archived'), scheduledAt, target {requiredTags[], excludeTags[]}, metrics {views, clicks, conversions}, createdAt, updatedAt, deletedAt  
- Индексы: botId+status, scheduledAt, target.requiredTags

5) broadcasts  
- Поля: botId, postId, name, status('scheduled','running','completed','cancelled','failed'), criteria {minSubDays, tags[], excludeSent}, scheduledFor, startedAt, completedAt, stats {totalCandidates, sent, delivered, read, clicked, failed}, logRef  
- Индексы: botId, status, scheduledFor

6) events (сырые)  
- Поля: ts, botId, userTelegramId, type('message','view','click','conversion'), postId, meta  
- Индексы: botId+ts, type, postId

7) analytics_daily (агрегаты)  
- Поля: botId, date(day UTC), metrics {newSubscribers, activeUsers, messagesReceived, messagesSent, postViews, buttonClicks}, topPosts [{postId, views}]  
- Индексы: botId+date(unique)

Примечания:
- Валидация: Yup/Zod на входе API + Mongoose схемы.
- TTL коллекции — для временных токенов/подтверждений (при необходимости).
- Soft-delete: `deletedAt` для постов; фильтровать в запросах по умолчанию.

### 6. API (через Express, JSON, JWT)
Общие:
- База URL админки API: `/api`
- Авторизация: `Authorization: Bearer <jwt>`
- Ответы: `{ data, error: {code, message, details?} }`
- RBAC: доступ по роли и принадлежности к `botId`

Эндпоинты (основные):
- Webhook: `POST /webhook/:botUsername` (секрет в заголовке/пути)
- Боты:
  - `GET /api/bots` — мои боты
  - `POST /api/bots` — добавить токен (валидировать, ставить вебхук)
  - `PUT /api/bots/:id` — обновить настройки
  - `DELETE /api/bots/:id` — деактивировать
- Посты:
  - `GET /api/posts?botId=&status=&q=&page=&limit=`
  - `POST /api/posts` — создать (draft|scheduled|published)
  - `GET /api/posts/:postId`
  - `PUT /api/posts/:postId`
  - `DELETE /api/posts/:postId` — soft-delete
- Рассылки:
  - `GET /api/broadcasts?botId=&status=`
  - `POST /api/broadcasts` — создать/запланировать
  - `POST /api/broadcasts/:id/cancel`
- Аналитика:
  - `GET /api/bot/:botId/stats` — сводка (сегодня/7д/30д)
  - `GET /api/bot/:botId/analytics/daily?from=&to=`
  - `GET /api/post/:postId/metrics`

Коды ошибок:
- 400 (ValidationError), 401 (Unauthorized), 403 (Forbidden), 404 (NotFound), 409 (Conflict), 429 (TooManyRequests), 500 (ServerError)

### 7. Поведение бота (Telegram)
- Команды: `/start`, `/menu`, `/help`, `/stats`
- `/start`: регистрирует подписчика (bot_subscribers), теги/рефы из deep-link
- Кнопки: inline keyboard, callback_data → обработка, события `click`
- Публикация постов: разметка Markdown, медиа пайплайн (file_id / S3)
- Рассылки: батчинг по подписчикам, дедупликация user+post, ретраи с backoff
- Rate-limit: соблюдение ограничений Telegram API (per bot)

### 8. Next.js Mini App (админка)
- Технологии: Next.js 14 (App Router), Radix UI, RHF, Yup, Tailwind, Yandex Metrika
- Страницы:
  - Дашборд: сводные метрики, последние действия
  - Посты: список/фильтры, создание/редактирование, предпросмотр, планирование
  - Боты: добавление, настройки, проверка вебхука/статуса
  - Рассылки: мастер критериев/расписания, прогресс/логи
  - Аналитика: графики по дням/постам, сегменты по тегам
- Формы: RHF + Yup; автосохранение черновиков, предупреждение о несохраненном
- Медиа: drag&drop, загрузка в S3, превью, хранение `fileId` для Telegram
- Метрика: события (создание/публикация/редактирование поста, старт рассылки), цели, вебвизор (по согласию)

### 9. Авторизация и безопасность
- Telegram Login: верификация `hash` (HMAC-SHA256 c bot token), защита от повторов (nonce/ttl)
- JWT: access (≈60 мин) + refresh; access в HttpOnly cookie; logout — ревокация refresh
- RBAC: роли на уровне бота (`bots.permissions`), проверка на каждом запросе
- CSRF: SameSite=Lax/Strict + Bearer для API
- Rate-limit: per IP и per user для админки; per bot/user для webhook
- Секреты: токены ботов — не храним в открытом виде (hash/шифрование), не логируем
- Логи аудита: кто/когда создал/изменил/удалил пост, запустил рассылку, изменил настройки
- Загруженные медиа: приватные, доступ по временным ссылкам

### 10. Очереди и задания (BullMQ/Redis)
- Очередь публикаций: `publish:botId` — плановые и массовые отправки
- Очередь рассылок: построение кандидатов, батчи, прогресс, отчеты
- Очередь аналитики: агрегирование из `events` в `analytics_daily`
- Ретраи: экспоненциальный backoff, DLQ, ручной рестарт
- Мониторинг: bull-board/arena

### 11. Инфраструктура и деплой
- Docker Compose (dev/stage/prod):
  - `mongodb` (volume, бэкапы), `redis`, `bot`, `frontend`, `nginx`
- Домены:
  - `app.<домен>` — админка; `bot.<домен>` — вебхуки
- Nginx: reverse proxy, HTTP/2, gzip/br, SSL (Let’s Encrypt)
- Бэкапы: `mongodump` по расписанию, offsite хранение
- Мониторинг: Uptime + логи (Loki/ELK) + алерты в Telegram
- VPS минимально: 2 vCPU, 4 GB RAM, 50 GB SSD, Ubuntu 22.04+

### 12. Нефункциональные требования
- Производительность: p95 API < 200 мс (без тяжелых операций)
- Доступность: uptime бота ≥ 99%
- Масштабирование:
  - Горизонтально `bot`/`frontend`; Mongo → replica set; Redis → выделение/кластер
  - CDN для медиа; кэш API (Redis)
- Качество:
  - Единый обработчик ошибок; централизованный логгинг
  - Unit/интеграционные/E2E тесты для ключевых сценариев

### 13. Переменные окружения (минимум)
- Общие: `NODE_ENV`, `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `APP_BASE_URL`, `BOT_BASE_URL`
- Bot: `TELEGRAM_BOT_TOKENS` или управление токенами в БД (с KMS/ключом), `WEBHOOK_SECRET`
- Storage: `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `CDN_BASE_URL`
- Metrika: `YANDEX_METRIKA_ID`

### 14. События Яндекс Метрики (пример)
- `post_create`, `post_publish`, `post_edit`, `broadcast_start`, `broadcast_complete`, `auth_login`
- Параметры: `botId`, `postId`, `status`, `role`, `durationMs`

### 15. Правила валидации (Yup, пример для поста)
- title: required, max 100
- content: required, max 4096
- type: oneOf ['text','image','gallery','poll']
- media[]: type oneOf ['photo','video','document'], url/fileId/капшен max 200
- buttons: max 10; action oneOf ['url','post','web_app']

### 16. Критерии приемки (Definition of Done)
- Пользователь может: войти через Telegram, добавить бота, создать/редактировать/удалить пост, опубликовать, запланировать.
- Рассылка: запускается, отображает прогресс, корректно обрабатывает ретраи/ошибки.
- Аналитика: дашборд отдает корректные суммарные метрики и графики по дням.
- Безопасность: токены не хранятся в открытом виде, RBAC соблюдается, rate-limit работает.
- Инфраструктура: HTTPS, бэкапы Mongo, алерты, доступность ≥ 99% (по Uptime).

### 17. План внедрения (MVP)
1) Поднять Docker Compose: Mongo, Redis, Bot, Frontend, Nginx+SSL.  
2) Авторизация: Telegram Login → серверная верификация → JWT (HttpOnly).  
3) CRUD ботов и постов: создание/редактирование/удаление, предпросмотр, загрузка медиа (S3).  
4) Вебхук бота: обработка `/start`, публикация поста вручную, события `view/click`.  
5) Рассылка: простая по всем активным подписчикам, батчинг, прогресс, ретраи.  
6) Аналитика: сырые `events` + агрегаты `analytics_daily`; дашборд.  
7) Операционка: бэкапы, логи, алерты, rate-limit, аудит.  

### 18. Структура репозитория (monorepo)
- `packages/bot` — Express + Telegram webhook + REST API + BullMQ workers
- `packages/webapp` — Next.js App Router + UI + RHF/Yup + метрика
- `infra/` — `docker-compose.yml`, `nginx/`, скрипты бэкапов/миграций
- `docs/` — схемы API, ERD, гайды по деплою

---

Этот документ является источником истины. Любые изменения архитектуры/правил должны фиксироваться в PR с обновлением этого файла.


