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
import { useAuth } from "@/lib/auth";
import { UnderDevelopmentModal, useUnderDevelopment } from "@/components/ui/under-development-modal";
import {
  Sparkles,
  Wand2,
  Copy,
  Send,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Fingerprint,
  Bot,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function GeneratePage() {
  const { user, bots } = useAuth();
  const underDev = useUnderDevelopment();
  
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"friendly" | "professional" | "provocative">("friendly");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    mainVersion: string;
    alternatives: string[];
    confidence: number;
  } | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(0);

  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;
  const canGenerate = generationsUsed < generationsLimit;
  const hasBots = bots.length > 0;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Введите тему", variant: "destructive" });
      return;
    }

    if (!canGenerate) {
      toast({ 
        title: "Лимит исчерпан", 
        description: "Перейдите на Pro для большего количества генераций",
        variant: "destructive" 
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    // This would call actual AI API
    underDev.showModal(
      "AI Генерация контента",
      "Генерация постов с использованием Google Gemini AI. Убедитесь, что API ключ настроен в разделе Настройки → API ключи."
    );
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = selectedVersion === 0 ? result.mainVersion : result.alternatives[selectedVersion - 1];
    navigator.clipboard.writeText(text);
    toast({ title: "Скопировано в буфер обмена" });
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Создать пост с AI</h1>
            <p className="text-muted-foreground">
              Генерация контента в вашем уникальном стиле
            </p>
          </div>
        </div>

        <Card className="py-12">
          <CardContent className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Сначала добавьте бота</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Для генерации и публикации контента нужен подключенный Telegram-бот
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/voicekeeper">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Создать пост с AI</h1>
          <p className="text-muted-foreground">
            Генерация контента в вашем уникальном стиле
          </p>
        </div>
      </div>

      {/* Generations limit banner */}
      {!canGenerate && (
        <Card className="bg-amber-500/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Лимит генераций исчерпан</p>
              <p className="text-sm text-muted-foreground">
                Использовано {generationsUsed} из {generationsLimit} генераций
              </p>
            </div>
            <Link href="/dashboard/settings/subscription">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Улучшить план
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Параметры генерации</CardTitle>
              <CardDescription>
                Опишите тему и настройте параметры
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">Тема поста *</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="О чём хотите написать?"
                  className="h-12"
                />
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label>Тон</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "friendly", label: "Дружелюбный", emoji: "😊" },
                    { value: "professional", label: "Профессиональный", emoji: "💼" },
                    { value: "provocative", label: "Провокационный", emoji: "🔥" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value as typeof tone)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        tone === option.value
                          ? "border-red-500 bg-red-500/10 ring-2 ring-red-500/20"
                          : "border-white/10 hover:bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <p className="mt-1 text-sm font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <Label>Длина</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "short", label: "Короткий", desc: "~200 символов" },
                    { value: "medium", label: "Средний", desc: "~500 символов" },
                    { value: "long", label: "Длинный", desc: "~1000 символов" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLength(option.value as typeof length)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        length === option.value
                          ? "border-red-500 bg-red-500/10 ring-2 ring-red-500/20"
                          : "border-white/10 hover:bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="emoji"
                    checked={includeEmoji}
                    onCheckedChange={setIncludeEmoji}
                  />
                  <Label htmlFor="emoji" className="text-sm">Эмодзи</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="cta"
                    checked={includeCta}
                    onCheckedChange={setIncludeCta}
                  />
                  <Label htmlFor="cta" className="text-sm">Призыв к действию</Label>
                </div>
              </div>

              {/* Custom instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Дополнительные инструкции</Label>
                <textarea
                  id="instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Добавь личную историю, упомяни конкретный продукт..."
                  className="w-full h-20 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                />
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim() || !canGenerate}
                variant="gradient"
                className="w-full gap-2 h-12"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Генерируем...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Создать пост
                  </>
                )}
              </Button>

              {/* Remaining generations */}
              <p className="text-center text-sm text-muted-foreground">
                Осталось {generationsLimit - generationsUsed} генераций
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-6">
          <Card className={!result ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Результат</CardTitle>
                  <CardDescription>
                    {result
                      ? `Уверенность: ${result.confidence}%`
                      : "Здесь появится сгенерированный контент"}
                  </CardDescription>
                </div>
                {result && (
                  <Badge variant="success" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Готово
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  {/* Version selector */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVersion(0)}
                      className={`flex-1 rounded-xl border p-2 text-sm font-medium transition-all ${
                        selectedVersion === 0
                          ? "border-red-500 bg-red-500/10"
                          : "border-white/10 hover:bg-white/[0.03]"
                      }`}
                    >
                      Основная
                    </button>
                    {result.alternatives.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVersion(idx + 1)}
                        className={`flex-1 rounded-xl border p-2 text-sm font-medium transition-all ${
                          selectedVersion === idx + 1
                            ? "border-red-500 bg-red-500/10"
                            : "border-white/10 hover:bg-white/[0.03]"
                        }`}
                      >
                        Вариант {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="rounded-xl bg-white/[0.02] p-4">
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {selectedVersion === 0
                        ? result.mainVersion
                        : result.alternatives[selectedVersion - 1]}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Копировать
                    </Button>
                    <Button onClick={handleGenerate} variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Ещё раз
                    </Button>
                    <Button className="gap-2 ml-auto">
                      <Send className="h-4 w-4" />
                      Создать пост
                    </Button>
                  </div>

                  {/* Feedback */}
                  <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                    <span className="text-sm text-muted-foreground">
                      Оцените качество генерации
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                        <ThumbsUp className="h-4 w-4" />
                        Хорошо
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                        <ThumbsDown className="h-4 w-4" />
                        Плохо
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Введите тему и нажмите «Создать пост»
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Fingerprint Preview */}
          <Card className="bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FeatureIcon icon={Fingerprint} variant="primary" size="md" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Voice Fingerprint</p>
                  <p className="text-xs text-muted-foreground">
                    Настройте стиль генерации под ваш авторский голос
                  </p>
                </div>
                <Link href="/dashboard/voicekeeper/fingerprint">
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    Настроить
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <underDev.Modal />
    </div>
  );
}
