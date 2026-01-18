"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
import { getFingerprint } from "@/lib/ai";
import { UnderDevelopmentModal, useUnderDevelopment } from "@/components/ui/under-development-modal";
import Link from "next/link";
import {
  Sparkles,
  Fingerprint,
  Wand2,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
  Bot,
  Plus,
  CheckCircle2,
  Pencil,
} from "lucide-react";

export default function VoiceKeeperPage() {
  const { user, bots } = useAuth();
  const underDev = useUnderDevelopment();
  const [hasFingerprint, setHasFingerprint] = useState(false);
  
  const hasBots = bots.length > 0;
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

  // Check for saved fingerprint
  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const fingerprint = await getFingerprint();
        setHasFingerprint(!!fingerprint);
      } catch (error) {
        console.error("Failed to load fingerprint:", error);
      }
    };
    loadFingerprint();
  }, []);

  const handleAnalyze = () => {
    underDev.showModal(
      "Voice Fingerprint Анализ",
      "Анализ вашего стиля письма на основе существующих постов. Требуется минимум 10 опубликованных постов для точного определения стиля."
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-display">VoiceKeeper</h1>
            <p className="text-[10px] text-muted-foreground">
              AI-стратег для вашего контента
            </p>
          </div>
        </div>
        <Link href="/dashboard/voicekeeper/generate">
          <Button variant="gradient" size="sm" className="gap-1.5 h-7 text-[10px]">
            <Wand2 className="h-3 w-3" />
            Создать
          </Button>
        </Link>
      </div>

      {/* Check for bots */}
      {!hasBots ? (
        <Card className="py-6">
          <CardContent className="text-center p-4">
            <Bot className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-sm font-medium font-display mb-1">Сначала добавьте бота</h3>
            <p className="text-[10px] text-muted-foreground mb-3 max-w-md mx-auto">
              Для использования VoiceKeeper необходим подключенный Telegram-бот
            </p>
            <Link href="/dashboard/bots">
              <Button size="sm" className="gap-1.5 h-7 text-[10px]">
                <Plus className="h-3 w-3" />
                Добавить бота
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid gap-2 md:grid-cols-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <FeatureIcon icon={Fingerprint} variant={hasFingerprint ? "success" : "primary"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground">Voice Fingerprint</p>
                    <div className="flex items-center gap-1.5">
                      {hasFingerprint ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <Badge variant="success" className="text-[9px] px-1 py-0">Активен</Badge>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-bold font-display">—</p>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">Не настроен</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <FeatureIcon icon={Zap} variant="success" size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground">Генераций</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-bold font-display">{generationsUsed}</p>
                      <span className="text-[10px] text-muted-foreground">/ {generationsLimit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <FeatureIcon icon={Target} variant="warning" size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground">План</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-bold font-display capitalize">{user?.plan || "free"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {/* Voice Fingerprint Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm">
                      <Fingerprint className="h-3.5 w-3.5 text-red-400" />
                      Digital Voice Fingerprint
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Профиль вашего уникального стиля письма
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/voicekeeper/fingerprint">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-7 text-[10px]"
                    >
                      Настроить
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {hasFingerprint ? (
                  <div className="py-3">
                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-emerald-500/5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-emerald-400">Voice Fingerprint активен</p>
                        <p className="text-[10px] text-muted-foreground">Ваш стиль используется при генерации</p>
                      </div>
                    </div>
                    <Link href="/dashboard/voicekeeper/fingerprint">
                      <Button variant="outline" size="sm" className="w-full gap-1.5 h-7 text-[10px]">
                        <Pencil className="h-3 w-3" />
                        Изменить профиль
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <Fingerprint className="h-10 w-10 mx-auto text-gray-600 mb-2" />
                    <h3 className="text-xs font-medium mb-1">Профиль не настроен</h3>
                    <p className="text-[10px] text-muted-foreground max-w-sm mx-auto mb-3">
                      Проанализируйте ваши существующие посты, чтобы AI мог имитировать ваш уникальный стиль письма
                    </p>
                    <Link href="/dashboard/voicekeeper/fingerprint">
                      <Button onClick={handleAnalyze} size="sm" className="gap-1.5 h-7 text-[10px]">
                        <Sparkles className="h-3 w-3" />
                        Начать анализ
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Действия</CardTitle>
                <CardDescription className="text-[10px]">Что можно сделать с VoiceKeeper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                <Link href="/dashboard/voicekeeper/generate" className="block">
                  <div className="rounded-lg bg-red-500/[0.06] p-2.5 hover:bg-red-500/[0.1] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/15">
                        <Wand2 className="h-3.5 w-3.5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium">Создать пост</h4>
                        <p className="text-[9px] text-muted-foreground">AI-генерация контента</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/voicekeeper/fingerprint" className="block">
                  <div className="rounded-lg bg-emerald-500/[0.06] p-2.5 hover:bg-emerald-500/[0.1] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15">
                        <Fingerprint className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium">Анализ стиля</h4>
                        <p className="text-[9px] text-muted-foreground">Voice Fingerprint</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/trends" className="block">
                  <div className="rounded-lg bg-amber-500/[0.06] p-2.5 hover:bg-amber-500/[0.1] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15">
                        <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium">Trend Radar</h4>
                        <p className="text-[9px] text-muted-foreground">Анализ трендов</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Plan Upgrade Banner */}
          {user?.plan === "free" && (
            <Card className="bg-gradient-to-r from-orange-500/10 via-transparent to-pink-500/10">
              <CardContent className="p-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold font-display mb-0.5">Увеличьте лимит генераций</h3>
                    <p className="text-[10px] text-muted-foreground">
                      Pro план даёт 50 генераций в месяц и доступ к Voice Fingerprint
                    </p>
                  </div>
                  <Link href="/dashboard/settings/subscription">
                    <Button size="sm" className="gap-1.5 h-7 text-[10px]">
                      <Zap className="h-3 w-3" />
                      Улучшить
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <underDev.Modal />
    </div>
  );
}
