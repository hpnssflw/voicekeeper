"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
import {
  Bot,
  FileText,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
  BarChart3,
  Radio,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, bots, channels } = useAuth();
  
  const activeBots = bots.filter(b => b.isActive).length;
  const totalPosts = bots.reduce((sum, b) => sum + b.postsCount, 0);
  const totalSubscribers = bots.reduce((sum, b) => sum + b.subscriberCount, 0);
  
  const stats = [
    {
      name: "Активные боты",
      value: activeBots.toString(),
      subtitle: `из ${bots.length} подключенных`,
      icon: Bot,
      variant: "info" as const,
      href: "/dashboard/bots",
    },
    {
      name: "Всего постов",
      value: totalPosts.toString(),
      subtitle: "опубликовано",
      icon: FileText,
      variant: "primary" as const,
      href: "/dashboard/posts",
    },
    {
      name: "Подписчики",
      value: totalSubscribers > 1000 ? `${(totalSubscribers / 1000).toFixed(1)}K` : totalSubscribers.toString(),
      subtitle: "суммарно",
      icon: Users,
      variant: "success" as const,
      href: "/dashboard/subscribers",
    },
    {
      name: "Каналы",
      value: channels.length.toString(),
      subtitle: "отслеживаемых",
      icon: Radio,
      variant: "warning" as const,
      href: "/dashboard/channels",
    },
  ];

  const hasData = bots.length > 0 || channels.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">
            {user?.firstName ? `Привет, ${user.firstName}!` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {hasData 
              ? "Обзор ваших Telegram-каналов и контента"
              : "Начните с добавления бота или канала"}
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
          <Link key={stat.name} href={stat.href}>
            <Card className="card-hover h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="mt-1 text-2xl font-bold font-display">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                  <FeatureIcon icon={stat.icon} variant={stat.variant} size="lg" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State or Content */}
      {!hasData ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold font-display mb-2">Начните работу с VoiceKeeper</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Добавьте Telegram-бота для публикации контента или канал для анализа конкурентов
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/bots">
                <Button className="gap-2">
                  <Bot className="h-4 w-4" />
                  Добавить бота
                </Button>
              </Link>
              <Link href="/dashboard/channels">
                <Button variant="outline" className="gap-2">
                  <Radio className="h-4 w-4" />
                  Добавить канал
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bots List */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ваши боты</CardTitle>
                <CardDescription>Подключенные Telegram-боты</CardDescription>
              </div>
              <Link href="/dashboard/bots">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  Все боты
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {bots.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-3">Нет подключенных ботов</p>
                  <Link href="/dashboard/bots">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-3 w-3" />
                      Добавить бота
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bots.slice(0, 4).map((bot) => (
                    <div
                      key={bot.id}
                      className="flex items-center justify-between rounded-xl bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          bot.isActive 
                            ? "bg-gradient-to-br from-red-500 to-emerald-500" 
                            : "bg-muted"
                        }`}>
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{bot.name}</h4>
                          <p className="text-sm text-muted-foreground">{bot.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {bot.subscriberCount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {bot.postsCount}
                          </div>
                        </div>
                        <Badge variant={bot.isActive ? "success" : "secondary"}>
                          {bot.isActive ? "Активен" : "Выкл"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Быстрые действия</CardTitle>
                  <CardDescription>Начните прямо сейчас</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/voicekeeper/generate" className="block">
                <div className="rounded-xl bg-red-500/[0.06] p-4 hover:bg-red-500/[0.1] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
                      <Sparkles className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Создать пост с AI</h4>
                      <p className="text-xs text-muted-foreground">VoiceKeeper генерация</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/trends" className="block">
                <div className="rounded-xl bg-amber-500/[0.06] p-4 hover:bg-amber-500/[0.1] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Trend Radar</h4>
                      <p className="text-xs text-muted-foreground">Анализ конкурентов</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/voicekeeper/fingerprint" className="block">
                <div className="rounded-xl bg-emerald-500/[0.06] p-4 hover:bg-emerald-500/[0.1] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                      <BarChart3 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Voice Fingerprint</h4>
                      <p className="text-xs text-muted-foreground">Настройка стиля</p>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Info */}
      {user && (
        <Card className="bg-gradient-to-r from-red-500/5 via-transparent to-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gradient" className="capitalize">{user.plan}</Badge>
                  <span className="text-sm text-muted-foreground">план</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.plan === "free" 
                    ? "3 генерации в месяц" 
                    : user.plan === "pro"
                    ? "50 генераций в месяц"
                    : "Безлимитные генерации"}
                </p>
              </div>
              {user.plan === "free" && (
                <Link href="/dashboard/settings/subscription">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Zap className="h-3 w-3" />
                    Улучшить план
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
