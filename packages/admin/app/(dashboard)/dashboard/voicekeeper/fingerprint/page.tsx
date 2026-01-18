"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { analyzeStyle, getApiKey, getFingerprint, setFingerprint, type StyleProfile } from "@/lib/ai";
import {
  ArrowLeft,
  Fingerprint,
  Key,
  Loader2,
  Pencil,
  Save,
  Sparkles,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Дефолтная структура StyleProfile
const defaultStyleProfile: StyleProfile = {
  tone: { emotionality: 0.5, assertiveness: 0.5, irony: 0.0 },
  language: { sentenceLength: 'medium', slangLevel: 0.3, professionalLexicon: true, emojiFrequency: 0.2 },
  structure: { hookType: 'mixed', paragraphLength: '3-4 sentences', useLists: false, rhythm: 'medium' },
  rhetoric: { questionsPerPost: 1, metaphors: 'rare', storytelling: false, ctaStyle: 'none' },
  forbidden: { phrases: [], tones: [] },
  signature: { typicalOpenings: [], typicalClosings: [] },
};

// Проверка, является ли StyleProfile старым форматом (legacy)
function isLegacyProfile(profile: any): profile is { tone: string; structure: string; vocabulary: string; signature: string; emoji: string } {
  return typeof profile === 'object' && 
         typeof profile.tone === 'string' && 
         !profile.tone?.emotionality;
}

// Миграция legacy профиля в новую структуру (базовая)
function migrateLegacyProfile(legacy: any): StyleProfile {
  return {
    ...defaultStyleProfile,
    tone_legacy: legacy.tone,
    structure_legacy: legacy.structure,
    vocabulary_legacy: legacy.vocabulary,
    signature_legacy: legacy.signature,
    emoji_legacy: legacy.emoji,
  };
}

export default function FingerprintPage() {
  const [activeTab, setActiveTab] = useState<"text" | "manual">("text");
  const [textToAnalyze, setTextToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const [styleProfile, setStyleProfile] = useState<StyleProfile>(defaultStyleProfile);

  // Load saved fingerprint and check API key
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await getFingerprint();
        if (saved) {
          // Миграция legacy профилей
          if (isLegacyProfile(saved)) {
            const migrated = migrateLegacyProfile(saved);
            setStyleProfile(migrated);
            // Сохраняем мигрированный профиль
            await setFingerprint(migrated);
          } else {
            setStyleProfile(saved);
          }
          setHasFingerprint(true);
        }
        const apiKey = await getApiKey("gemini");
        setHasApiKey(!!apiKey);
      } catch (error) {
        console.error("Failed to load fingerprint/API key:", error);
      }
    };
    loadData();
  }, []);

  const handleAnalyzeText = async () => {
    if (!textToAnalyze.trim() || textToAnalyze.length < 100) {
      toast({ title: "Добавьте минимум 100 символов текста", variant: "destructive" });
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

    setIsAnalyzing(true);
    
    try {
      const profile = await analyzeStyle(textToAnalyze);
      setStyleProfile(profile);
      await setFingerprint(profile);
      setHasFingerprint(true);
      toast({ title: "Стиль проанализирован!", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка анализа", 
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive" 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      await setFingerprint(styleProfile);
      setHasFingerprint(true);
      toast({ title: "Профиль сохранён", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка сохранения", 
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive" 
      });
    }
  };

  const addArrayItem = (section: 'forbidden' | 'signature', field: 'phrases' | 'tones' | 'typicalOpenings' | 'typicalClosings', value: string) => {
    if (!value.trim()) return;
    
    setStyleProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], value.trim()],
      },
    }));
  };

  const removeArrayItem = (section: 'forbidden' | 'signature', field: 'phrases' | 'tones' | 'typicalOpenings' | 'typicalClosings', index: number) => {
    setStyleProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-pink-500">
            <Fingerprint className="h-3 w-3 text-white" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold font-display">Voice Fingerprint</h1>
            <p className="text-[9px] text-muted-foreground">Структурированный профиль стиля</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} className="gap-1 h-6 text-[9px]">
          <Save className="h-2.5 w-2.5" />
          Сохранить
        </Button>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="bg-amber-500/10 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Key className="h-3 w-3 text-amber-400" />
              <span className="text-[9px]">Настройте Gemini API ключ для AI-анализа</span>
            </div>
            <Link href="/dashboard/settings/api-keys">
              <Button size="sm" variant="outline" className="h-5 text-[8px] px-1.5">Настроить</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Status */}
      {hasFingerprint && (
        <Card className="bg-emerald-500/5 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Fingerprint className="h-3 w-3 text-emerald-400" />
              <span className="text-[9px] font-medium">Fingerprint активен</span>
            </div>
            <Badge variant="success" className="text-[8px] px-1 py-0">✓</Badge>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-0.5 bg-[hsl(15,12%,8%)] rounded-lg">
        {[
          { id: "text", label: "AI Анализ", icon: Sparkles },
          { id: "manual", label: "Вручную", icon: Pencil },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[10px] font-medium transition-all ${
              activeTab === tab.id 
                ? "bg-orange-500/20 text-orange-400" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Analysis Tab */}
      {activeTab === "text" && (
        <Card>
          <CardHeader className="pb-1.5 p-2">
            <CardTitle className="text-[11px]">Анализ текста с AI</CardTitle>
            <CardDescription className="text-[9px]">
              Вставьте примеры постов — Gemini определит ваш стиль по структурированным параметрам
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-2">
            <textarea
              value={textToAnalyze}
              onChange={(e) => setTextToAnalyze(e.target.value)}
              placeholder="Вставьте 3-5 примеров ваших постов для анализа стиля (минимум 100 символов)..."
              className="w-full h-28 rounded-lg bg-[hsl(15,15%,6%)] px-2 py-1.5 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              <span>{textToAnalyze.length} символов (мин. 100)</span>
              <span className={textToAnalyze.length >= 500 ? "text-emerald-400" : ""}>
                {textToAnalyze.length >= 500 ? "✓ Достаточно" : "Рекомендуется 500+"}
              </span>
            </div>
            <Button
              onClick={handleAnalyzeText}
              disabled={isAnalyzing || textToAnalyze.length < 100 || !hasApiKey}
              className="w-full gap-1.5 h-6 text-[9px]"
            >
              {isAnalyzing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
              {isAnalyzing ? "Анализируем..." : "Анализировать стиль"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Manual Editing Tab - Structured UI */}
      {activeTab === "manual" && (
        <div className="space-y-1.5">
          {/* Tone Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Тон (Tone)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <Slider
                label="Эмоциональность (сухой ←→ эмоциональный)"
                value={styleProfile.tone.emotionality}
                onChange={(v) => setStyleProfile(prev => ({ ...prev, tone: { ...prev.tone, emotionality: v } }))}
                min={0}
                max={1}
                step={0.1}
              />
              <Slider
                label="Уверенность (мягкий ←→ уверенный)"
                value={styleProfile.tone.assertiveness}
                onChange={(v) => setStyleProfile(prev => ({ ...prev, tone: { ...prev.tone, assertiveness: v } }))}
                min={0}
                max={1}
                step={0.1}
              />
              <Slider
                label="Ирония (нет ←→ часто)"
                value={styleProfile.tone.irony}
                onChange={(v) => setStyleProfile(prev => ({ ...prev, tone: { ...prev.tone, irony: v } }))}
                min={0}
                max={1}
                step={0.1}
              />
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Язык (Language)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <Select
                label="Длина предложений"
                value={styleProfile.language.sentenceLength}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, language: { ...prev.language, sentenceLength: e.target.value as any } }))}
                options={[
                  { value: 'short', label: 'Короткие' },
                  { value: 'medium', label: 'Средние' },
                  { value: 'long', label: 'Длинные' },
                ]}
              />
              <Slider
                label="Уровень сленга"
                value={styleProfile.language.slangLevel}
                onChange={(v) => setStyleProfile(prev => ({ ...prev, language: { ...prev.language, slangLevel: v } }))}
                min={0}
                max={1}
                step={0.1}
              />
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Профессиональная лексика</Label>
                <Switch
                  checked={styleProfile.language.professionalLexicon}
                  onCheckedChange={(v) => setStyleProfile(prev => ({ ...prev, language: { ...prev.language, professionalLexicon: v } }))}
                />
              </div>
              <Slider
                label="Частота эмодзи"
                value={styleProfile.language.emojiFrequency}
                onChange={(v) => setStyleProfile(prev => ({ ...prev, language: { ...prev.language, emojiFrequency: v } }))}
                min={0}
                max={1}
                step={0.1}
              />
            </CardContent>
          </Card>

          {/* Structure Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Структура (Structure)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <Select
                label="Тип начала (hook)"
                value={styleProfile.structure.hookType}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, structure: { ...prev.structure, hookType: e.target.value as any } }))}
                options={[
                  { value: 'question', label: 'Вопрос' },
                  { value: 'statement', label: 'Утверждение' },
                  { value: 'provocation', label: 'Провокация' },
                  { value: 'mixed', label: 'Смешанный' },
                ]}
              />
              <Select
                label="Длина абзацев"
                value={styleProfile.structure.paragraphLength}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, structure: { ...prev.structure, paragraphLength: e.target.value as any } }))}
                options={[
                  { value: '1-2 sentences', label: '1-2 предложения' },
                  { value: '3-4 sentences', label: '3-4 предложения' },
                  { value: '5+ sentences', label: '5+ предложений' },
                ]}
              />
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Использовать списки</Label>
                <Switch
                  checked={styleProfile.structure.useLists}
                  onCheckedChange={(v) => setStyleProfile(prev => ({ ...prev, structure: { ...prev.structure, useLists: v } }))}
                />
              </div>
              <Select
                label="Ритм"
                value={styleProfile.structure.rhythm}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, structure: { ...prev.structure, rhythm: e.target.value as any } }))}
                options={[
                  { value: 'fast', label: 'Быстрый' },
                  { value: 'medium', label: 'Умеренный' },
                  { value: 'slow', label: 'Размеренный' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Rhetoric Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Риторика (Rhetoric)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Вопросов в посте</Label>
                <Input
                  type="number"
                  value={styleProfile.rhetoric.questionsPerPost}
                  onChange={(e) => setStyleProfile(prev => ({ ...prev, rhetoric: { ...prev.rhetoric, questionsPerPost: parseInt(e.target.value) || 0 } }))}
                  min={0}
                  className="h-6 text-[10px]"
                />
              </div>
              <Select
                label="Метафоры"
                value={styleProfile.rhetoric.metaphors}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, rhetoric: { ...prev.rhetoric, metaphors: e.target.value as any } }))}
                options={[
                  { value: 'frequent', label: 'Часто' },
                  { value: 'rare', label: 'Редко' },
                  { value: 'none', label: 'Не использовать' },
                ]}
              />
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Storytelling (истории)</Label>
                <Switch
                  checked={styleProfile.rhetoric.storytelling}
                  onCheckedChange={(v) => setStyleProfile(prev => ({ ...prev, rhetoric: { ...prev.rhetoric, storytelling: v } }))}
                />
              </div>
              <Select
                label="Стиль CTA (призыв к действию)"
                value={styleProfile.rhetoric.ctaStyle}
                onChange={(e) => setStyleProfile(prev => ({ ...prev, rhetoric: { ...prev.rhetoric, ctaStyle: e.target.value as any } }))}
                options={[
                  { value: 'soft', label: 'Мягкий' },
                  { value: 'none', label: 'Без CTA' },
                  { value: 'direct', label: 'Прямой' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Forbidden Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Запрещено (Анти-GPT защита)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Запрещённые фразы (клише)</Label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Например: 'в наше время'"
                    className="flex-1 h-6 text-[10px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addArrayItem('forbidden', 'phrases', input.value);
                        input.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styleProfile.forbidden.phrases.map((phrase, idx) => (
                    <Badge key={idx} variant="destructive" className="text-[8px] px-1 py-0 gap-0.5">
                      {phrase}
                      <button onClick={() => removeArrayItem('forbidden', 'phrases', idx)} className="ml-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Запрещённые тона</Label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Например: 'mentoring'"
                    className="flex-1 h-6 text-[10px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addArrayItem('forbidden', 'tones', input.value);
                        input.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styleProfile.forbidden.tones.map((tone, idx) => (
                    <Badge key={idx} variant="destructive" className="text-[8px] px-1 py-0 gap-0.5">
                      {tone}
                      <button onClick={() => removeArrayItem('forbidden', 'tones', idx)} className="ml-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Section */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Подпись (Signature)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Типичные начала</Label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Например: 'Вопрос'"
                    className="flex-1 h-6 text-[10px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addArrayItem('signature', 'typicalOpenings', input.value);
                        input.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styleProfile.signature.typicalOpenings.map((opening, idx) => (
                    <Badge key={idx} variant="outline" className="text-[8px] px-1 py-0 gap-0.5">
                      {opening}
                      <button onClick={() => removeArrayItem('signature', 'typicalOpenings', idx)} className="ml-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Типичные окончания</Label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Например: 'CTA'"
                    className="flex-1 h-6 text-[10px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addArrayItem('signature', 'typicalClosings', input.value);
                        input.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {styleProfile.signature.typicalClosings.map((closing, idx) => (
                    <Badge key={idx} variant="outline" className="text-[8px] px-1 py-0 gap-0.5">
                      {closing}
                      <button onClick={() => removeArrayItem('signature', 'typicalClosings', idx)} className="ml-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
