"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { FeatureIcon } from "@/components/brand/feature-icon";
import {
  Bot,
  Plus,
  Settings,
  Trash2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Users,
  FileText,
  Zap,
} from "lucide-react";

interface BotData {
  id: string;
  name: string;
  username: string;
  token: string;
  isActive: boolean;
  channelId: string;
  subscriberCount: number;
  postsCount: number;
  color: string;
  createdAt: string;
}

const initialBots: BotData[] = [
  {
    id: "1",
    name: "Content Channel Bot",
    username: "@content_bot",
    token: "7123456789:AAH...",
    isActive: true,
    channelId: "@content_channel",
    subscriberCount: 8450,
    postsCount: 89,
    color: "from-blue-500 to-cyan-500",
    createdAt: "2025-11-15",
  },
  {
    id: "2",
    name: "Marketing Bot",
    username: "@marketing_bot",
    token: "7987654321:BBK...",
    isActive: true,
    channelId: "@marketing_news",
    subscriberCount: 4200,
    postsCount: 34,
    color: "from-emerald-500 to-teal-500",
    createdAt: "2025-12-01",
  },
  {
    id: "3",
    name: "News Bot",
    username: "@news_channel_bot",
    token: "7555555555:CCL...",
    isActive: false,
    channelId: "",
    subscriberCount: 1550,
    postsCount: 4,
    color: "from-amber-500 to-orange-500",
    createdAt: "2026-01-10",
  },
];

export default function BotsPage() {
  const [bots, setBots] = useState<BotData[]>(initialBots);
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [newBotToken, setNewBotToken] = useState("");
  const [showToken, setShowToken] = useState<Record<string, boolean>>({});

  const handleAddBot = async () => {
    if (!newBotToken.trim()) {
      toast({ title: "Ошибка", description: "Введите токен бота", variant: "destructive" });
      return;
    }

    toast({ title: "Проверяем токен...", description: "Подождите несколько секунд" });
    
    setTimeout(() => {
      const newBot: BotData = {
        id: Date.now().toString(),
        name: "New Bot",
        username: "@new_bot_" + Date.now(),
        token: newBotToken,
        isActive: true,
        channelId: "",
        subscriberCount: 0,
        postsCount: 0,
        color: "from-violet-500 to-purple-500",
        createdAt: new Date().toISOString().split("T")[0],
      };
      
      setBots([...bots, newBot]);
      setNewBotToken("");
      setIsAddingBot(false);
      toast({ title: "Бот добавлен", description: "Теперь настройте канал для публикаций", variant: "success" });
    }, 1500);
  };

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot => 
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
  };

  const deleteBot = (botId: string) => {
    setBots(bots.filter(bot => bot.id !== botId));
    toast({ title: "Бот удален", variant: "success" });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({ title: "Токен скопирован" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Управление ботами</h1>
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
        <Card className="border-dashed border-primary/50 bg-primary/5">
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
                />
                <Button onClick={handleAddBot}>Добавить</Button>
                <Button variant="ghost" onClick={() => setIsAddingBot(false)}>
                  Отмена
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Как получить токен:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Откройте @BotFather в Telegram</li>
                <li>Отправьте команду /newbot</li>
                <li>Следуйте инструкциям и скопируйте токен</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bots Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <Card key={bot.id} className={`border-border/50 bg-card/50 backdrop-blur-sm card-hover ${!bot.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                      bot.isActive ? bot.color : "from-muted to-muted"
                    }`}
                  >
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{bot.name}</CardTitle>
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
                <Switch
                  checked={bot.isActive}
                  onCheckedChange={() => toggleBotStatus(bot.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{bot.subscriberCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{bot.postsCount} постов</span>
                </div>
              </div>

              {/* Token */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Токен</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-muted/50 px-2 py-1 font-mono text-xs">
                    {showToken[bot.id] ? bot.token : "•".repeat(20)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowToken({ ...showToken, [bot.id]: !showToken[bot.id] })}
                  >
                    {showToken[bot.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyToken(bot.token)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Channel */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Канал для публикаций</Label>
                <div className="flex items-center justify-between">
                  {bot.channelId ? (
                    <Badge variant="secondary">{bot.channelId}</Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                      <AlertCircle className="h-3 w-3" />
                      Не настроен
                    </span>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Изменить
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex-1 gap-1">
                  <Settings className="h-3 w-3" />
                  Настройки
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteBot(bot.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Bot Card */}
        {!isAddingBot && (
          <Card
            className="flex cursor-pointer items-center justify-center border-dashed border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 min-h-[320px]"
            onClick={() => setIsAddingBot(true)}
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50 group-hover:border-primary">
                <Plus className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-3 font-medium">Добавить бота</p>
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

