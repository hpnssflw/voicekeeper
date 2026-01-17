"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useFeature, DEMO_MODE } from "@/lib/features";
import {
  Fingerprint,
  RefreshCw,
  FileText,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  Save,
  Pencil,
} from "lucide-react";

const mockFingerprint = {
  status: "active",
  updatedAt: "2026-01-17T08:00:00Z",
  postsAnalyzed: 47,
  metrics: {
    avgLength: 1200,
    avgParagraphs: 4,
    emojiFrequency: "medium",
    formalityLevel: 72,
    uniquePhrases: 12,
  },
  styleProfile: {
    tone: "Профессиональный, но дружелюбный",
    structure: "Короткие абзацы, списки, призыв к действию в конце",
    vocabulary: "Технический с упрощениями, много английских терминов",
    signature: "Начинает с вопроса или провокации, заканчивает CTA",
    emoji: "Умеренное использование: 🔥 💡 ✅ 📈",
  },
  samplePhrases: [
    "Друзья, сегодня разберём...",
    "Вопрос к вам:",
    "А что думаете вы?",
    "Давайте разбираться",
    "Итак, главный вывод:",
  ],
};

export default function FingerprintPage() {
  const voicekeeperFeature = useFeature("voiceKeeper");
  const [channelToAnalyze, setChannelToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [styleProfile, setStyleProfile] = useState(mockFingerprint.styleProfile);

  const handleAnalyze = () => {
    if (!channelToAnalyze.trim()) {
      toast({ title: "Введите username канала", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    toast({ title: "Анализируем канал...", description: "Это займёт 1-2 минуты" });

    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Анализ завершён",
        description: "Voice Fingerprint обновлён",
        variant: "success",
      });
    }, 3000);
  };

  const handleSaveManual = () => {
    setIsEditing(false);
    toast({ title: "Профиль сохранён", variant: "success" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Fingerprint className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voice Fingerprint</h1>
            <p className="text-muted-foreground">
              Ваш уникальный авторский стиль
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveManual} className="gap-2">
                <Save className="h-4 w-4" />
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {/* Status card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium">Fingerprint активен</p>
                <p className="text-sm text-muted-foreground">
                  Обновлён: {new Date(mockFingerprint.updatedAt).toLocaleDateString("ru")} •{" "}
                  Проанализировано {mockFingerprint.postsAnalyzed} постов
                </p>
              </div>
            </div>
            <Badge variant="success">Актуален</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Style Profile */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Профиль стиля</CardTitle>
            <CardDescription>
              Характеристики вашего авторского голоса
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(styleProfile).map(([key, value]) => {
              const labels: Record<string, string> = {
                tone: "Тональность",
                structure: "Структура",
                vocabulary: "Словарный запас",
                signature: "Фишки стиля",
                emoji: "Эмодзи",
              };

              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{labels[key]}</Label>
                  {isEditing ? (
                    <Input
                      value={value}
                      onChange={(e) =>
                        setStyleProfile({ ...styleProfile, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm bg-muted/50 rounded-lg px-3 py-2">{value}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Signature Phrases */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Фирменные фразы</CardTitle>
            <CardDescription>
              Часто используемые выражения и обороты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockFingerprint.samplePhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm">&ldquo;{phrase}&rdquo;</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Метрики контента</CardTitle>
            <CardDescription>
              Статистические характеристики ваших постов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{mockFingerprint.metrics.avgLength}</p>
                <p className="text-xs text-muted-foreground">Средняя длина (симв.)</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{mockFingerprint.metrics.avgParagraphs}</p>
                <p className="text-xs text-muted-foreground">Абзацев в среднем</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{mockFingerprint.metrics.formalityLevel}%</p>
                <p className="text-xs text-muted-foreground">Формальность</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{mockFingerprint.metrics.uniquePhrases}</p>
                <p className="text-xs text-muted-foreground">Уникальных фраз</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Re-analyze */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Обновить Fingerprint</CardTitle>
            <CardDescription>
              Проанализировать канал заново для обновления профиля
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username канала для анализа</Label>
              <Input
                value={channelToAnalyze}
                onChange={(e) => setChannelToAnalyze(e.target.value)}
                placeholder="@your_channel"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !voicekeeperFeature.canAnalyzeFingerprint}
              className="w-full gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Анализируем..." : "Запустить анализ"}
            </Button>

            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Анализ занимает 1-2 минуты
              </p>
              <p className="mt-1 text-xs">
                AI проанализирует последние 50 постов и обновит ваш профиль стиля
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {DEMO_MODE && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Демо-режим</p>
              <p className="text-muted-foreground">
                Функция анализа канала отключена. Данные на странице — демонстрационные.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

