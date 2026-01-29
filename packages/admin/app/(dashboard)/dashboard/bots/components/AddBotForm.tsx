"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, toast } from "@/ui";
import { Loader2, Zap } from "lucide-react";

interface AddBotFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  addBot: (token: string) => Promise<void>;
}

export function AddBotForm({ onSuccess, onCancel, addBot }: AddBotFormProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast({ title: "Ошибка", description: "Введите токен бота", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      await addBot(token);
      setToken("");
      onSuccess();
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

  return (
    <Card className="bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
      <CardHeader className="p-2 pb-1.5">
        <CardTitle className="text-[11px]">Добавить нового бота</CardTitle>
        <CardDescription className="text-[9px]">
          Получите токен у @BotFather в Telegram и вставьте его ниже
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 p-2">
        <div className="space-y-1">
          <Label htmlFor="bot-token" className="text-[10px]">Токен бота</Label>
          <div className="flex gap-1.5">
            <Input
              id="bot-token"
              placeholder="7123456789:AAH..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono h-6 text-[10px]"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={isLoading} size="sm" className="h-6 text-[9px]">
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Добавить"}
            </Button>
            <Button variant="ghost" onClick={onCancel} disabled={isLoading} size="sm" className="h-6 text-[9px]">
              Отмена
            </Button>
          </div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <h4 className="font-medium mb-1.5 flex items-center gap-1.5 text-[10px]">
            <Zap className="h-3 w-3 text-amber-400" />
            Как получить токен:
          </h4>
          <ol className="list-decimal list-inside space-y-0.5 text-[9px] text-muted-foreground">
            <li>Откройте <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@BotFather</a> в Telegram</li>
            <li>Отправьте команду /newbot</li>
            <li>Следуйте инструкциям и скопируйте токен</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

