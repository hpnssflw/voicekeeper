"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";
import { UnderDevelopmentModal, useUnderDevelopment } from "@/components/ui/under-development-modal";
import {
  Radio,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Clock,
  RefreshCw,
  Loader2,
  Search,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function ChannelsPage() {
  const { channels, addChannel, removeChannel } = useAuth();
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelUsername, setNewChannelUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const underDev = useUnderDevelopment();

  const handleAddChannel = async () => {
    if (!newChannelUsername.trim()) {
      toast({ title: "Ошибка", description: "Введите username канала", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      await addChannel(newChannelUsername);
      setNewChannelUsername("");
      setIsAddingChannel(false);
      toast({ title: "Канал добавлен", description: "Парсинг будет доступен скоро", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить канал",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    removeChannel(channelId);
    toast({ title: "Канал удален", variant: "success" });
  };

  const handleStartParsing = () => {
    underDev.showModal(
      "Парсинг каналов",
      "Автоматический сбор и анализ постов из отслеживаемых каналов. Эта функция позволит анализировать контент конкурентов и выявлять тренды."
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Отслеживаемые каналы</h1>
          <p className="text-muted-foreground">
            Добавьте каналы для анализа контента и мониторинга трендов
          </p>
        </div>
        <Button onClick={() => setIsAddingChannel(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить канал
        </Button>
      </div>

      {/* Add Channel Form */}
      {isAddingChannel && (
        <Card className="bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
          <CardHeader>
            <CardTitle className="text-lg">Добавить канал для отслеживания</CardTitle>
            <CardDescription>
              Укажите username публичного Telegram-канала
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel-username">Username канала</Label>
              <div className="flex gap-2">
                <Input
                  id="channel-username"
                  placeholder="@channel_name"
                  value={newChannelUsername}
                  onChange={(e) => setNewChannelUsername(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleAddChannel} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Добавить"}
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingChannel(false)} disabled={isLoading}>
                  Отмена
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Что даёт отслеживание:
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Анализ популярных тем и форматов</li>
                <li>• Мониторинг активности конкурентов</li>
                <li>• Выявление трендов в вашей нише</li>
                <li>• Вдохновение для нового контента</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channels Grid */}
      {channels.length === 0 && !isAddingChannel ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Нет отслеживаемых каналов</h3>
            <p className="text-muted-foreground mb-4">
              Добавьте каналы конкурентов или каналы в вашей нише для анализа
            </p>
            <Button onClick={() => setIsAddingChannel(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить первый канал
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg">
                      <Radio className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{channel.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        {channel.username}
                        <a
                          href={`https://t.me/${channel.username.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={channel.isTracking}
                    onCheckedChange={() => {
                      // Toggle tracking
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{channel.memberCount?.toLocaleString() || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{channel.lastParsed ? "Недавно" : "Не парсился"}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Статус</Label>
                  <div className="flex items-center justify-between">
                    <Badge variant={channel.isTracking ? "success" : "secondary"}>
                      {channel.isTracking ? "Активен" : "Приостановлен"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs gap-1"
                      onClick={handleStartParsing}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Парсинг
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.03]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={handleStartParsing}
                  >
                    <FileText className="h-3 w-3" />
                    Посты
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteChannel(channel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Channel Card */}
          {!isAddingChannel && (
            <Card
              className="flex cursor-pointer items-center justify-center hover:bg-white/[0.02] transition-all duration-300 min-h-[280px] shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]"
              onClick={() => setIsAddingChannel(true)}
            >
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
                  <Plus className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="mt-3 font-medium font-display">Добавить канал</p>
                <p className="text-sm text-muted-foreground">
                  Отслеживайте контент конкурентов
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Under Development Modal */}
      <underDev.Modal />
    </div>
  );
}

