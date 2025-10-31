## Project Architecture and Folder Structure

This document describes the monorepo layout, components, and responsibilities for the Telegram funnel platform.

### Monorepo Layout

Root
- `docs/` — Documentation (technical spec, architecture, API references)
- `packages/`
  - `bot/` — Express Telegram Bot + REST API + workers
  - `webapp/` — Next.js Mini App (admin UI)
- `infra/`
  - `nginx/` — Nginx configs and templates
  - `scripts/` — backup, migrate, utility scripts
  - `docker-compose.yml` — local/dev stack
- `.gitignore` — repository ignore rules
- `package.json` — monorepo config (npm workspaces)
- `README.md` — root project overview

### Responsibilities by Package

`packages/bot`
- Express server for Telegram webhook (`/webhook/:botUsername`)
- REST API for admin app (`/api/...`)
- BullMQ workers for publishing, broadcasts, analytics aggregation
- MongoDB models (Mongoose)
- Configuration via environment variables

`packages/webapp`
- Next.js App Router admin app
- Radix UI components, React Hook Form + Yup validation
- Yandex Metrika integration (optional)
- Pages: Dashboard, Posts, Bots, Broadcasts, Analytics

### Infra Overview

`infra/docker-compose.yml`
- `mongodb` with volume
- `redis`
- `bot` service (depends_on: mongodb, redis)
- `frontend` service
- `nginx` reverse proxy with SSL termination (in prod via separate setup)

`infra/nginx/`
- `nginx.conf` (template)
- Site configs for `app.<domain>` and `bot.<domain>`

### Environment Variables (root-level examples)

- `MONGO_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `APP_BASE_URL`
- `BOT_BASE_URL`
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `CDN_BASE_URL`
- `YANDEX_METRIKA_ID`

### Code Conventions

- TypeScript for both `bot` and `frontend`
- Linting/formatting to be added later (ESLint/Prettier)
- Centralized error handling in `bot`
- API returns `{ data, error }`

### MVP Scaffolding Plan

1) Create repo structure (docs, packages, infra)
2) Initialize monorepo `package.json` with workspaces
3) Placeholder entrypoints for `bot` and `frontend`
4) Minimal `docker-compose.yml` (MongoDB, Redis, bot, frontend, nginx placeholders)
5) Prepare install/init commands


