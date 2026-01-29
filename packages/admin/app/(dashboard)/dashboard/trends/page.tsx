"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, toast, UnderDevelopmentModal, useUnderDevelopment } from "@/ui";
import { useAuth } from "@/features/auth";
import {
  Radar,
  Plus,
  TrendingUp,
  Trash2,
  RefreshCw,
  ExternalLink,
  Lock,
  Crown,
  Radio,
} from "lucide-react";
import Link from "next/link";

interface TrackedChannel {
  id: string;
  username: string;
  title: string;
  lastScan?: string;
}

export default function TrendsPage() {
  const { user, channels } = useAuth();
  const underDev = useUnderDevelopment();
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [trackedChannels, setTrackedChannels] = useState<TrackedChannel[]>([]);

  // Premium gate based on user plan
  const isPremium = user?.plan === "pro" || user?.plan === "business";

  const handleAddChannel = () => {
    if (!newChannel.trim()) {
      toast({ title: "Введите username канала", variant: "destructive" });
      return;
    }

    const newItem: TrackedChannel = {
      id: Date.now().toString(),
      username: newChannel.startsWith("@") ? newChannel : `@${newChannel}`,
      title: newChannel.replace("@", ""),
      lastScan: undefined,
    };
    
    setTrackedChannels([...trackedChannels, newItem]);
    setNewChannel("");
    setIsAddingChannel(false);
    toast({ title: "Канал добавлен для отслеживания", variant: "success" });
  };

  const handleScan = () => {
    underDev.showModal(
      "Сканирование трендов",
      "Автоматический анализ контента конкурентов и выявление популярных тем. Эта функция скоро будет доступна."
    );
  };

  const removeChannel = (id: string) => {
    setTrackedChannels(trackedChannels.filter((c) => c.id !== id));
    toast({ title: "Канал удалён" });
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 blur-xl opacity-40" />
        </div>
        <h1 className="mt-6 text-2xl font-bold font-display">Trend Radar</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          Мониторинг конкурентов и выявление горячих тем в вашей нише.
          Доступно на тарифах Pro и Business.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/settings/subscription">
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-lg shadow-amber-500/25">
              <Crown className="h-4 w-4" />
              Перейти на Pro
            </Button>
          </Link>
          <Link href="/dashboard/channels">
            <Button variant="outline">Отслеживать каналы</Button>
          </Link>
        </div>

        <underDev.Modal />
      </div>
    );
  }

  const hasChannels = trackedChannels.length > 0 || channels.length > 0;
  const allChannels = [
    ...trackedChannels,
    ...channels.map(c => ({ 
      id: c.id, 
      username: c.username, 
      title: c.title, 
      lastScan: c.lastParsed 
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Trend Radar</h1>
            <p className="text-muted-foreground">
              Мониторинг конкурентов и трендов в нише
            </p>
          </div>
        </div>
        <Button
          onClick={handleScan}
          disabled={!hasChannels}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Сканировать
        </Button>
      </div>

      {!hasChannels ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Добавьте каналы для анализа</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Trend Radar анализирует контент конкурентов и выявляет популярные темы
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => setIsAddingChannel(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить канал
              </Button>
              <Link href="/dashboard/channels">
                <Button variant="outline" className="gap-2">
                  <Radio className="h-4 w-4" />
                  Отслеживаемые каналы
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Empty Analysis Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Горячие темы
              </CardTitle>
              <CardDescription>
                Популярные темы у отслеживаемых каналов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="font-medium mb-2">Нет данных</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                  Запустите сканирование, чтобы проанализировать контент отслеживаемых каналов
                </p>
                <Button onClick={handleScan} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Сканировать
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracked Channels */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Каналы для анализа</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingChannel(true)}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add channel form */}
              {isAddingChannel && (
                <div className="rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 p-4 mb-4">
                  <Label className="mb-2 block text-sm">Username канала</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newChannel}
                      onChange={(e) => setNewChannel(e.target.value)}
                      placeholder="@channel_name"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={handleAddChannel}>Добавить</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingChannel(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              )}

              {allChannels.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет добавленных каналов
                </p>
              ) : (
                allChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="rounded-xl bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{channel.title}</h4>
                        <a
                          href={`https://t.me/${channel.username.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {channel.username}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeChannel(channel.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {channel.lastScan && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Обновлено: {channel.lastScan}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <underDev.Modal />
    </div>
  );
}
