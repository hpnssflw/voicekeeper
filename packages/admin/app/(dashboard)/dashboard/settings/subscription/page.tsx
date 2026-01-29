"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, toast } from "@/ui";
import { DEMO_MODE } from "@/shared/lib/features";
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Building,
  TrendingUp,
  Users,
  Fingerprint,
  Radar,
  MessageSquare,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "навсегда",
    description: "Для знакомства с платформой",
    features: [
      { text: "3 AI генерации в месяц", included: true },
      { text: "1 бот", included: true },
      { text: "Voice Fingerprint", included: true },
      { text: "Trend Radar", included: false },
      { text: "Приоритетная поддержка", included: false },
    ],
    cta: "Текущий план",
    disabled: true,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "750",
    period: "в месяц",
    description: "Для активных авторов и блогеров",
    features: [
      { text: "50 AI генераций в месяц", included: true },
      { text: "До 5 ботов", included: true },
      { text: "Voice Fingerprint", included: true },
      { text: "Trend Radar (3 конкурента)", included: true },
      { text: "Email поддержка", included: true },
    ],
    cta: "Перейти на Pro",
    disabled: false,
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "2 500",
    period: "в месяц",
    description: "Для агентств и команд",
    features: [
      { text: "Безлимит AI генераций", included: true },
      { text: "Безлимит ботов", included: true },
      { text: "Voice Fingerprint", included: true },
      { text: "Trend Radar (10 конкурентов)", included: true },
      { text: "Приоритетная поддержка 24/7", included: true },
      { text: "API доступ", included: true },
      { text: "Командные аккаунты", included: true },
    ],
    cta: "Перейти на Business",
    disabled: false,
    popular: false,
  },
];

const featureIcons: Record<string, any> = {
  "AI генерации": Sparkles,
  "бот": MessageSquare,
  "Voice Fingerprint": Fingerprint,
  "Trend Radar": Radar,
  "поддержка": Users,
  "API": Zap,
  "Командные": Building,
};

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (DEMO_MODE) {
      toast({
        title: "Демо-режим",
        description: "Оплата недоступна в демо-режиме",
        variant: "warning",
      });
      return;
    }

    setIsLoading(planId);
    toast({ title: "Переходим к оплате...", description: "Подождите" });

    // Simulated payment redirect
    setTimeout(() => {
      setIsLoading(null);
      toast({
        title: "Открываем платёжную страницу",
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Тарифные планы</h1>
        <p className="text-muted-foreground mt-2">
          Выберите план, который подходит именно вам
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
              plan.popular
                ? "border-violet-500/50 ring-2 ring-violet-500/20 scale-105"
                : ""
            } ${currentPlan === plan.id ? "ring-2 ring-primary/50" : ""}`}
          >
            {plan.popular && (
              <Badge
                variant="gradient"
                className="absolute -top-3 left-1/2 -translate-x-1/2"
              >
                Популярный
              </Badge>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.id === "business" && <Building className="h-5 w-5" />}
                {plan.id === "pro" && <Crown className="h-5 w-5 text-violet-500" />}
                {plan.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price} ₽</span>
                <span className="text-muted-foreground"> {plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        feature.included
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground line-through"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.disabled || isLoading === plan.id}
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {isLoading === plan.id ? "Загрузка..." : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Сравнение возможностей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left font-medium">Функция</th>
                  <th className="px-4 py-3 text-center font-medium">Free</th>
                  <th className="px-4 py-3 text-center font-medium text-violet-500">Pro</th>
                  <th className="px-4 py-3 text-center font-medium">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  ["AI генерации", "3/мес", "50/мес", "∞"],
                  ["Боты", "1", "5", "∞"],
                  ["Voice Fingerprint", "✓", "✓", "✓"],
                  ["Trend Radar", "—", "3 конк.", "10 конк."],
                  ["Рассылки", "100/мес", "5000/мес", "∞"],
                  ["API", "—", "—", "✓"],
                  ["Поддержка", "Сообщество", "Email", "24/7"],
                ].map(([feature, free, pro, business]) => (
                  <tr key={feature} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">{feature}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{free}</td>
                    <td className="px-4 py-3 text-center">{pro}</td>
                    <td className="px-4 py-3 text-center">{business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Частые вопросы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: "Как происходит оплата?",
              a: "Мы принимаем банковские карты, ЮMoney и криптовалюту. Оплата автоматически продлевается каждый месяц.",
            },
            {
              q: "Можно ли перейти на другой план?",
              a: "Да, вы можете повысить или понизить план в любой момент. При повышении — разница списывается сразу.",
            },
            {
              q: "Что будет с данными при отмене подписки?",
              a: "Ваши данные сохраняются 30 дней. После этого боты перестают работать, но данные остаются.",
            },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="font-medium">{item.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

