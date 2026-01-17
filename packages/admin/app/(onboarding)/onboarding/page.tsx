"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { DEMO_MODE } from "@/lib/features";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Bot,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  Check,
  Rocket,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Crown,
} from "lucide-react";

const steps = [
  { id: "welcome", title: "Добро пожаловать" },
  { id: "bot", title: "Подключите бота" },
  { id: "channel", title: "Укажите канал" },
  { id: "style", title: "Настройте стиль" },
  { id: "ready", title: "Готово!" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    botToken: "",
    channelUsername: "",
    channelForAnalysis: "",
    selectedPlan: "free",
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = () => {
    router.push("/dashboard");
  };

  const skipOnboarding = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-6 py-12">
      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground"
                    : idx === currentStep
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-12 md:w-20 mx-2 transition-colors ${
                    idx < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-xl opacity-50" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">Добро пожаловать в VoiceKeeper!</h1>
                <p className="mt-2 text-muted-foreground">
                  AI-стратег, который поможет создавать контент в вашем уникальном стиле
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-left">
                {[
                  {
                    icon: Fingerprint,
                    title: "Ваш стиль",
                    description: "AI изучит и сохранит ваш уникальный голос",
                  },
                  {
                    icon: TrendingUp,
                    title: "Тренды ниши",
                    description: "Мониторинг конкурентов и горячих тем",
                  },
                  {
                    icon: Zap,
                    title: "Быстрый контент",
                    description: "Генерация постов за 30 секунд",
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-xl border border-border/50 bg-background/50 p-4"
                    >
                      <Icon className="h-6 w-6 text-violet-500 mb-2" />
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={nextStep} className="w-full gap-2" size="lg">
                  Начать настройку
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={skipOnboarding} className="text-muted-foreground">
                  Пропустить и настроить позже
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Bot Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <FeatureIcon icon={Bot} variant="info" size="lg" className="mx-auto mb-4" />
                <h2 className="text-xl font-bold">Подключите Telegram-бота</h2>
                <p className="mt-2 text-muted-foreground">
                  Бот нужен для публикации постов в ваш канал
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-token">Токен бота</Label>
                  <Input
                    id="bot-token"
                    placeholder="7123456789:AAH..."
                    value={formData.botToken}
                    onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                    className="font-mono"
                  />
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-sm">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Как получить токен:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Откройте <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline">@BotFather</a> в Telegram</li>
                    <li>Отправьте команду <code className="bg-muted px-1 rounded">/newbot</code></li>
                    <li>Следуйте инструкциям и скопируйте токен</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                  disabled={!DEMO_MODE && !formData.botToken}
                >
                  Продолжить
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {DEMO_MODE && (
                <p className="text-center text-xs text-muted-foreground">
                  В демо-режиме можно пропустить этот шаг
                </p>
              )}
            </div>
          )}

          {/* Step 3: Channel Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <FeatureIcon icon={Target} variant="success" size="lg" className="mx-auto mb-4" />
                <h2 className="text-xl font-bold">Укажите ваш канал</h2>
                <p className="mt-2 text-muted-foreground">
                  Канал, в который будут публиковаться посты
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="channel">Username канала</Label>
                  <Input
                    id="channel"
                    placeholder="@your_channel"
                    value={formData.channelUsername}
                    onChange={(e) => setFormData({ ...formData, channelUsername: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Не забудьте добавить бота администратором канала
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                  disabled={!DEMO_MODE && !formData.channelUsername}
                >
                  Продолжить
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Voice Fingerprint Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <FeatureIcon icon={Fingerprint} variant="primary" size="lg" className="mx-auto mb-4" />
                <h2 className="text-xl font-bold">Настройте Voice Fingerprint</h2>
                <p className="mt-2 text-muted-foreground">
                  Укажите канал для анализа вашего авторского стиля
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis-channel">Канал для анализа стиля</Label>
                  <Input
                    id="analysis-channel"
                    placeholder="@your_channel или любой публичный канал"
                    value={formData.channelForAnalysis}
                    onChange={(e) => setFormData({ ...formData, channelForAnalysis: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    AI проанализирует последние 50 постов и создаст профиль вашего стиля
                  </p>
                </div>

                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Что анализирует AI:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Структуру и длину постов</li>
                    <li>• Тональность и формальность</li>
                    <li>• Фирменные фразы и обороты</li>
                    <li>• Использование эмодзи и форматирования</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                >
                  {formData.channelForAnalysis ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Ready */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 blur-xl opacity-50" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">Всё готово!</h1>
                <p className="mt-2 text-muted-foreground">
                  Теперь вы можете создавать контент с помощью AI
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-left">
                <h4 className="font-medium mb-3">Ваша конфигурация:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Бот</span>
                    <span>{formData.botToken ? "Подключен ✓" : "Не настроен"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Канал</span>
                    <span>{formData.channelUsername || "Не указан"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Voice Fingerprint</span>
                    <span>{formData.channelForAnalysis ? "Будет создан" : "Не настроен"}</span>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Выберите план:</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { id: "free", name: "Free", price: "0 ₽", features: "3 генерации/мес" },
                    { id: "pro", name: "Pro", price: "750 ₽", features: "50 генераций/мес", popular: true },
                    { id: "business", name: "Business", price: "2 500 ₽", features: "Безлимит" },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                      className={`relative rounded-xl border p-4 text-left transition-all ${
                        formData.selectedPlan === plan.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border/50 hover:border-muted-foreground/50"
                      }`}
                    >
                      {plan.popular && (
                        <Badge variant="gradient" className="absolute -top-2 right-2 text-[10px]">
                          Популярный
                        </Badge>
                      )}
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-lg font-bold">{plan.price}</p>
                      <p className="text-xs text-muted-foreground">{plan.features}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={finishOnboarding} 
                className="w-full gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600" 
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Перейти в Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

