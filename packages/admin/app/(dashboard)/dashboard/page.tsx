"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/brand/feature-icon";
import {
  Bot,
  FileText,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Eye,
  MousePointer,
  Zap,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    name: "Активные боты",
    value: "3",
    change: "+1 за месяц",
    changeType: "positive",
    icon: Bot,
    variant: "info" as const,
  },
  {
    name: "Всего постов",
    value: "127",
    change: "+12 за неделю",
    changeType: "positive",
    icon: FileText,
    variant: "primary" as const,
  },
  {
    name: "Подписчики",
    value: "14.2K",
    change: "+8.3%",
    changeType: "positive",
    icon: Users,
    variant: "success" as const,
  },
  {
    name: "Просмотры",
    value: "89.4K",
    change: "+24%",
    changeType: "positive",
    icon: Eye,
    variant: "warning" as const,
  },
];

const recentPosts = [
  {
    id: 1,
    title: "5 трендов AI в 2026 году",
    status: "published",
    views: 2340,
    clicks: 156,
    bot: "Content Channel",
    date: "2ч назад",
    isAi: true,
  },
  {
    id: 2,
    title: "Как увеличить вовлеченность",
    status: "scheduled",
    views: 0,
    clicks: 0,
    bot: "Marketing Bot",
    date: "Запланирован на 18:00",
    isAi: true,
  },
  {
    id: 3,
    title: "Новости индустрии #47",
    status: "draft",
    views: 0,
    clicks: 0,
    bot: "News Bot",
    date: "Черновик",
    isAi: false,
  },
];

const aiInsights = [
  {
    type: "trend",
    icon: TrendingUp,
    title: "Горячая тема в нише",
    description: "«AI-автоматизация» набирает обороты. +340% упоминаний у конкурентов.",
    action: "Создать пост",
    href: "/dashboard/voicekeeper/generate?topic=AI-автоматизация",
  },
  {
    type: "time",
    icon: Clock,
    title: "Лучшее время публикации",
    description: "Ваша аудитория активна в 10:00-12:00 и 19:00-21:00.",
    action: "Запланировать",
    href: "/dashboard/posts",
  },
  {
    type: "optimization",
    icon: Target,
    title: "Оптимизация контента",
    description: "Посты с эмодзи получают на 23% больше реакций.",
    action: "Настроить",
    href: "/dashboard/voicekeeper/fingerprint",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Dashboard</h1>
          <p className="text-muted-foreground">
            Обзор ваших Telegram-каналов и контента
          </p>
        </div>
        <Link href="/dashboard/voicekeeper/generate">
          <Button variant="gradient" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Создать с AI
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="mt-1 text-2xl font-bold font-display">{stat.value}</p>
                  <p className={`mt-1 text-xs ${
                    stat.changeType === "positive" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <FeatureIcon icon={stat.icon} variant={stat.variant} size="lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Posts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Последние посты</CardTitle>
              <CardDescription>Активность за последние 7 дней</CardDescription>
            </div>
            <Link href="/dashboard/posts">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                Все посты
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-xl bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{post.title}</h4>
                      {post.isAi && (
                        <Badge variant="gradient" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {post.bot} • {post.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {post.status === "published" && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {post.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MousePointer className="h-4 w-4" />
                          {post.clicks}
                        </div>
                      </div>
                    )}
                    <Badge
                      variant={
                        post.status === "published"
                          ? "success"
                          : post.status === "scheduled"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {post.status === "published"
                        ? "Опубликован"
                        : post.status === "scheduled"
                        ? "Запланирован"
                        : "Черновик"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">AI Insights</CardTitle>
                <CardDescription>Рекомендации VoiceKeeper</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-red-500/[0.06] p-4 hover:bg-red-500/[0.1] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
                      <Icon className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm font-display">{insight.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <Link href={insight.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 h-7 w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 px-0"
                    >
                      {insight.action}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              );
            })}
            <Link href="/dashboard/voicekeeper">
              <Button variant="outline" className="w-full gap-2 mt-2 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <Sparkles className="h-4 w-4" />
                Открыть VoiceKeeper
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/voicekeeper/generate" className="group">
          <Card className="card-hover h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Сгенерировать пост</h3>
                <p className="text-sm text-muted-foreground">Создайте контент с AI</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/trends" className="group">
          <Card className="card-hover h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/25">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Trend Radar</h3>
                <p className="text-sm text-muted-foreground">Анализ конкурентов</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/bots" className="group">
          <Card className="card-hover h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Добавить бота</h3>
                <p className="text-sm text-muted-foreground">Подключите Telegram-бота</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
