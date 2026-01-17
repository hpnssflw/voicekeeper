# Mobile-First Design Guide

Данное руководство описывает mobile-first подход, используемый в проекте VoiceKeeper.

## 📱 Принципы Mobile-First

### 1. Базовая версия для мобильных

Все стили начинаются с мобильной версии, затем расширяются для больших экранов:

```css
/* ❌ Плохо (Desktop-first) */
.element {
  width: 1000px;
}
@media (max-width: 768px) {
  .element {
    width: 100%;
  }
}

/* ✅ Хорошо (Mobile-first) */
.element {
  width: 100%;
}
@media (min-width: 768px) {
  .element {
    width: 1000px;
  }
}
```

### 2. Tailwind CSS Mobile-First

В проекте используется Tailwind CSS с mobile-first подходом:

```tsx
// Базовый стиль для мобильных
<div className="text-sm p-4">
  Content
</div>

// Расширение для больших экранов
<div className="text-sm p-4 sm:text-base md:p-6 lg:p-8">
  Content
</div>
```

### 3. Breakpoints

| Breakpoint | Размер | Использование |
|------------|--------|---------------|
| `sm:` | 640px+ | Планшеты (портрет) |
| `md:` | 768px+ | Планшеты (альбом) |
| `lg:` | 1024px+ | Десктопы |
| `xl:` | 1280px+ | Большие десктопы |
| `2xl:` | 1536px+ | Очень большие экраны |

## 🎨 Компоненты

### Typography (Mobile-First)

```tsx
// globals.css
.text-display {
  @apply text-4xl font-bold;        // Mobile
  @apply sm:text-5xl;                // Tablet
  @apply md:text-6xl;                // Desktop
  @apply lg:text-7xl;                // Large Desktop
}
```

### Buttons

Кнопки имеют увеличенные размеры на мобильных для лучшего touch target:

```tsx
// button.tsx
size: {
  default: "h-11 px-4 py-2.5 sm:h-10 sm:px-4 sm:py-2",  // 44px на мобильных
  sm: "h-10 px-3 text-xs sm:h-9",
  lg: "h-14 px-6 text-base sm:h-12 sm:px-8",
}
```

### Cards

Карточки имеют меньшие отступы на мобильных:

```tsx
// card.tsx
<CardHeader className="p-4 sm:p-6">  // 16px на мобильных, 24px на десктопе
  Content
</CardHeader>
```

### Inputs

Поля ввода увеличены на мобильных для лучшей читаемости:

```tsx
// input.tsx
<input className="h-11 text-base sm:h-10 sm:text-sm" />
```

## 📐 Touch Targets

Все интерактивные элементы должны иметь минимальный размер 44x44px на мобильных:

```css
/* globals.css */
@media (max-width: 640px) {
  button:not(.no-touch-target),
  a:not(.no-touch-target) {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## 🧭 Навигация

### Sidebar (Mobile Drawer)

На мобильных устройствах sidebar скрыт по умолчанию и открывается как drawer:

```tsx
// sidebar.tsx
<aside
  className={cn(
    "fixed lg:sticky top-0 left-0 h-screen",
    "transform transition-transform",
    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  )}
>
```

### Header (Mobile Menu Button)

Header содержит кнопку меню на мобильных:

```tsx
// header.tsx
<Button
  onClick={onMenuClick}
  className="lg:hidden"  // Скрыта на десктопе
>
  <Menu />
</Button>
```

## 📊 Grid Layouts

Используйте адаптивные grid'ы:

```tsx
// 1 колонка на мобильных, 2 на планшетах, 3 на десктопе
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

## 🎯 Best Practices

### 1. Скрытие элементов на мобильных

```tsx
// Скрыть на мобильных
<div className="hidden sm:block">Desktop only</div>

// Показать только на мобильных
<div className="sm:hidden">Mobile only</div>
```

### 2. Адаптивные отступы

```tsx
// Меньшие отступы на мобильных
<div className="p-4 sm:p-6 lg:p-8">
  Content
</div>
```

### 3. Адаптивный текст

```tsx
// Меньший размер текста на мобильных
<p className="text-sm sm:text-base lg:text-lg">
  Content
</p>
```

### 4. Адаптивные изображения

```tsx
<img
  src="image.jpg"
  className="w-full h-auto"
  alt="Description"
/>
```

### 5. Горизонтальный скролл (избегайте)

```css
/* globals.css */
body {
  overflow-x: hidden;  // Предотвращает горизонтальный скролл
}
```

## 🧪 Тестирование

### Chrome DevTools

1. Откройте DevTools (F12)
2. Включите Device Toolbar (Ctrl+Shift+M)
3. Выберите устройство или задайте размер
4. Проверьте все breakpoints

### Рекомендуемые устройства для тестирования

- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- iPhone 14 Pro Max (430px)
- iPad (768px)
- Desktop (1024px+)

## 📝 Чеклист

- [ ] Все компоненты протестированы на мобильных устройствах
- [ ] Touch targets минимум 44x44px
- [ ] Нет горизонтального скролла
- [ ] Текст читаем на всех размерах экрана
- [ ] Навигация работает на мобильных
- [ ] Формы удобны для заполнения на мобильных
- [ ] Изображения адаптивны
- [ ] Анимации плавные на мобильных

## 🔗 Полезные ссылки

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First Design Principles](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

