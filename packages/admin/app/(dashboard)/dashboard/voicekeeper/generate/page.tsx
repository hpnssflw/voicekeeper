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
import { postsApi } from "@/lib/api";
import { generatePost, getFingerprint, getApiKey, type StyleProfile } from "@/lib/ai";
import {
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Fingerprint,
  Bot,
  Plus,
  Loader2,
  Check,
  Key,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GenerationResult {
  content: string;
  alternatives: string[];
  confidence: number;
}

export default function GeneratePage() {
  const router = useRouter();
  const { user, bots, selectedBotId } = useAuth();
  
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"friendly" | "professional" | "provocative">("friendly");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(0);
  
  const [hasApiKey, setHasApiKey] = useState(false);
  const [fingerprint, setFingerprintState] = useState<StyleProfile | null>(null);

  const hasBots = bots.length > 0;
  const selectedBot = bots.find(b => b.id === selectedBotId) || bots[0];

  // Load API key and fingerprint status
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiKey = await getApiKey("gemini");
        setHasApiKey(!!apiKey);
        const fingerprint = await getFingerprint();
        setFingerprintState(fingerprint);
      } catch (error) {
        console.error("Failed to load API key/fingerprint:", error);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Введите тему", variant: "destructive" });
      return;
    }

    if (!hasApiKey) {
      toast({ 
        title: "API ключ не настроен", 
        description: "Перейдите в Настройки → API ключи",
        variant: "destructive" 
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const generated = await generatePost({
        topic,
        tone,
        length,
        includeEmoji,
        includeCta,
        customInstructions,
        fingerprint: fingerprint || undefined,
      });

      setResult(generated);
      setSelectedVersion(0);
      toast({ title: "Пост сгенерирован!", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка генерации", 
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = selectedVersion === 0 ? result.content : result.alternatives[selectedVersion - 1];
    navigator.clipboard.writeText(text);
    toast({ title: "Скопировано" });
  };

  const saveAsPost = async () => {
    if (!result || !selectedBot) return;
    
    setIsSaving(true);
    try {
      const content = selectedVersion === 0 ? result.content : result.alternatives[selectedVersion - 1];
      await postsApi.create({
        botId: selectedBot.id,
        authorId: user?.id || "",
        title: topic,
        content,
        status: "draft",
      });
      toast({ title: "Сохранено как черновик", variant: "success" });
      router.push("/dashboard/posts");
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasBots) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-display">Создать пост с AI</h1>
            <p className="text-xs text-muted-foreground">Генерация в вашем стиле</p>
          </div>
        </div>
        <Card className="py-8">
          <CardContent className="text-center">
            <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-1">Сначала добавьте бота</h3>
            <p className="text-xs text-muted-foreground mb-3">Для сохранения постов нужен бот</p>
            <Link href="/dashboard/bots">
              <Button size="sm" className="gap-1"><Plus className="h-3 w-3" />Добавить</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/voicekeeper">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold font-display">Создать пост с AI</h1>
          <p className="text-xs text-muted-foreground">
            Gemini {fingerprint ? "+ ваш стиль" : ""}
          </p>
        </div>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="bg-amber-500/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <span className="text-xs">Настройте Gemini API ключ</span>
            </div>
            <Link href="/dashboard/settings/api-keys">
              <Button size="sm" variant="outline" className="h-7 text-[10px]">Настроить</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Параметры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Topic */}
            <div className="space-y-1">
              <Label className="text-xs">Тема *</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="О чём пост?"
                className="h-9"
              />
            </div>

            {/* Tone */}
            <div className="space-y-1">
              <Label className="text-xs">Тон</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "friendly", label: "Дружелюбный", emoji: "😊" },
                  { value: "professional", label: "Профи", emoji: "💼" },
                  { value: "provocative", label: "Провокация", emoji: "🔥" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTone(opt.value as typeof tone)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      tone === opt.value
                        ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                        : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                    }`}
                  >
                    <span className="text-base">{opt.emoji}</span>
                    <p className="text-[10px] font-medium mt-0.5">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="space-y-1">
              <Label className="text-xs">Длина</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "short", label: "Короткий", desc: "~200" },
                  { value: "medium", label: "Средний", desc: "~500" },
                  { value: "long", label: "Длинный", desc: "~1000" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLength(opt.value as typeof length)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      length === opt.value
                        ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                        : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                    }`}
                  >
                    <p className="text-[10px] font-medium">{opt.label}</p>
                    <p className="text-[9px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Switch id="emoji" checked={includeEmoji} onCheckedChange={setIncludeEmoji} />
                <Label htmlFor="emoji" className="text-[10px]">Эмодзи</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <Switch id="cta" checked={includeCta} onCheckedChange={setIncludeCta} />
                <Label htmlFor="cta" className="text-[10px]">CTA</Label>
              </div>
            </div>

            {/* Custom */}
            <div className="space-y-1">
              <Label className="text-xs">Доп. инструкции</Label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Добавь историю, упомяни продукт..."
                className="w-full h-16 rounded-lg bg-[hsl(15,15%,6%)] px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            {/* Generate */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim() || !hasApiKey}
              variant="gradient"
              className="w-full gap-2 h-10"
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Генерируем...</>
              ) : (
                <><Wand2 className="h-4 w-4" />Создать пост</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={!result ? "opacity-50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Результат</CardTitle>
              {result && <Badge variant="success" className="text-[9px]">{result.confidence}%</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                {/* Version selector */}
                {result.alternatives.length > 0 && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedVersion(0)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-medium transition-all ${
                        selectedVersion === 0 ? "bg-orange-500/15 text-orange-400" : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                      }`}
                    >
                      Основная
                    </button>
                    {result.alternatives.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVersion(idx + 1)}
                        className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-medium transition-all ${
                          selectedVersion === idx + 1 ? "bg-orange-500/15 text-orange-400" : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                        }`}
                      >
                        Вар. {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="rounded-lg bg-[hsl(15,12%,8%)] p-3 max-h-[280px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed">
                    {selectedVersion === 0 ? result.content : result.alternatives[selectedVersion - 1]}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-1 h-8">
                    <Copy className="h-3 w-3" />Copy
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" size="sm" className="gap-1 h-8">
                    <RefreshCw className="h-3 w-3" />Ещё
                  </Button>
                  <Button onClick={saveAsPost} size="sm" className="gap-1 h-8 ml-auto" disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    Сохранить
                  </Button>
                </div>

                {/* Feedback */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[hsl(15,12%,8%)]">
                  <span className="text-[10px] text-muted-foreground">Качество?</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 text-emerald-500 hover:bg-emerald-500/10">
                      <ThumbsUp className="h-3 w-3" />👍
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 text-red-500 hover:bg-red-500/10">
                      <ThumbsDown className="h-3 w-3" />👎
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Введите тему и нажмите «Создать»</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fingerprint hint */}
      <Card className={`p-3 ${fingerprint ? "bg-emerald-500/5" : "bg-orange-500/5"}`}>
        <div className="flex items-center gap-3">
          <Fingerprint className={`h-5 w-5 ${fingerprint ? "text-emerald-400" : "text-orange-400"}`} />
          <div className="flex-1">
            <p className="text-xs font-medium">Voice Fingerprint</p>
            <p className="text-[10px] text-muted-foreground">
              {fingerprint ? "Ваш стиль используется" : "Настройте для персонализации"}
            </p>
          </div>
          <Link href="/dashboard/voicekeeper/fingerprint">
            <Button variant="ghost" size="sm" className={`h-7 text-[10px] ${fingerprint ? "text-emerald-400" : "text-orange-400"}`}>
              {fingerprint ? "Изменить" : "Настроить"}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

