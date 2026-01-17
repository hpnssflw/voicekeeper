"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserMinus,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";

const mockSubscribers = [
  {
    id: "1",
    telegramId: "123456789",
    username: "@user1",
    firstName: "Алексей",
    status: "active",
    joinedAt: "2026-01-15T10:00:00Z",
    lastActivity: "2ч назад",
    tags: ["premium", "active"],
  },
  {
    id: "2",
    telegramId: "987654321",
    username: "@user2",
    firstName: "Мария",
    status: "active",
    joinedAt: "2026-01-10T14:30:00Z",
    lastActivity: "5ч назад",
    tags: ["new"],
  },
  {
    id: "3",
    telegramId: "555555555",
    username: "@user3",
    firstName: "Дмитрий",
    status: "blocked",
    joinedAt: "2025-12-20T08:00:00Z",
    lastActivity: "3д назад",
    tags: [],
  },
  {
    id: "4",
    telegramId: "777777777",
    username: "@user4",
    firstName: "Елена",
    status: "active",
    joinedAt: "2026-01-05T16:20:00Z",
    lastActivity: "1ч назад",
    tags: ["active", "engaged"],
  },
  {
    id: "5",
    telegramId: "888888888",
    username: "@user5",
    firstName: "Иван",
    status: "left",
    joinedAt: "2025-11-15T12:00:00Z",
    lastActivity: "2 нед назад",
    tags: [],
  },
];

const stats = {
  total: 14250,
  active: 12800,
  blocked: 450,
  left: 1000,
  newThisWeek: 234,
  churnRate: 2.3,
};

export default function SubscribersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubscribers = mockSubscribers.filter(
    (sub) =>
      sub.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Подписчики</h1>
          <p className="text-muted-foreground">
            Управление аудиторией ваших ботов
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего подписчиков</p>
                <p className="mt-1 text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <FeatureIcon icon={Users} variant="info" size="lg" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных</p>
                <p className="mt-1 text-2xl font-bold text-emerald-500">
                  {stats.active.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.active / stats.total) * 100)}% от всех
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Новых за неделю</p>
                <p className="mt-1 text-2xl font-bold text-violet-500">
                  +{stats.newThisWeek}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-violet-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Отток</p>
                <p className="mt-1 text-2xl font-bold text-red-500">
                  {stats.churnRate}%
                </p>
                <p className="text-xs text-muted-foreground">за последний месяц</p>
              </div>
              <UserMinus className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Список подписчиков</CardTitle>
              <CardDescription>
                Последние активные пользователи вашего бота
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
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
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
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{sub.firstName}</p>
                          <p className="text-sm text-muted-foreground">
                            {sub.username}
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
                        {sub.lastActivity}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Показано {filteredSubscribers.length} из {stats.total.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Назад
              </Button>
              <Button variant="outline" size="sm">
                Далее
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

