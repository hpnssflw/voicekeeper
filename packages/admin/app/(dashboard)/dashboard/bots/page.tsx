"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";
import { botsApi, postsApi, type Post } from "@/lib/api";
import {
  Bot,
  Plus,
  Settings,
  Trash2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  FileText,
  Zap,
  Loader2,
  MessageSquare,
  Hash,
  Calendar,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

interface BotDetails {
  id: string;
  username: string;
  firstName?: string;
  telegramId?: number;
  isActive: boolean;
  channel?: {
    id: number | string;
    username?: string;
    title?: string;
    membersCount?: number;
  } | null;
  stats?: {
    postsCount: number;
    publishedCount: number;
  };
}

export default function BotsPage() {
  const { bots, addBot, removeBot, updateBot, user } = useAuth();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [newBotToken, setNewBotToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState<Record<string, boolean>>({});
  const [expandedBot, setExpandedBot] = useState<string | null>(null);
  const [botDetails, setBotDetails] = useState<Record<string, BotDetails>>({});
  const [botPosts, setBotPosts] = useState<Record<string, Post[]>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [channelInput, setChannelInput] = useState<Record<string, string>>({});
  const [settingChannel, setSettingChannel] = useState<Record<string, boolean>>({});

  const handleAddBot = async () => {
    if (!newBotToken.trim()) {
      toast({ title: "Ошибка", description: "Введите токен бота", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      await addBot(newBotToken);
      setNewBotToken("");
      setIsAddingBot(false);
      toast({ title: "Бот добавлен", description: "Теперь настройте канал для публикаций", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить бота",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBotStatus = async (botId: string, isActive: boolean) => {
    updateBot(botId, { isActive: !isActive });
    
    try {
      await botsApi.update(botId, { isActive: !isActive });
    } catch (error) {
      console.warn("Could not update bot status on server:", error);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    removeBot(botId);
    
    try {
      await botsApi.delete(botId);
    } catch (error) {
      console.warn("Could not delete bot on server:", error);
    }
    
    toast({ title: "Бот удален", variant: "success" });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({ title: "Токен скопирован" });
  };

  const loadBotDetails = async (botId: string) => {
    if (loadingDetails[botId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [botId]: true }));
    
    try {
      // Load bot details from API
      const details = await botsApi.get(botId);
      setBotDetails(prev => ({ ...prev, [botId]: details }));
      
      // Load posts for this bot
      const postsResponse = await postsApi.list({ botId, limit: 10 });
      setBotPosts(prev => ({ ...prev, [botId]: postsResponse.data || [] }));
    } catch (error) {
      console.warn("Could not load bot details:", error);
      // Use local data as fallback
      const localBot = bots.find(b => b.id === botId);
      if (localBot) {
        setBotDetails(prev => ({
          ...prev,
          [botId]: {
            id: localBot.id,
            username: localBot.username.replace('@', ''),
            firstName: localBot.name,
            telegramId: localBot.telegramId,
            isActive: localBot.isActive,
            channel: localBot.channelId ? {
              id: localBot.channelId,
              username: localBot.channelUsername,
              title: localBot.channelTitle,
            } : null,
            stats: {
              postsCount: localBot.postsCount,
              publishedCount: 0,
            },
          },
        }));
      }
    } finally {
      setLoadingDetails(prev => ({ ...prev, [botId]: false }));
    }
  };

  const toggleExpanded = (botId: string) => {
    if (expandedBot === botId) {
      setExpandedBot(null);
    } else {
      setExpandedBot(botId);
      loadBotDetails(botId);
    }
  };

  const handleSetChannel = async (botId: string) => {
    const channelId = channelInput[botId];
    if (!channelId?.trim()) return;
    
    setSettingChannel(prev => ({ ...prev, [botId]: true }));
    
    try {
      const response = await botsApi.update(botId, { channelId });
      
      // Update local state
      updateBot(botId, {
        channelId: response.channelId,
        channelUsername: response.channelUsername,
      });
      
      // Refresh details
      await loadBotDetails(botId);
      
      setChannelInput(prev => ({ ...prev, [botId]: '' }));
      toast({ title: "Канал настроен", variant: "success" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось настроить канал",
        variant: "destructive",
      });
    } finally {
      setSettingChannel(prev => ({ ...prev, [botId]: false }));
    }
  };

  const botColors: Record<string, string> = {
    "demo-1": "from-blue-500 to-cyan-500",
    "default": "from-red-500 to-emerald-500",
  };

  const getColor = (botId: string) => botColors[botId] || botColors["default"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Опубликован</Badge>;
      case 'scheduled':
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />Запланирован</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" />Черновик</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Управление ботами</h1>
          <p className="text-muted-foreground">
            Добавляйте и настраивайте Telegram-ботов для ваших каналов
          </p>
        </div>
        <Button onClick={() => setIsAddingBot(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить бота
        </Button>
      </div>

      {/* Add Bot Form */}
      {isAddingBot && (
        <Card className="bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
          <CardHeader>
            <CardTitle className="text-lg">Добавить нового бота</CardTitle>
            <CardDescription>
              Получите токен у @BotFather в Telegram и вставьте его ниже
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot-token">Токен бота</Label>
              <div className="flex gap-2">
                <Input
                  id="bot-token"
                  placeholder="7123456789:AAH..."
                  value={newBotToken}
                  onChange={(e) => setNewBotToken(e.target.value)}
                  className="font-mono"
                  disabled={isLoading}
                />
                <Button onClick={handleAddBot} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Добавить"}
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingBot(false)} disabled={isLoading}>
                  Отмена
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Как получить токен:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Откройте <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline">@BotFather</a> в Telegram</li>
                <li>Отправьте команду /newbot</li>
                <li>Следуйте инструкциям и скопируйте токен</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bots List */}
      <div className="space-y-4">
        {bots.map((bot) => (
          <Card key={bot.id} className={`card-hover ${!bot.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                      bot.isActive ? getColor(bot.id) : "from-muted to-muted"
                    }`}
                  >
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {bot.name}
                      {bot.telegramId && (
                        <Badge variant="outline" className="text-xs font-mono">
                          ID: {bot.telegramId}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {bot.username}
                      <a
                        href={`https://t.me/${bot.username.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={bot.isActive}
                    onCheckedChange={() => toggleBotStatus(bot.id, bot.isActive)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpanded(bot.id)}
                  >
                    {expandedBot === bot.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{bot.subscriberCount.toLocaleString()} подписчиков</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{bot.postsCount} постов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {bot.channelUsername ? (
                      <a 
                        href={`https://t.me/${bot.channelUsername.replace('@', '')}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        {bot.channelUsername}
                      </a>
                    ) : (
                      <span className="text-amber-400">Канал не настроен</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedBot === bot.id && (
                <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                  {loadingDetails[bot.id] ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {/* Token Section */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Токен бота</Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded-lg bg-white/[0.03] px-3 py-2 font-mono text-xs">
                            {showToken[bot.id] ? bot.token : "•".repeat(30)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowToken({ ...showToken, [bot.id]: !showToken[bot.id] })}
                          >
                            {showToken[bot.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToken(bot.token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Channel Settings */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Канал для публикаций</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="@channel_username или -100123456789"
                            value={channelInput[bot.id] || ''}
                            onChange={(e) => setChannelInput(prev => ({ ...prev, [bot.id]: e.target.value }))}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleSetChannel(bot.id)}
                            disabled={settingChannel[bot.id] || !channelInput[bot.id]?.trim()}
                          >
                            {settingChannel[bot.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Настроить"
                            )}
                          </Button>
                        </div>
                        {botDetails[bot.id]?.channel && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>
                              Текущий канал: <strong>{botDetails[bot.id]?.channel?.title || botDetails[bot.id]?.channel?.username}</strong>
                              {botDetails[bot.id]?.channel?.membersCount && (
                                <span className="ml-2">({botDetails[bot.id]?.channel?.membersCount?.toLocaleString()} подписчиков)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Posts Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Последние посты</Label>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            Все посты →
                          </Button>
                        </div>
                        
                        {botPosts[bot.id]?.length > 0 ? (
                          <div className="space-y-2">
                            {botPosts[bot.id].slice(0, 5).map((post) => (
                              <div
                                key={post._id}
                                className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {post.title || post.content?.substring(0, 50) || 'Без заголовка'}
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(post.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Нет постов</p>
                            <Button variant="link" size="sm" className="mt-2">
                              Создать первый пост
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Bot Card */}
        {!isAddingBot && bots.length === 0 && (
          <Card
            className="flex cursor-pointer items-center justify-center hover:bg-white/[0.02] transition-all duration-300 min-h-[200px] shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]"
            onClick={() => setIsAddingBot(true)}
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 group-hover:border-primary">
                <Plus className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-3 font-medium font-display">Добавить бота</p>
              <p className="text-sm text-muted-foreground">
                Подключите нового Telegram-бота
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
