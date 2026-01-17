# Использование i18n в VoiceKeeper

## Быстрый старт

### 1. Установка
```bash
cd packages/admin
npm install next-intl
```

### 2. Использование в компонентах

#### Client Components
```tsx
"use client";

import { useTranslations } from "@/lib/use-translations";

export function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.greeting", { name: "John" })}</p>
    </div>
  );
}
```

#### Server Components
```tsx
import { getTranslations } from "@/lib/i18n";

export async function MyServerComponent() {
  const t = await getTranslations();
  
  return <h1>{t("dashboard.title")}</h1>;
}
```

### 3. Добавление новых переводов

1. Откройте `messages/ru.json` и `messages/en.json`
2. Добавьте ключ в нужную секцию:
```json
{
  "mySection": {
    "myKey": "Мой текст"
  }
}
```
3. Используйте в компоненте: `t("mySection.myKey")`

### 4. Переключение языка

Переключатель языка уже добавлен в Header. Язык сохраняется в cookies и автоматически определяется при следующем визите.

## Структура переводов

- `common.*` - общие элементы (кнопки, действия)
- `navigation.*` - навигация и меню
- `dashboard.*` - главная страница
- `bots.*` - управление ботами
- `settings.*` - настройки
- `voicekeeper.*` - AI инструменты
- `toasts.*` - уведомления
- `errors.*` - сообщения об ошибках

## Форматирование

### Параметры
```tsx
t("dashboard.greeting", { name: user.firstName })
// "Привет, John" или "Hello, John"
```

### Плюрализация (TODO)
Для русского языка можно добавить поддержку плюрализации:
```tsx
t("posts.count", { count: 5 })
// "5 постов" или "5 posts"
```

## Файлы

- `messages/ru.json` - русские переводы
- `messages/en.json` - английские переводы
- `lib/use-translations.ts` - хук для client components
- `lib/i18n.ts` - утилиты для server components
- `lib/locale-client.ts` - управление локалью в браузере
- `components/i18n/locale-switcher.tsx` - переключатель языка

## Примечания

- Все переводы загружаются динамически
- Язык определяется из cookies или браузера
- Fallback на русский если перевод не найден
- Ключи переводов должны совпадать в обоих файлах

