"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Bot,
  Plus,
} from "lucide-react";

export interface Subscriber {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "blocked" | "left";
  joinedAt: string;
  lastActivity?: string;
  tags: string[];
}

export default function SubscribersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { bots } = useAuth();
  
  // Subscribers would come from API - for now empty
  const subscribers: Subscriber[] = [];
  
  const totalSubscribers = bots.reduce((sum, b) => sum + b.subscriberCount, 0);

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      (sub.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (sub.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const hasBots = bots.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Подписчики</h1>
          <p className="text-muted-foreground">
            Управление аудиторией ваших ботов
          </p>
        </div>
        <Button variant="outline" className="gap-2" disabled={subscribers.length === 0}>
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Check for bots */}
      {!hasBots ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Сначала добавьте бота</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Подписчики появятся после подключения Telegram-бота
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
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Всего подписчиков</p>
                    <p className="mt-1 text-2xl font-bold font-display">{totalSubscribers.toLocaleString()}</p>
                  </div>
                  <FeatureIcon icon={Users} variant="info" size="lg" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Подключено ботов</p>
                    <p className="mt-1 text-2xl font-bold font-display text-emerald-400">
                      {bots.length}
                    </p>
                  </div>
                  <FeatureIcon icon={Bot} variant="success" size="lg" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Активных ботов</p>
                    <p className="mt-1 text-2xl font-bold font-display text-amber-400">
                      {bots.filter(b => b.isActive).length}
                    </p>
                  </div>
                  <FeatureIcon icon={Bot} variant="warning" size="lg" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ср. подписчиков/бот</p>
                    <p className="mt-1 text-2xl font-bold font-display">
                      {bots.length > 0 ? Math.round(totalSubscribers / bots.length).toLocaleString() : 0}
                    </p>
                  </div>
                  <FeatureIcon icon={Users} variant="primary" size="lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Список подписчиков</CardTitle>
                  <CardDescription>
                    Пользователи ваших Telegram-ботов
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск..."
                    icon={<Search className="h-4 w-4" />}
                    className="w-full sm:w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscribers.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Пока нет подписчиков</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Подписчики появятся когда пользователи начнут взаимодействовать с вашими ботами
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-white/[0.05] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Пользователь
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Статус
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Теги
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Подписался
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Активность
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {filteredSubscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">{sub.firstName || "—"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {sub.username || sub.telegramId}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  sub.status === "active"
                                    ? "success"
                                    : sub.status === "blocked"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {sub.status === "active"
                                  ? "Активен"
                                  : sub.status === "blocked"
                                  ? "Заблокирован"
                                  : "Ушёл"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {sub.tags.length > 0 ? (
                                  sub.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {new Date(sub.joinedAt).toLocaleDateString("ru")}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {sub.lastActivity || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subscribers.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Показано {filteredSubscribers.length} из {subscribers.length}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Назад
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Далее
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
