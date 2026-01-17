"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  User,
  Mail,
  Lock,
  AtSign,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const steps = [
  { id: "register", title: "Регистрация" },
  { id: "bot", title: "Подключите бота" },
  { id: "channel", title: "Укажите канал" },
  { id: "style", title: "Настройте стиль" },
  { id: "plan", title: "Выберите план" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded, register, completeOnboarding, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Registration
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    telegramUsername: "",
    // Bot setup
    botToken: "",
    // Channel
    channelUsername: "",
    channelForAnalysis: "",
    // Plan
    selectedPlan: "free" as "free" | "pro" | "business",
  });

  // Redirect if already authenticated and onboarded
  useEffect(() => {
    if (!authLoading && isAuthenticated && isOnboarded) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, isOnboarded, router]);

  // Skip registration step if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [authLoading, isAuthenticated, currentStep]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Registration validation
      if (!formData.email) {
        newErrors.email = "Email обязателен";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Неверный формат email";
      }
      
      if (!formData.firstName) {
        newErrors.firstName = "Имя обязательно";
      }
      
      if (!formData.password) {
        newErrors.password = "Пароль обязателен";
      } else if (formData.password.length < 6) {
        newErrors.password = "Минимум 6 символов";
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    
    // Handle registration on first step
    if (currentStep === 0 && !isAuthenticated) {
      setIsLoading(true);
      try {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          telegramUsername: formData.telegramUsername,
        });
      } catch (error) {
        setErrors({ email: "Ошибка регистрации. Попробуйте снова." });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > (isAuthenticated ? 1 : 0)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding({
        botToken: formData.botToken,
        channelUsername: formData.channelUsername,
        channelForAnalysis: formData.channelForAnalysis,
        selectedPlan: formData.selectedPlan,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated) {
        // Quick registration for skip
        await register({
          email: `user${Date.now()}@voicekeeper.local`,
          password: "demo123456",
          firstName: "User",
        });
      }
      await completeOnboarding({
        selectedPlan: "free",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Skip failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : idx === currentStep
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                    : "bg-white/[0.05] text-muted-foreground"
                }`}
              >
                {idx < currentStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 md:w-12 mx-1 transition-colors rounded-full ${
                    idx < currentStep ? "bg-primary" : "bg-white/[0.05]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-xl">
        <CardContent className="p-6">
          {/* Step 1: Registration */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/lips.png"
                      alt="VoiceKeeper"
                      fill
                      className="object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                    />
                  </div>
                </div>
                <h2 className="text-lg font-bold font-display">
                  Добро пожаловать в <span className="gradient-text">VoiceKeeper</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Заполните данные для регистрации
                </p>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm">Имя *</Label>
                    <Input
                      id="firstName"
                      placeholder="Иван"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm">Фамилия</Label>
                    <Input
                      id="lastName"
                      placeholder="Иванов"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                {/* Telegram username */}
                <div className="space-y-1.5">
                  <Label htmlFor="telegramUsername" className="text-sm">Telegram username</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telegramUsername"
                      placeholder="username"
                      value={formData.telegramUsername}
                      onChange={(e) => updateField("telegramUsername", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">Пароль *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 6 символов"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm">Подтвердите пароль *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={nextStep} 
                  className="w-full gap-2" 
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Продолжить
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={skipOnboarding} 
                  className="text-muted-foreground text-sm"
                  disabled={isLoading}
                >
                  Пропустить и настроить позже
                </Button>
              </div>
              
              <p className="text-center text-xs text-muted-foreground">
                Уже есть аккаунт?{" "}
                <button 
                  onClick={() => router.push("/login")} 
                  className="text-primary hover:underline"
                >
                  Войти
                </button>
              </p>
            </div>
          )}

          {/* Step 2: Bot Setup */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <FeatureIcon icon={Bot} variant="info" size="lg" className="mx-auto mb-3" />
                <h2 className="text-lg font-bold font-display">Подключите Telegram-бота</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Бот нужен для публикации постов в ваш канал
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bot-token" className="text-sm">Токен бота</Label>
                  <Input
                    id="bot-token"
                    placeholder="7123456789:AAH..."
                    value={formData.botToken}
                    onChange={(e) => updateField("botToken", e.target.value)}
                    className="font-mono text-sm"
                  />
                  {/* Quick hint for testing */}
                  <p className="text-xs text-emerald-400/80 mt-1">
                    💡 Тестовый токен: <code className="bg-emerald-500/10 px-1.5 py-0.5 rounded cursor-pointer hover:bg-emerald-500/20" onClick={() => updateField("botToken", "7819471498:AAG6rlm5hZJGLmJfcRO5FhTNi0mmbCMvbKI")}>7819471498:AAG6rlm5hZJGLmJfcRO5FhTNi0mmbCMvbKI</code>
                  </p>
                </div>

                <div className="rounded-xl bg-white/[0.03] p-4 text-sm">
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    Как получить токен:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                    <li>Откройте <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline">@BotFather</a> в Telegram</li>
                    <li>Отправьте команду <code className="bg-white/[0.05] px-1 rounded">/newbot</code></li>
                    <li>Следуйте инструкциям и скопируйте токен</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="gap-2" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {formData.botToken ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Channel Setup */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <FeatureIcon icon={Target} variant="success" size="lg" className="mx-auto mb-3" />
                <h2 className="text-lg font-bold font-display">Укажите ваш канал</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Канал, в который будут публиковаться посты
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="channel" className="text-sm">Username канала</Label>
                  <Input
                    id="channel"
                    placeholder="@your_channel"
                    value={formData.channelUsername}
                    onChange={(e) => updateField("channelUsername", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Не забудьте добавить бота администратором канала
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="gap-2" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {formData.channelUsername ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Voice Fingerprint Setup */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <FeatureIcon icon={Fingerprint} variant="primary" size="lg" className="mx-auto mb-3" />
                <h2 className="text-lg font-bold font-display">Настройте Voice Fingerprint</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Укажите канал для анализа вашего авторского стиля
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="analysis-channel" className="text-sm">Канал для анализа стиля</Label>
                  <Input
                    id="analysis-channel"
                    placeholder="@your_channel или любой публичный канал"
                    value={formData.channelForAnalysis}
                    onChange={(e) => updateField("channelForAnalysis", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    AI проанализирует последние 50 постов
                  </p>
                </div>

                <div className="rounded-xl bg-red-500/[0.06] p-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-red-400" />
                    Что анализирует AI:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Структуру и длину постов</li>
                    <li>• Тональность и формальность</li>
                    <li>• Фирменные фразы и обороты</li>
                    <li>• Использование эмодзи</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="gap-2" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {formData.channelForAnalysis ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Plan Selection & Finish */}
          {currentStep === 4 && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 blur-xl opacity-40" />
                </div>
              </div>
              
              <div>
                <h1 className="text-xl font-bold font-display">Выберите план</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Начните бесплатно, масштабируйтесь по мере роста
                </p>
              </div>

              {/* Plan Selection */}
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { id: "free" as const, name: "Free", price: "0 ₽", features: ["3 генерации/мес", "1 бот", "Базовый анализ"] },
                  { id: "pro" as const, name: "Pro", price: "750 ₽", features: ["50 генераций/мес", "5 ботов", "Voice Fingerprint"], popular: true },
                  { id: "business" as const, name: "Business", price: "2 500 ₽", features: ["Безлимит", "∞ ботов", "API доступ"] },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                    className={`relative rounded-xl p-4 text-left transition-all ${
                      formData.selectedPlan === plan.id
                        ? "bg-primary/10 shadow-[0_0_0_2px_hsl(var(--primary)/0.3)]"
                        : "bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    {plan.popular && (
                      <Badge variant="gradient" className="absolute -top-2 right-2 text-[9px] px-1.5 py-0">
                        Популярный
                      </Badge>
                    )}
                    <p className="font-semibold font-display">{plan.name}</p>
                    <p className="text-xl font-bold mt-1">{plan.price}<span className="text-xs font-normal text-muted-foreground">/мес</span></p>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={prevStep} className="gap-2" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Назад
                </Button>
                <Button 
                  onClick={finishOnboarding} 
                  className="flex-1 gap-2"
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Начать работу
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
