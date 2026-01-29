"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, Input, Label, Badge } from "@/ui";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/features/auth";
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
  { id: "bot", title: "Подключите бота" },
  { id: "channel", title: "Укажите канал" },
  { id: "style", title: "Настройте стиль" },
  { id: "plan", title: "Выберите план" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, addBot, addChannel, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Bot setup
    botToken: "",
    // Channel
    channelUsername: "",
    channelForAnalysis: "",
    // Plan
    selectedPlan: "free" as "free" | "pro" | "business",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Redirect to login if not authenticated (OAuth only)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    // Validation removed for registration step (step 0) as it's no longer used
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    
    // Registration step removed - users must authenticate via OAuth first
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = async () => {
    setIsLoading(true);
    try {
      // Add bot if provided
      if (formData.botToken) {
        try {
          await addBot(formData.botToken);
        } catch (e) {
          console.log("Bot token validation skipped:", e);
        }
      }
      
      // Add channel for analysis if provided
      if (formData.channelForAnalysis) {
        try {
          await addChannel(formData.channelForAnalysis);
        } catch (e) {
          console.log("Channel already exists:", e);
        }
      }
      
      // Update user plan
      await updateUser({ plan: formData.selectedPlan });
      
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
        // OAuth only - redirect to login
        router.push("/login");
        return;
      }
      await updateUser({ plan: "free" });
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
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-4 py-3">
      {/* Progress */}
      <div className="w-full max-w-md mb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium transition-all ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : idx === currentStep
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/20"
                    : "bg-white/[0.05] text-muted-foreground"
                }`}
              >
                {idx < currentStep ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-4 md:w-8 mx-0.5 transition-colors rounded-full ${
                    idx < currentStep ? "bg-primary" : "bg-white/[0.05]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[9px] text-muted-foreground">
          Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-md">
        <CardContent className="p-2.5">
          {/* Step 1: Bot Setup */}
          {currentStep === 0 && (
            <div className="space-y-2.5">
              <div className="text-center">
                <div className="flex justify-center mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h2 className="text-xs font-bold font-display">Подключите Telegram-бота</h2>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Бот нужен для публикации постов в ваш канал
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor="bot-token" className="text-[10px]">Токен бота</Label>
                  <Input
                    id="bot-token"
                    placeholder="7123456789:AAH..."
                    value={formData.botToken}
                    onChange={(e) => updateField("botToken", e.target.value)}
                    className="font-mono h-6 text-[10px]"
                  />
                  {/* Quick hint for testing */}
                  <p className="text-[9px] text-emerald-400/80 mt-0.5">
                    💡 Тестовый токен: <code className="bg-emerald-500/10 px-1 py-0.5 rounded cursor-pointer hover:bg-emerald-500/20" onClick={() => updateField("botToken", "7819471498:AAG6rlm5hZJGLmJfcRO5FhTNi0mmbCMvbKI")}>7819471498:AAG6rlm5hZJGLmJfcRO5FhTNi0mmbCMvbKI</code>
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.03] p-2.5">
                  <h4 className="font-medium mb-1.5 flex items-center gap-1.5 text-[10px]">
                    <MessageSquare className="h-3 w-3 text-blue-400" />
                    Как получить токен:
                  </h4>
                  <ol className="list-decimal list-inside space-y-0.5 text-[9px] text-muted-foreground">
                    <li>Откройте <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline">@BotFather</a> в Telegram</li>
                    <li>Отправьте команду <code className="bg-white/[0.05] px-1 rounded">/newbot</code></li>
                    <li>Следуйте инструкциям и скопируйте токен</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-1.5 pt-1.5">
                <Button variant="outline" onClick={prevStep} className="gap-1 h-6 text-[10px]" size="sm">
                  <ArrowLeft className="h-3 w-3" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-1 h-6 text-[10px]"
                  size="sm"
                >
                  {formData.botToken ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Channel Setup */}
          {currentStep === 2 && (
            <div className="space-y-2.5">
              <div className="text-center">
                <div className="flex justify-center mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h2 className="text-xs font-bold font-display">Укажите ваш канал</h2>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Канал, в который будут публиковаться посты
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor="channel" className="text-[10px]">Username канала</Label>
                  <Input
                    id="channel"
                    placeholder="@your_channel"
                    value={formData.channelUsername}
                    onChange={(e) => updateField("channelUsername", e.target.value)}
                    className="h-6 text-[10px]"
                  />
                  <p className="text-[9px] text-muted-foreground">
                    Не забудьте добавить бота администратором канала
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 pt-1.5">
                <Button variant="outline" onClick={prevStep} className="gap-1 h-6 text-[10px]" size="sm">
                  <ArrowLeft className="h-3 w-3" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-1 h-6 text-[10px]"
                  size="sm"
                >
                  {formData.channelUsername ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Voice Fingerprint Setup */}
          {currentStep === 2 && (
            <div className="space-y-2.5">
              <div className="text-center">
                <div className="flex justify-center mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 shadow-md">
                    <Fingerprint className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h2 className="text-xs font-bold font-display">Настройте Voice Fingerprint</h2>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Укажите канал для анализа вашего авторского стиля
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor="analysis-channel" className="text-[10px]">Канал для анализа стиля</Label>
                  <Input
                    id="analysis-channel"
                    placeholder="@your_channel или любой публичный канал"
                    value={formData.channelForAnalysis}
                    onChange={(e) => updateField("channelForAnalysis", e.target.value)}
                    className="h-6 text-[10px]"
                  />
                  <p className="text-[9px] text-muted-foreground">
                    AI проанализирует последние 50 постов
                  </p>
                </div>

                <div className="rounded-lg bg-red-500/[0.06] p-2.5">
                  <h4 className="font-medium text-[10px] mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-red-400" />
                    Что анализирует AI:
                  </h4>
                  <ul className="text-[9px] text-muted-foreground space-y-0.5">
                    <li>• Структуру и длину постов</li>
                    <li>• Тональность и формальность</li>
                    <li>• Фирменные фразы и обороты</li>
                    <li>• Использование эмодзи</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-1.5 pt-1.5">
                <Button variant="outline" onClick={prevStep} className="gap-1 h-6 text-[10px]" size="sm">
                  <ArrowLeft className="h-3 w-3" />
                  Назад
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1 gap-1 h-6 text-[10px]"
                  size="sm"
                >
                  {formData.channelForAnalysis ? "Продолжить" : "Пропустить"}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Plan Selection & Finish */}
          {currentStep === 3 && (
            <div className="text-center space-y-2.5">
              <div className="flex justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-xs font-bold font-display">Выберите план</h1>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Начните бесплатно, масштабируйтесь по мере роста
                </p>
              </div>

              {/* Plan Selection */}
              <div className="grid gap-2 md:grid-cols-3">
                {[
                  { id: "free" as const, name: "Free", price: "0 ₽", features: ["3 генерации/мес", "1 бот", "Базовый анализ"] },
                  { id: "pro" as const, name: "Pro", price: "750 ₽", features: ["50 генераций/мес", "5 ботов", "Voice Fingerprint"], popular: true },
                  { id: "business" as const, name: "Business", price: "2 500 ₽", features: ["Безлимит", "∞ ботов", "API доступ"] },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                    className={`relative rounded-lg p-2.5 text-left transition-all ${
                      formData.selectedPlan === plan.id
                        ? "bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                        : "bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    {plan.popular && (
                      <Badge variant="gradient" className="absolute -top-1.5 right-1.5 text-[8px] px-1 py-0">
                        Популярный
                      </Badge>
                    )}
                    <p className="font-semibold font-display text-[10px]">{plan.name}</p>
                    <p className="text-sm font-bold mt-0.5 leading-tight">{plan.price}<span className="text-[9px] font-normal text-muted-foreground">/мес</span></p>
                    <ul className="mt-2 space-y-0.5">
                      {plan.features.map((f) => (
                        <li key={f} className="text-[9px] text-muted-foreground flex items-center gap-1 leading-tight">
                          <Check className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 pt-1.5">
                <Button variant="outline" onClick={prevStep} className="gap-1 h-6 text-[10px]" size="sm">
                  <ArrowLeft className="h-3 w-3" />
                  Назад
                </Button>
                <Button 
                  onClick={finishOnboarding} 
                  className="flex-1 gap-1 h-6 text-[10px]"
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
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
