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
  Radar,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Users,
  Trash2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";

const mockCompetitors = [
  {
    id: "1",
    username: "@marketing_pro",
    title: "Marketing Pro",
    subscribers: 45200,
    avgEngagement: 4.2,
    lastScan: "2ч назад",
    isActive: true,
  },
  {
    id: "2",
    username: "@content_kings",
    title: "Content Kings",
    subscribers: 32100,
    avgEngagement: 5.1,
    lastScan: "2ч назад",
    isActive: true,
  },
  {
    id: "3",
    username: "@digital_nomad",
    title: "Digital Nomad",
    subscribers: 28500,
    avgEngagement: 3.8,
    lastScan: "2ч назад",
    isActive: true,
  },
];

const mockHotTopics = [
  {
    topic: "AI-автоматизация в маркетинге",
    score: 94,
    trend: "rising",
    mentions: 23,
    avgEngagement: 5800,
  },
  {
    topic: "Telegram Premium для бизнеса",
    score: 87,
    trend: "rising",
    mentions: 18,
    avgEngagement: 4200,
  },
  {
    topic: "Контент-планирование 2026",
    score: 82,
    trend: "stable",
    mentions: 15,
    avgEngagement: 3900,
  },
  {
    topic: "Монетизация через подписки",
    score: 76,
    trend: "falling",
    mentions: 12,
    avgEngagement: 3100,
  },
];

const mockMissedTopics = [
  {
    topic: "Нейросети для создания визуала",
    competitorCount: 4,
    potential: 88,
  },
  {
    topic: "Кросс-постинг стратегии",
    competitorCount: 3,
    potential: 72,
  },
];

export default function TrendsPage() {
  const trendFeature = useFeature("trendRadar");
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Premium gate for demo
  const isPremium = !DEMO_MODE;

  const handleAddCompetitor = () => {
    if (!newCompetitor.trim()) {
      toast({ title: "Введите username канала", variant: "destructive" });
      return;
    }

    toast({ title: "Добавляем канал...", description: "Проверяем доступность" });

    setTimeout(() => {
      const newComp = {
        id: Date.now().toString(),
        username: newCompetitor.startsWith("@") ? newCompetitor : `@${newCompetitor}`,
        title: "New Channel",
        subscribers: 0,
        avgEngagement: 0,
        lastScan: "Никогда",
        isActive: true,
      };
      setCompetitors([...competitors, newComp]);
      setNewCompetitor("");
      setIsAddingCompetitor(false);
      toast({ title: "Канал добавлен", variant: "success" });
    }, 1500);
  };

  const handleScan = () => {
    setIsScanning(true);
    toast({ title: "Сканирование запущено", description: "Это займёт 2-3 минуты" });

    setTimeout(() => {
      setIsScanning(false);
      toast({ title: "Сканирование завершено", description: "Тренды обновлены", variant: "success" });
    }, 3000);
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter((c) => c.id !== id));
    toast({ title: "Канал удалён" });
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 blur-xl opacity-40" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Trend Radar</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          Мониторинг конкурентов и выявление горячих тем в вашей нише.
          Доступно на тарифах Pro и Business.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/settings/subscription">
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0">
              <Crown className="h-4 w-4" />
              Перейти на Pro
            </Button>
          </Link>
          <Button variant="outline">Узнать больше</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trend Radar</h1>
            <p className="text-muted-foreground">
              Мониторинг конкурентов и трендов в нише
            </p>
          </div>
        </div>
        <Button
          onClick={handleScan}
          disabled={isScanning || !trendFeature.canScan}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "Сканируем..." : "Обновить"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hot Topics */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Горячие темы
            </CardTitle>
            <CardDescription>
              Популярные темы у ваших конкурентов за последние 7 дней
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockHotTopics.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/50 p-4 hover:bg-accent/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{topic.topic}</h4>
                    {topic.trend === "rising" && (
                      <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    {topic.trend === "falling" && (
                      <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                    {topic.trend === "stable" && (
                      <Minus className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{topic.mentions} упоминаний</span>
                    <span>~{topic.avgEngagement.toLocaleString()} просмотров</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{topic.score}</div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
                <Link href={`/dashboard/voicekeeper/generate?topic=${encodeURIComponent(topic.topic)}`}>
                  <Button size="sm" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Написать
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Missed Topics */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              Упущенные темы
            </CardTitle>
            <CardDescription>
              Темы, о которых пишут конкуренты, но не вы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMissedTopics.map((topic, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
              >
                <h4 className="font-medium text-sm">{topic.topic}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {topic.competitorCount} конкурента пишут
                  </span>
                  <Badge variant="warning">
                    Потенциал {topic.potential}%
                  </Badge>
                </div>
              </div>
            ))}
            <Link href="/dashboard/voicekeeper/generate">
              <Button variant="outline" className="w-full gap-2 mt-2">
                <Sparkles className="h-4 w-4" />
                Создать пост
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Competitors */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Конкуренты</CardTitle>
              <CardDescription>
                Каналы, которые вы отслеживаете
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingCompetitor(true)}
              className="gap-2"
              disabled={!trendFeature.canAddCompetitors}
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add competitor form */}
          {isAddingCompetitor && (
            <div className="mb-4 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4">
              <Label className="mb-2 block">Username канала</Label>
              <div className="flex gap-2">
                <Input
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  placeholder="@channel_name"
                />
                <Button onClick={handleAddCompetitor}>Добавить</Button>
                <Button variant="ghost" onClick={() => setIsAddingCompetitor(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {/* Competitors list */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="rounded-xl border border-border/50 bg-background/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{competitor.title}</h4>
                    <a
                      href={`https://t.me/${competitor.username.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {competitor.username}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCompetitor(competitor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {competitor.subscribers.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {competitor.avgEngagement}% ER
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Обновлено: {competitor.lastScan}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {DEMO_MODE && (
        <p className="text-center text-sm text-muted-foreground">
          В демо-режиме функции сканирования и добавления конкурентов отключены
        </p>
      )}
    </div>
  );
}

