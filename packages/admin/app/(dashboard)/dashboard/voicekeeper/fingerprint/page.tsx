"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";
import { UnderDevelopmentModal, useUnderDevelopment } from "@/components/ui/under-development-modal";
import {
  Fingerprint,
  RefreshCw,
  Save,
  Pencil,
  Bot,
  Plus,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface StyleProfile {
  tone: string;
  structure: string;
  vocabulary: string;
  signature: string;
  emoji: string;
}

export default function FingerprintPage() {
  const { bots } = useAuth();
  const underDev = useUnderDevelopment();
  
  const [channelToAnalyze, setChannelToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  
  const [styleProfile, setStyleProfile] = useState<StyleProfile>({
    tone: "",
    structure: "",
    vocabulary: "",
    signature: "",
    emoji: "",
  });

  const hasBots = bots.length > 0;

  const handleAnalyze = () => {
    if (!channelToAnalyze.trim()) {
      toast({ title: "Введите username канала", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    
    // Show under development modal
    underDev.showModal(
      "Анализ Voice Fingerprint",
      "AI анализ вашего авторского стиля на основе существующих постов. Требуется минимум 10 опубликованных постов для точного определения стиля."
    );
    
    setIsAnalyzing(false);
  };

  const handleSaveManual = () => {
    const hasAnyValue = Object.values(styleProfile).some(v => v.trim());
    if (!hasAnyValue) {
      toast({ title: "Заполните хотя бы одно поле", variant: "destructive" });
      return;
    }
    
    setIsEditing(false);
    setHasFingerprint(true);
    toast({ title: "Профиль сохранён", variant: "success" });
  };

  if (!hasBots) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
              <Fingerprint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-display">Voice Fingerprint</h1>
              <p className="text-muted-foreground">
                Ваш уникальный авторский стиль
              </p>
            </div>
          </div>
        </div>

        <Card className="py-12">
          <CardContent className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Сначала добавьте бота</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Voice Fingerprint анализирует контент вашего канала для определения стиля
            </p>
            <Link href="/dashboard/bots">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить бота
              </Button>
            </Link>
          </CardContent>
        </Card>

        <underDev.Modal />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
            <Fingerprint className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Voice Fingerprint</h1>
            <p className="text-muted-foreground">
              Ваш уникальный авторский стиль
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveManual} className="gap-2">
                <Save className="h-4 w-4" />
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              {hasFingerprint ? "Редактировать" : "Настроить вручную"}
            </Button>
          )}
        </div>
      </div>

      {/* Status card */}
      {hasFingerprint ? (
        <Card className="bg-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium">Fingerprint настроен</p>
                  <p className="text-sm text-muted-foreground">
                    Генерация будет использовать ваш стиль
                  </p>
                </div>
              </div>
              <Badge variant="success">Активен</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div>
                <p className="font-medium">Fingerprint не настроен</p>
                <p className="text-sm text-muted-foreground">
                  Настройте стиль вручную или запустите автоматический анализ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Style Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Профиль стиля</CardTitle>
            <CardDescription>
              Характеристики вашего авторского голоса
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(styleProfile).map(([key, value]) => {
              const labels: Record<string, { label: string; placeholder: string }> = {
                tone: { 
                  label: "Тональность", 
                  placeholder: "Профессиональный, но дружелюбный" 
                },
                structure: { 
                  label: "Структура", 
                  placeholder: "Короткие абзацы, списки, призыв к действию в конце" 
                },
                vocabulary: { 
                  label: "Словарный запас", 
                  placeholder: "Технический с упрощениями, много английских терминов" 
                },
                signature: { 
                  label: "Фишки стиля", 
                  placeholder: "Начинает с вопроса, заканчивает CTA" 
                },
                emoji: { 
                  label: "Эмодзи", 
                  placeholder: "Умеренное использование: 🔥 💡 ✅ 📈" 
                },
              };

              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{labels[key].label}</Label>
                  {isEditing ? (
                    <Input
                      value={value}
                      onChange={(e) =>
                        setStyleProfile({ ...styleProfile, [key]: e.target.value })
                      }
                      placeholder={labels[key].placeholder}
                    />
                  ) : (
                    <p className="text-sm bg-white/[0.02] rounded-lg px-3 py-2">
                      {value || <span className="text-muted-foreground">Не задано</span>}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Auto-analyze */}
        <Card>
          <CardHeader>
            <CardTitle>Автоматический анализ</CardTitle>
            <CardDescription>
              AI проанализирует ваши посты и определит стиль
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username канала для анализа</Label>
              <Input
                value={channelToAnalyze}
                onChange={(e) => setChannelToAnalyze(e.target.value)}
                placeholder="@your_channel"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Анализируем..." : "Запустить анализ"}
            </Button>

            <div className="rounded-lg bg-white/[0.02] p-3 text-sm text-muted-foreground">
              <p>
                AI проанализирует последние 50 постов и определит ваш уникальный стиль письма
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <underDev.Modal />
    </div>
  );
}
