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
  Loader2,
} from "lucide-react";

export default function BotsPage() {
  const { bots, addBot, removeBot, updateBot } = useAuth();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [newBotToken, setNewBotToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState<Record<string, boolean>>({});

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

  const toggleBotStatus = (botId: string, isActive: boolean) => {
    updateBot(botId, { isActive: !isActive });
  };

  const handleDeleteBot = (botId: string) => {
    removeBot(botId);
    toast({ title: "Бот удален", variant: "success" });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({ title: "Токен скопирован" });
  };

  const botColors: Record<string, string> = {
    "demo-1": "from-blue-500 to-cyan-500",
    "default": "from-red-500 to-emerald-500",
  };

  const getColor = (botId: string) => botColors[botId] || botColors["default"];

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

      {/* Bots Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  onCheckedChange={() => toggleBotStatus(bot.id, bot.isActive)}
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
                  <code className="flex-1 rounded-lg bg-white/[0.03] px-2 py-1 font-mono text-xs">
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
                  {bot.channelUsername ? (
                    <Badge variant="secondary">{bot.channelUsername}</Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
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
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.03]">
                <Button variant="ghost" size="sm" className="flex-1 gap-1">
                  <Settings className="h-3 w-3" />
                  Настройки
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteBot(bot.id)}
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
            className="flex cursor-pointer items-center justify-center hover:bg-white/[0.02] transition-all duration-300 min-h-[320px] shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]"
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
