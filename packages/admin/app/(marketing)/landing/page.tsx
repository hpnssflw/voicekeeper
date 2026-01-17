"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { FeatureIcon } from "@/components/brand/feature-icon";
import Link from "next/link";
import {
  Sparkles,
  Fingerprint,
  Radar,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  Check,
  Play,
  Bot,
  BarChart3,
  Clock,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Digital Voice Fingerprint",
    description: "Глубокий NLP-анализ вашего стиля — лексика, структура, эмоциональность. AI запоминает ваш уникальный голос.",
    variant: "primary" as const,
  },
  {
    icon: Radar,
    title: "Trend Radar",
    description: "Мониторинг конкурентов в реальном времени. Выявляем горячие темы и упущенные возможности в вашей нише.",
    variant: "warning" as const,
  },
  {
    icon: Zap,
    title: "Контекстная генерация",
    description: "Создаём посты на стыке тренда и вашего стиля. Не шаблоны — уникальный контент с вашей подписью.",
    variant: "success" as const,
  },
];

const stats = [
  { value: "80%", label: "экономия времени на анализ" },
  { value: "+23%", label: "рост вовлечённости" },
  { value: "3 мин", label: "на создание поста" },
  { value: "97%", label: "соответствие стилю" },
];

const pricing = [
  {
    name: "Free",
    price: "0",
    description: "Для знакомства с платформой",
    features: [
      "3 генерации в месяц",
      "Базовый Voice Fingerprint",
      "1 бот",
    ],
    cta: "Начать бесплатно",
    popular: false,
  },
  {
    name: "Pro",
    price: "750",
    description: "Для активных авторов",
    features: [
      "50 генераций в месяц",
      "Полный Voice Fingerprint",
      "5 ботов",
      "Приоритетная поддержка",
    ],
    cta: "Выбрать Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "2 500",
    description: "Для агентств и команд",
    features: [
      "Безлимит генераций",
      "Trend Radar",
      "Неограниченно ботов",
      "API доступ",
      "Персональный менеджер",
    ],
    cta: "Связаться",
    popular: false,
  },
];

const testimonials = [
  {
    quote: "VoiceKeeper сократил время на создание контента в 3 раза. Посты генерируются в моём стиле — подписчики не отличают от написанного вручную.",
    author: "Алексей К.",
    role: "Автор канала о маркетинге, 45K подписчиков",
  },
  {
    quote: "Trend Radar — это находка. Я вижу, что работает у конкурентов, и могу быстро адаптировать контент-план.",
    author: "Мария С.",
    role: "Контент-маркетолог",
  },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="relative z-50 bg-card/20 backdrop-blur-2xl shadow-[0_1px_0_0_hsl(var(--primary)/0.05)]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Возможности
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Тарифы
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Отзывы
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="sm" variant="gradient" className="gap-2">
                  Регистрация
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="animate-in animate-in-delay-1 inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4 text-red-400" />
              <span className="text-muted-foreground">AI-стратег для Telegram-авторов</span>
            </div>
            
            {/* Headline */}
            <h1 className="animate-in animate-in-delay-2 text-display mb-5">
              Контент, который{" "}
              <span className="gradient-text">звучит как вы</span>
            </h1>
            
            {/* Subheadline */}
            <p className="animate-in animate-in-delay-3 text-body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              VoiceKeeper анализирует ваш уникальный стиль, отслеживает тренды в нише и создаёт посты, которые невозможно отличить от написанных вами.
            </p>
            
            {/* CTA Buttons */}
            <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link href="/onboarding">
                <Button size="lg" variant="gradient" className="gap-2 h-11 px-6 gradient-glow">
                  <Sparkles className="h-4 w-4" />
                  Попробовать бесплатно
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="glass" size="lg" className="gap-2 h-11 px-6">
                  <Play className="h-4 w-4" />
                  Войти в аккаунт
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="animate-in animate-in-delay-4 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/[0.02]">
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-3">
              Три плоскости в одном инструменте
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Объединяем анализ стиля, конкурентную аналитику и генерацию контента
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-card/30 backdrop-blur-xl p-6 card-hover shadow-[0_0_0_1px_hsl(var(--primary)/0.03),0_8px_32px_-8px_hsl(0_0%_0%/0.25)]"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <FeatureIcon
                  icon={feature.icon}
                  variant={feature.variant}
                  size="lg"
                  glow
                  className="mb-5"
                />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-3">Как это работает</h2>
            <p className="text-body text-muted-foreground">
              Три шага до контента, который работает
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Fingerprint,
                title: "Анализируем ваш стиль",
                description: "Загрузите посты или укажите канал — AI изучит вашу лексику, структуру и тональность",
              },
              {
                step: "02",
                icon: Target,
                title: "Выбираете тему",
                description: "Из горячих трендов или своя идея — мы подберём подходящий угол подачи",
              },
              {
                step: "03",
                icon: Zap,
                title: "Получаете пост",
                description: "Готовый текст в вашем стиле за 30 секунд. Правьте и публикуйте",
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-3">Выберите свой план</h2>
            <p className="text-body text-muted-foreground">
              Начните бесплатно, масштабируйтесь по мере роста
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.popular
                    ? "bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_8px_32px_-8px_hsl(var(--primary)/0.2)]"
                    : "bg-card/30 backdrop-blur-xl shadow-[0_0_0_1px_hsl(var(--primary)/0.03),0_8px_32px_-8px_hsl(0_0%_0%/0.25)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-red-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-red-500/25">
                      Популярный
                    </span>
                  </div>
                )}
                
                <div className="mb-5">
                  <h3 className="font-semibold mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
                
                <div className="mb-5">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm"> ₽/мес</span>
                </div>
                
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-20 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-3">Что говорят авторы</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-card/30 backdrop-blur-xl p-6 shadow-[0_0_0_1px_hsl(var(--primary)/0.03),0_8px_32px_-8px_hsl(0_0%_0%/0.25)]"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm mb-5 text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-medium text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-b from-primary/5 to-transparent p-10 md:p-12 shadow-[inset_0_1px_0_0_hsla(0,0%,100%,0.03)]">
            <h2 className="text-headline mb-3">
              Готовы создавать контент быстрее?
            </h2>
            <p className="text-body text-muted-foreground mb-6 max-w-xl mx-auto">
              Присоединяйтесь к авторам, которые уже экономят 80% времени на создание постов
            </p>
            <Link href="/onboarding">
              <Button size="lg" variant="gradient" className="gap-2 h-11 px-6">
                <Sparkles className="h-4 w-4" />
                Начать бесплатно
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Документация</a>
              <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
              <a href="#" className="hover:text-foreground transition-colors">Telegram</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 VoiceKeeper
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
