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
  Sparkles,
  Wand2,
  Copy,
  Send,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";

const trendSuggestions = [
  { topic: "AI-инструменты для контент-маркетолога", score: 92 },
  { topic: "Как автоматизировать Telegram-канал", score: 87 },
  { topic: "5 ошибок начинающих авторов", score: 84 },
];

export default function GeneratePage() {
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

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Введите тему", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        mainVersion: `Друзья, сегодня хочу поделиться мыслями о ${topic.toLowerCase()}. 🚀

На самом деле, это тема, которая волнует многих из вас. И я решил разобраться в ней подробнее.

Вот что я выяснил:

1️⃣ Первый важный момент — нужно понимать контекст и текущие тренды

2️⃣ Второе — не бояться экспериментировать с новыми подходами

3️⃣ Третье — постоянно анализировать результаты и корректировать стратегию

Что думаете? Делитесь в комментариях! 👇`,
        alternatives: [
          `А вы знали, что ${topic.toLowerCase()} может кардинально изменить ваш подход к контенту?

Я провёл небольшое исследование и вот что обнаружил...

[Продолжение в следующем посте]`,
          `Вопрос к вам: как часто вы думаете о ${topic.toLowerCase()}?

Я заметил интересную тенденцию — те, кто уделяет этому внимание, получают в 2-3 раза больше вовлечённости.

Давайте разберёмся почему... 🤔`,
        ],
        confidence: 89,
      });
      setIsGenerating(false);
      toast({ title: "Готово!", description: "Контент сгенерирован", variant: "success" });
    }, 3000);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = selectedVersion === 0 ? result.mainVersion : result.alternatives[selectedVersion - 1];
    navigator.clipboard.writeText(text);
    toast({ title: "Скопировано в буфер обмена" });
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Создать пост с AI</h1>
          <p className="text-muted-foreground">
            Генерация контента в вашем уникальном стиле
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
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

              {/* Trend suggestions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Горячие темы в нише
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.topic}
                      onClick={() => setTopic(suggestion.topic)}
                      className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm hover:bg-accent hover:border-primary/50 transition-all"
                    >
                      <Lightbulb className="h-3 w-3 text-amber-500" />
                      <span className="truncate max-w-[180px]">{suggestion.topic}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {suggestion.score}%
                      </Badge>
                    </button>
                  ))}
                </div>
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
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border/50 hover:bg-accent hover:border-muted-foreground/50"
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
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border/50 hover:bg-accent hover:border-muted-foreground/50"
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
                  className="w-full h-20 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full gap-2 h-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
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
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-6">
          <Card className={`border-border/50 bg-card/50 backdrop-blur-sm ${!result ? "opacity-50" : ""}`}>
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
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:bg-accent"
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
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:bg-accent"
                        }`}
                      >
                        Вариант {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
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
                  <div className="flex items-center justify-between rounded-xl border border-border/50 p-3">
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
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
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FeatureIcon icon={Fingerprint} variant="primary" size="md" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Voice Fingerprint активен</p>
                  <p className="text-xs text-muted-foreground">
                    Генерация в вашем стиле: позитивный тон, неформальный, с эмодзи
                  </p>
                </div>
                <Link href="/dashboard/voicekeeper/fingerprint">
                  <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
                    Настроить
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

