"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@/ui";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  FileText,
  Users,
  Radio,
  Megaphone,
  Key,
  Fingerprint,
  Radar,
  Zap,
  Settings,
  CreditCard,
  User,
  ArrowRight,
  Check,
  Crown,
} from "lucide-react";

const features = [
  {
    category: "Управление ботами",
    items: [
      {
        title: "Боты",
        description: "Подключение и управление Telegram-ботами. Добавление токенов, настройка каналов для публикации, мониторинг активности.",
        icon: Bot,
        href: "/dashboard/bots",
        available: true,
      },
      {
        title: "Каналы",
        description: "Отслеживание Telegram-каналов для анализа контента конкурентов. Парсинг постов через MTProto API.",
        icon: Radio,
        href: "/dashboard/channels",
        available: true,
      },
    ],
  },
  {
    category: "Контент",
    items: [
      {
        title: "Посты",
        description: "Создание, редактирование и публикация постов. Поддержка Markdown, предпросмотр, планирование публикаций.",
        icon: FileText,
        href: "/dashboard/posts",
        available: true,
      },
      {
        title: "Рассылки",
        description: "Массовая отправка сообщений подписчикам. Планирование, сегментация аудитории, аналитика доставки.",
        icon: Megaphone,
        href: "/dashboard/broadcasts",
        available: true,
        premium: true,
      },
      {
        title: "Подписчики",
        description: "Управление базой подписчиков, сегментация, тегирование, аналитика активности пользователей.",
        icon: Users,
        href: "/dashboard/subscribers",
        available: true,
        premium: true,
      },
    ],
  },
  {
    category: "AI инструменты",
    items: [
      {
        title: "VoiceKeeper",
        description: "Главный AI-инструмент для генерации контента в вашем уникальном стиле.",
        icon: Sparkles,
        href: "/dashboard/voicekeeper",
        available: true,
      },
      {
        title: "AI Генерация",
        description: "Создание постов с помощью Gemini AI. Настройка тона, длины, эмодзи, призывов к действию. Использование Voice Fingerprint для персонализации.",
        icon: Zap,
        href: "/dashboard/voicekeeper/generate",
        available: true,
      },
      {
        title: "Voice Fingerprint",
        description: "Анализ вашего авторского стиля на основе примеров постов или каналов. AI определяет тональность, структуру, словарь и фишки стиля.",
        icon: Fingerprint,
        href: "/dashboard/voicekeeper/fingerprint",
        available: true,
      },
      {
        title: "Trend Radar",
        description: "Мониторинг конкурентов и выявление горячих тем в вашей нише. Анализ популярных постов, трендовых хештегов и контент-стратегий.",
        icon: Radar,
        href: "/dashboard/trends",
        available: true,
        premium: true,
      },
    ],
  },
  {
    category: "Настройки",
    items: [
      {
        title: "API Ключи",
        description: "Настройка ключей для AI-провайдеров (Gemini, OpenAI). Ключи хранятся локально в браузере.",
        icon: Key,
        href: "/dashboard/settings/api-keys",
        available: true,
      },
      {
        title: "Подписка",
        description: "Управление тарифным планом. Free (3 генерации/мес), Pro (50 генераций/мес), Business (безлимит).",
        icon: CreditCard,
        href: "/dashboard/settings/subscription",
        available: true,
      },
      {
        title: "Профиль",
        description: "Редактирование данных аккаунта, имени, email, Telegram-профиля.",
        icon: User,
        href: "/dashboard/settings/profile",
        available: true,
      },
      {
        title: "Уведомления",
        description: "Настройка оповещений о публикациях, рассылках и важных событиях.",
        icon: Settings,
        href: null,
        available: false,
      },
      {
        title: "Безопасность",
        description: "Двухфакторная аутентификация, управление сессиями, история входов.",
        icon: Settings,
        href: null,
        available: false,
      },
    ],
  },
];

const plans = [
  {
    name: "Free",
    price: "0₽",
    generations: 3,
    features: ["Базовое управление ботами", "Создание постов", "3 AI генерации/мес"],
  },
  {
    name: "Pro",
    price: "990₽",
    generations: 50,
    features: ["Всё из Free", "50 AI генераций/мес", "Trend Radar", "Рассылки", "Управление подписчиками"],
    badge: "Популярный",
  },
  {
    name: "Business",
    price: "4990₽",
    generations: "∞",
    features: ["Всё из Pro", "Безлимитные генерации", "Приоритетная поддержка", "API доступ"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight font-display">Функционал VoiceKeeper</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Полное описание возможностей платформы
        </p>
      </div>

      {/* Features by Category */}
      <div className="space-y-6">
        {features.map((category) => (
          <div key={category.category}>
            <h2 className="text-sm font-semibold font-display mb-3 text-muted-foreground uppercase tracking-wider">
              {category.category}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {category.items.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="p-4 hover:bg-[hsl(15,12%,10%)] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
                        <Icon className="h-4 w-4 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium">{feature.title}</h3>
                          {'premium' in feature && feature.premium && (
                            <Badge variant="secondary" className="text-[9px] px-1.5">
                              <Crown className="h-2.5 w-2.5 mr-0.5" />
                              Pro
                            </Badge>
                          )}
                          {!feature.available && (
                            <Badge variant="outline" className="text-[9px] px-1.5">Soon</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {feature.description}
                        </p>
                        {feature.available && feature.href && (
                          <Link href={feature.href}>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-orange-400 hover:text-orange-300">
                              Открыть <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <Card className="p-4 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-base font-display">Тарифные планы</CardTitle>
          <CardDescription className="text-xs">
            Выберите план, который подходит вам
          </CardDescription>
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-3 mt-4">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold capitalize">{plan.name}</h3>
                {plan.badge && (
                  <Badge variant="gradient" className="text-[9px] px-1.5">{plan.badge}</Badge>
                )}
              </div>
              <div className="mb-3">
                <span className="text-lg font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">/мес</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/settings/subscription">
                <Button 
                  variant={plan.name === "Free" ? "outline" : "default"} 
                  size="sm" 
                  className="w-full text-xs"
                >
                  {plan.name === "Free" ? "Текущий" : "Выбрать"}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </Card>

      {/* Quick Links */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Быстрые ссылки</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/dashboard/voicekeeper/generate">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Zap className="h-3 w-3" />
              Создать пост
            </Button>
          </Link>
          <Link href="/dashboard/bots">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Bot className="h-3 w-3" />
              Добавить бота
            </Button>
          </Link>
          <Link href="/dashboard/settings/api-keys">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Key className="h-3 w-3" />
              API ключи
            </Button>
          </Link>
          <Link href="/dashboard/settings/subscription">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Crown className="h-3 w-3" />
              Подписка
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

