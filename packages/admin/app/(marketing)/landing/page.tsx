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
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-grid opacity-[0.02] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
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
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="sm" className="gap-2">
                  Начать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="animate-in animate-in-delay-1 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm mb-8">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span>AI-стратег для Telegram-авторов</span>
            </div>
            
            {/* Headline */}
            <h1 className="animate-in animate-in-delay-2 text-display mb-6">
              Контент, который{" "}
              <span className="gradient-text">звучит как вы</span>
            </h1>
            
            {/* Subheadline */}
            <p className="animate-in animate-in-delay-3 text-body-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              VoiceKeeper анализирует ваш уникальный стиль, отслеживает тренды в нише и создаёт посты, которые невозможно отличить от написанных вами.
            </p>
            
            {/* CTA Buttons */}
            <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/onboarding">
                <Button size="lg" className="gap-2 h-12 px-8 gradient-glow">
                  <Sparkles className="h-5 w-5" />
                  Попробовать бесплатно
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-8">
                  <Play className="h-5 w-5" />
                  Смотреть демо
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="animate-in animate-in-delay-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">
              Три плоскости в одном инструменте
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Объединяем анализ стиля, конкурентную аналитику и генерацию контента
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <FeatureIcon
                  icon={feature.icon}
                  variant={feature.variant}
                  size="lg"
                  glow
                  className="mb-6"
                />
                <h3 className="text-title mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                {/* Hover gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Как это работает</h2>
            <p className="text-body-lg text-muted-foreground">
              Три шага до контента, который работает
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-8">
                    <ChevronRight className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Выберите свой план</h2>
            <p className="text-body-lg text-muted-foreground">
              Начните бесплатно, масштабируйтесь по мере роста
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-primary bg-primary/5 gradient-border"
                    : "border-border/50 bg-card/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Популярный
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> ₽/мес</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Что говорят авторы</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-card/50 p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-lg mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-primary/5 to-transparent p-12 md:p-16">
            <h2 className="text-headline mb-4">
              Готовы создавать контент быстрее?
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Присоединяйтесь к авторам, которые уже экономят 80% времени на создание постов
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="gap-2 h-12 px-8">
                <Sparkles className="h-5 w-5" />
                Начать бесплатно
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Документация</a>
              <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
              <a href="#" className="hover:text-foreground transition-colors">Telegram</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 VoiceKeeper. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

