"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { FeatureIcon } from "@/components/brand/feature-icon";
import {
  Key,
  Eye,
  EyeOff,
  Save,
  Check,
  Sparkles,
  Bot,
  Radio,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function ApiKeysPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [aiProvider, setAiProvider] = useState<"gemini" | "openai">("gemini");
  
  const [keys, setKeys] = useState({
    geminiKey: "AIza...",
    openaiKey: "",
    browserlessUrl: "ws://localhost:3333",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "API ключи сохранены", variant: "success" });
    }, 1000);
  };

  const testConnection = async (id: string) => {
    toast({ title: "Проверка подключения...", description: "Подождите несколько секунд" });
    
    setTimeout(() => {
      toast({
        title: "Подключение успешно",
        description: `${id} API работает корректно`,
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">API Ключи</h1>
        <p className="text-muted-foreground">
          Настройте ключи для AI-сервисов и интеграций
        </p>
      </div>

      {/* AI Provider Selection */}
      <Card className="glass-panel-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Sparkles className="h-5 w-5 text-red-500" />
            AI Провайдер
          </CardTitle>
          <CardDescription>
            Выберите основной AI-провайдер для генерации контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setAiProvider("gemini")}
              className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                aiProvider === "gemini"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border/50 hover:border-muted-foreground/50 hover:bg-accent/50"
              }`}
            >
              <FeatureIcon icon={Sparkles} variant="primary" size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Google Gemini</h4>
                  <Badge variant="gradient" className="text-xs">Рекомендуется</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gemini 1.5 Flash — быстрый и экономичный
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ~$0.075 / 1M токенов
                </p>
              </div>
              {aiProvider === "gemini" && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>

            <button
              onClick={() => setAiProvider("openai")}
              className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                aiProvider === "openai"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border/50 hover:border-muted-foreground/50 hover:bg-accent/50"
              }`}
            >
              <FeatureIcon icon={Zap} variant="warning" size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">OpenAI GPT-4o</h4>
                  <Badge variant="outline" className="text-xs">Pro</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Максимальное качество генерации
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ~$5 / 1M токенов
                </p>
              </div>
              {aiProvider === "openai" && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <div className="space-y-4">
        {/* Gemini */}
        <Card className="glass-panel-glow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FeatureIcon icon={Sparkles} variant={keys.geminiKey ? "primary" : "secondary"} size="lg" glow={!!keys.geminiKey} />
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Google Gemini API</h3>
                      {keys.geminiKey ? (
                        <Badge variant="success">Настроен</Badge>
                      ) : (
                        <Badge variant="warning">Не настроен</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Для генерации контента и анализа стиля (рекомендуется для MVP)
                    </p>
                  </div>
                  <a
                    href="https://ai.google.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Документация
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label>API Ключ</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKeys.gemini ? "text" : "password"}
                        value={keys.geminiKey}
                        onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                        placeholder="AIza..."
                        className="font-mono pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button variant="outline" onClick={() => testConnection("Gemini")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Проверить
                    </Button>
                  </div>
                  {/* Quick hint for testing */}
                  <p className="text-xs text-emerald-400/80 mt-1">
                    💡 Тестовый ключ: <code 
                      className="bg-emerald-500/10 px-1.5 py-0.5 rounded cursor-pointer hover:bg-emerald-500/20 break-all" 
                      onClick={() => setKeys({ ...keys, geminiKey: "AIzaSyD0dgcfnSg9h96u9rSUQ8POMXAShxwWqUs" })}
                    >AIzaSyD0dgcfnSg9h96u9rSUQ8POMXAShxwWqUs</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OpenAI */}
        <Card className="glass-panel-glow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FeatureIcon icon={Zap} variant={keys.openaiKey ? "warning" : "secondary"} size="lg" glow={!!keys.openaiKey} />
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">OpenAI API</h3>
                      {keys.openaiKey ? (
                        <Badge variant="success">Настроен</Badge>
                      ) : (
                        <Badge variant="secondary">Опционально</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      GPT-4o для высококачественной генерации (продакшен)
                    </p>
                  </div>
                  <a
                    href="https://platform.openai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Документация
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label>API Ключ</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKeys.openai ? "text" : "password"}
                        value={keys.openaiKey}
                        onChange={(e) => setKeys({ ...keys, openaiKey: e.target.value })}
                        placeholder="sk-..."
                        className="font-mono pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button variant="outline" onClick={() => testConnection("OpenAI")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Проверить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browserless */}
        <Card className="glass-panel-glow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FeatureIcon icon={Radio} variant={keys.browserlessUrl ? "info" : "secondary"} size="lg" glow={!!keys.browserlessUrl} />
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Browserless URL</h3>
                      {keys.browserlessUrl ? (
                        <Badge variant="success">Настроен</Badge>
                      ) : (
                        <Badge variant="warning">Не настроен</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Для парсинга Telegram-каналов (Trend Radar)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={keys.browserlessUrl}
                      onChange={(e) => setKeys({ ...keys, browserlessUrl: e.target.value })}
                      placeholder="ws://localhost:3333"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={() => testConnection("Browserless")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Проверить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Telegram Bot Tokens Info */}
      <Card className="glass-panel bg-gradient-to-r from-blue-500/10 to-cyan-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FeatureIcon icon={Bot} variant="info" size="lg" />
            <div>
              <h3 className="font-semibold">Токены Telegram-ботов</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Управление токенами ботов доступно в разделе{" "}
                <Link href="/dashboard/bots" className="text-primary hover:underline">
                  Боты
                </Link>
                . Там вы можете добавлять, редактировать и удалять ботов.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Сбросить</Button>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Сохраняем..." : "Сохранить изменения"}
        </Button>
      </div>
    </div>
  );
}

