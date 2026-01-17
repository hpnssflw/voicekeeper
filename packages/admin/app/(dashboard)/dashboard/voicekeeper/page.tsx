"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
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
} from "lucide-react";

export default function VoiceKeeperPage() {
  const { user, bots } = useAuth();
  const underDev = useUnderDevelopment();
  
  const hasBots = bots.length > 0;
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

  const handleAnalyze = () => {
    underDev.showModal(
      "Voice Fingerprint Анализ",
      "Анализ вашего стиля письма на основе существующих постов. Требуется минимум 10 опубликованных постов для точного определения стиля."
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display">VoiceKeeper</h1>
            <p className="text-muted-foreground">
              AI-стратег для вашего контента
            </p>
          </div>
        </div>
        <Link href="/dashboard/voicekeeper/generate">
          <Button variant="gradient" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Создать пост
          </Button>
        </Link>
      </div>

      {/* Check for bots */}
      {!hasBots ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Сначала добавьте бота</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Для использования VoiceKeeper необходим подключенный Telegram-бот
            </p>
            <Link href="/dashboard/bots">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить бота
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FeatureIcon icon={Fingerprint} variant="primary" size="lg" />
                  <div>
                    <p className="text-sm text-muted-foreground">Voice Fingerprint</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-display">—</p>
                      <Badge variant="secondary">Не настроен</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FeatureIcon icon={Zap} variant="success" size="lg" />
                  <div>
                    <p className="text-sm text-muted-foreground">Генераций использовано</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-display">{generationsUsed}</p>
                      <span className="text-sm text-muted-foreground">/ {generationsLimit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FeatureIcon icon={Target} variant="warning" size="lg" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ваш план</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-display capitalize">{user?.plan || "free"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Voice Fingerprint Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5 text-red-400" />
                      Digital Voice Fingerprint
                    </CardTitle>
                    <CardDescription>
                      Профиль вашего уникального стиля письма
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyze}
                    className="gap-2"
                  >
                    Анализировать
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="py-8 text-center">
                  <Fingerprint className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-medium mb-2">Профиль не настроен</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                    Проанализируйте ваши существующие посты, чтобы AI мог имитировать ваш уникальный стиль письма
                  </p>
                  <Button onClick={handleAnalyze} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Начать анализ
                  </Button>
                </div>

                <Link href="/dashboard/voicekeeper/fingerprint">
                  <Button variant="outline" className="w-full gap-2">
                    Настройки профиля
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Действия</CardTitle>
                <CardDescription>Что можно сделать с VoiceKeeper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/voicekeeper/generate" className="block">
                  <div className="rounded-xl bg-red-500/[0.06] p-4 hover:bg-red-500/[0.1] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15">
                        <Wand2 className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Создать пост</h4>
                        <p className="text-xs text-muted-foreground">AI-генерация контента</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div 
                  className="rounded-xl bg-emerald-500/[0.06] p-4 hover:bg-emerald-500/[0.1] transition-colors cursor-pointer"
                  onClick={handleAnalyze}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                      <Fingerprint className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Анализ стиля</h4>
                      <p className="text-xs text-muted-foreground">Voice Fingerprint</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/dashboard/trends" className="block">
                  <div className="rounded-xl bg-amber-500/[0.06] p-4 hover:bg-amber-500/[0.1] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Trend Radar</h4>
                        <p className="text-xs text-muted-foreground">Анализ трендов</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Plan Upgrade Banner */}
          {user?.plan === "free" && (
            <Card className="bg-gradient-to-r from-red-500/10 via-transparent to-emerald-500/10">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold font-display mb-1">Увеличьте лимит генераций</h3>
                    <p className="text-sm text-muted-foreground">
                      Pro план даёт 50 генераций в месяц и доступ к Voice Fingerprint
                    </p>
                  </div>
                  <Link href="/dashboard/settings/subscription">
                    <Button className="gap-2">
                      <Zap className="h-4 w-4" />
                      Улучшить план
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
