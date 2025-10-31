## Bot Package Structure and Conventions

This document defines the folder layout and practices for `packages/bot`.

### Goals
- Separation of concerns (routing, controllers, services, repositories)
- Testable units and clear dependencies
- Ease of adding features (posts, bots, broadcasts, analytics)

### Directory Layout (src)

```
src/
  app.ts                # Express app factory (middlewares, routes)
  index.ts              # Entrypoint (bootstrap server)

  config/
    env.ts              # Environment loading and validation

  routes/
    index.ts            # Mount all routers
    posts.routes.ts     # /api/posts
    bots.routes.ts      # /api/bots
    broadcasts.routes.ts# /api/broadcasts

  controllers/
    posts.controller.ts
    bots.controller.ts
    broadcasts.controller.ts

  services/
    posts.service.ts
    bots.service.ts
    broadcasts.service.ts

  repositories/
    posts.repo.ts
    bots.repo.ts
    subscribers.repo.ts

  models/
    Post.ts
    Bot.ts
    Subscriber.ts

  middlewares/
    auth.ts             # JWT/RBAC
    errorHandler.ts     # Centralized error handling
    rateLimit.ts        # Per IP/user limits

  validators/
    posts.schema.ts     # Zod schemas
    bots.schema.ts

  webhooks/
    telegram.ts         # Telegraf webhook wiring

  queues/
    index.ts            # BullMQ connection and queues
    publish.queue.ts

  jobs/
    publishPost.job.ts  # Workers and processors

  utils/
    logger.ts           # Pino/winston wrapper

  types/
    index.d.ts          # Shared types if needed
```

### Layering Rules
- Routes → Controllers → Services → Repositories → Models
- Controllers contain no business logic; Services are pure business flows
- Repositories are the only layer touching Mongoose
- Middlewares handle cross-cutting (auth, rate limit, validation)
- Zod validates all inputs at route boundaries

### Error Handling
- Throw typed errors in services (e.g., `NotFoundError`), map in `errorHandler`
- API shape: `{ data, error: { code, message, details? } }`

### Configuration
- All configuration loaded via `config/env.ts` with defaults and validation

### Telemetry
- Add request logging and basic metrics counters (later)


