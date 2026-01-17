"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeature, DEMO_MODE } from "@/lib/features";
import { FeatureIcon } from "@/components/brand/feature-icon";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Check,
  X,
  Clock,
  Users,
  Send,
  Eye,
  AlertCircle,
  Zap,
} from "lucide-react";

const mockBroadcasts = [
  {
    id: "1",
    name: "Анонс нового курса",
    status: "completed",
    postTitle: "Друзья, запускаем курс по AI!",
    bot: "Content Channel Bot",
    stats: {
      total: 8450,
      sent: 8320,
      delivered: 8100,
      failed: 130,
    },
    startedAt: "2026-01-16T10:00:00Z",
    completedAt: "2026-01-16T10:25:00Z",
  },
  {
    id: "2",
    name: "Еженедельный дайджест",
    status: "running",
    postTitle: "Новости недели #47",
    bot: "News Bot",
    stats: {
      total: 4200,
      sent: 2100,
      delivered: 2050,
      failed: 50,
    },
    startedAt: "2026-01-17T14:00:00Z",
  },
  {
    id: "3",
    name: "Промо Black Friday",
    status: "scheduled",
    postTitle: "Скидки до 50%!",
    bot: "Marketing Bot",
    stats: {
      total: 12500,
      sent: 0,
      delivered: 0,
      failed: 0,
    },
    scheduledFor: "2026-01-20T12:00:00Z",
  },
];

export default function BroadcastsPage() {
  const broadcastsFeature = useFeature("broadcasts");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="gap-1">
            <Check className="h-3 w-3" />
            Завершена
          </Badge>
        );
      case "running":
        return (
          <Badge className="gap-1 bg-blue-500">
            <Play className="h-3 w-3" />
            Выполняется
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Запланирована
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="h-3 w-3" />
            Отменена
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Рассылки</h1>
          <p className="text-muted-foreground">
            Массовая отправка сообщений подписчикам
          </p>
        </div>
        <Link href="/dashboard/broadcasts/new">
          <Button className="gap-2" disabled={!broadcastsFeature.canCreate}>
            <Plus className="h-4 w-4" />
            Новая рассылка
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Всего рассылок</span>
              <span className="text-2xl font-bold">{mockBroadcasts.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Активных</span>
              <span className="text-2xl font-bold text-blue-500">
                {mockBroadcasts.filter((b) => b.status === "running").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Запланировано</span>
              <span className="text-2xl font-bold text-amber-500">
                {mockBroadcasts.filter((b) => b.status === "scheduled").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Доставляемость</span>
              <span className="text-2xl font-bold text-emerald-500">97.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcasts List */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>История рассылок</CardTitle>
          <CardDescription>
            Все рассылки по вашим ботам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockBroadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              className="rounded-xl border border-border/50 bg-background/50 p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{broadcast.name}</h3>
                    {getStatusBadge(broadcast.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {broadcast.postTitle}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{broadcast.bot}</span>
                    {broadcast.status === "scheduled" && broadcast.scheduledFor && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(broadcast.scheduledFor)}
                      </span>
                    )}
                    {broadcast.startedAt && (
                      <span>Начало: {formatDate(broadcast.startedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Progress / Stats */}
                <div className="flex items-center gap-4 lg:gap-8">
                  {/* Progress bar for running */}
                  {broadcast.status === "running" && (
                    <div className="w-32 lg:w-40">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span>
                          {Math.round(
                            (broadcast.stats.sent / broadcast.stats.total) * 100
                          )}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${
                              (broadcast.stats.sent / broadcast.stats.total) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">
                        {broadcast.stats.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Всего</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-500">
                        {broadcast.stats.delivered.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Доставлено</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-500">
                        {broadcast.stats.failed}
                      </p>
                      <p className="text-xs text-muted-foreground">Ошибок</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {broadcast.status === "running" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        disabled={!broadcastsFeature.canSend}
                      >
                        <Pause className="h-3 w-3" />
                        Пауза
                      </Button>
                    )}
                    {broadcast.status === "scheduled" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          disabled={!broadcastsFeature.canSend}
                        >
                          <Play className="h-3 w-3" />
                          Запустить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {broadcast.status === "completed" && (
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <FeatureIcon icon={Zap} variant="info" size="md" />
            <div className="text-sm">
              <p className="font-medium">Советы по рассылкам</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Telegram ограничивает отправку ~30 сообщений в секунду</li>
                <li>• Лучшее время для рассылок: 10:00-12:00 и 19:00-21:00</li>
                <li>• Добавляйте персонализацию для увеличения открываемости</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {DEMO_MODE && (
        <p className="text-center text-sm text-muted-foreground">
          В демо-режиме функции создания и отправки рассылок отключены
        </p>
      )}
    </div>
  );
}

