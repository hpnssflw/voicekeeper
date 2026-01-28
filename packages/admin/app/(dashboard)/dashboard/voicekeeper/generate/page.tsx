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
  const [tone, setTone] = useState<"friendly" | "professional" | "provocative" | "humorous" | "serious" | "casual">("friendly");
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
    if (!user?.id) return;
    const loadData = async () => {
      try {
        const apiKey = await getApiKey("gemini", user.id);
        setHasApiKey(!!apiKey);
        const fingerprint = await getFingerprint(user.id);
        setFingerprintState(fingerprint);
      } catch (error) {
        console.error("Failed to load API key/fingerprint:", error);
      }
    };
    loadData();
  }, [user?.id]);

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
      }, user?.id);

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
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowLeft className="h-3 w-3" /></Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold">Создать пост с AI</h1>
            <p className="text-[9px] text-muted-foreground mt-0.5">Генерация в вашем стиле</p>
          </div>
        </div>
        <Card className="py-4">
          <CardContent className="text-center p-2">
            <Bot className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-xs font-medium mb-0.5">Сначала добавьте бота</h3>
            <p className="text-[10px] text-muted-foreground mb-2">Для сохранения постов нужен бот</p>
            <Link href="/dashboard/bots">
              <Button size="sm" className="gap-1 h-6 text-[9px]"><Plus className="h-2.5 w-2.5" />Добавить</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/voicekeeper">
          <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowLeft className="h-3 w-3" /></Button>
        </Link>
        <div>
          <h1 className="text-sm font-semibold">Создать пост с AI</h1>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Gemini {fingerprint ? "+ ваш стиль" : ""}
          </p>
        </div>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="bg-amber-500/10 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Key className="h-3 w-3 text-amber-400" />
              <span className="text-[10px]">Настройте Gemini API ключ</span>
            </div>
            <Link href="/dashboard/settings/api-keys">
              <Button size="sm" variant="outline" className="h-6 text-[9px]">Настроить</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-2 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-1.5 p-2">
            <CardTitle className="text-xs">Параметры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-2">
            {/* Topic */}
            <div className="space-y-0.5">
              <Label className="text-[10px]">Тема *</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="О чём пост?"
                className="h-7 text-xs"
              />
            </div>

            {/* Tone */}
            <div className="space-y-0.5">
              <Label className="text-[10px]">Тон</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "friendly", label: "Дружелюбный", emoji: "😊" },
                  { value: "professional", label: "Профи", emoji: "💼" },
                  { value: "provocative", label: "Провокация", emoji: "🔥" },
                  { value: "humorous", label: "Юмор", emoji: "😄" },
                  { value: "serious", label: "Серьёзный", emoji: "🤔" },
                  { value: "casual", label: "Неформальный", emoji: "😎" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTone(opt.value as typeof tone)}
                    className={`p-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                      tone === opt.value
                        ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                        : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                    }`}
                  >
                    <span className="text-sm">{opt.emoji}</span>
                    <span className="text-[9px] font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="space-y-0.5">
              <Label className="text-[10px]">Длина</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "short", label: "Короткий", desc: "~200" },
                  { value: "medium", label: "Средний", desc: "~500" },
                  { value: "long", label: "Длинный", desc: "~1000" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLength(opt.value as typeof length)}
                    className={`p-1.5 rounded-lg text-center transition-all ${
                      length === opt.value
                        ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                        : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                    }`}
                  >
                    <p className="text-[9px] font-medium">{opt.label}</p>
                    <p className="text-[8px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <Switch id="emoji" checked={includeEmoji} onCheckedChange={setIncludeEmoji} />
                <Label htmlFor="emoji" className="text-[9px]">Эмодзи</Label>
              </div>
              <div className="flex items-center gap-1">
                <Switch id="cta" checked={includeCta} onCheckedChange={setIncludeCta} />
                <Label htmlFor="cta" className="text-[9px]">CTA</Label>
              </div>
            </div>

            {/* Custom */}
            <div className="space-y-0.5">
              <Label className="text-[10px]">Доп. инструкции</Label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Добавь историю, упомяни продукт..."
                className="w-full h-20 rounded-lg bg-[hsl(15,15%,6%)] px-2 py-1.5 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            {/* Generate */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim() || !hasApiKey}
              variant="gradient"
              className="w-full gap-1.5 h-8 text-xs"
            >
              {isGenerating ? (
                <><Loader2 className="h-3 w-3 animate-spin" />Генерируем...</>
              ) : (
                <><Wand2 className="h-3 w-3" />Создать пост</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={!result ? "opacity-50" : ""}>
          <CardHeader className="pb-1.5 p-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs">Результат</CardTitle>
              {result && <Badge variant="success" className="text-[8px]">{result.confidence}%</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-2">
            {result ? (
              <>
                {/* Version selector */}
                {result.alternatives.length > 0 && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedVersion(0)}
                      className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-medium transition-all ${
                        selectedVersion === 0 ? "bg-orange-500/15 text-orange-400" : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                      }`}
                    >
                      Основная
                    </button>
                    {result.alternatives.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVersion(idx + 1)}
                        className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-medium transition-all ${
                          selectedVersion === idx + 1 ? "bg-orange-500/15 text-orange-400" : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                        }`}
                      >
                        Вар. {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Content and Actions */}
                <div className="flex items-start gap-2">
                  <div className="flex-1 rounded-lg bg-[hsl(15,12%,8%)] p-2 max-h-[200px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-[10px] font-sans leading-relaxed">
                      {selectedVersion === 0 ? result.content : result.alternatives[selectedVersion - 1]}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-1 h-6 text-[9px]">
                      <Copy className="h-2.5 w-2.5" />Copy
                    </Button>
                    <Button onClick={handleGenerate} variant="outline" size="sm" className="gap-1 h-6 text-[9px]">
                      <RefreshCw className="h-2.5 w-2.5" />Ещё
                    </Button>
                    <Button onClick={saveAsPost} size="sm" className="gap-1 h-6 text-[9px]" disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                      Сохранить
                    </Button>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[hsl(15,12%,8%)]">
                  <span className="text-[9px] text-muted-foreground">Качество?</span>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px] gap-0.5 text-emerald-500 hover:bg-emerald-500/10">
                      <ThumbsUp className="h-2.5 w-2.5" />👍
                    </Button>
                    <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px] gap-0.5 text-red-500 hover:bg-red-500/10">
                      <ThumbsDown className="h-2.5 w-2.5" />👎
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Sparkles className="h-6 w-6 text-muted-foreground mb-1.5" />
                <p className="text-[10px] text-muted-foreground">Введите тему и нажмите «Создать»</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fingerprint hint */}
      <Card className={`p-2 ${fingerprint ? "bg-emerald-500/5" : "bg-orange-500/5"}`}>
        <div className="flex items-center gap-2">
          <Fingerprint className={`h-4 w-4 ${fingerprint ? "text-emerald-400" : "text-orange-400"}`} />
          <div className="flex-1">
            <p className="text-[10px] font-medium">Voice Fingerprint</p>
            <p className="text-[9px] text-muted-foreground">
              {fingerprint ? "Ваш стиль используется" : "Настройте для персонализации"}
            </p>
          </div>
          <Link href="/dashboard/voicekeeper/fingerprint">
            <Button variant="ghost" size="sm" className={`h-6 text-[9px] ${fingerprint ? "text-emerald-400" : "text-orange-400"}`}>
              {fingerprint ? "Изменить" : "Настроить"}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

