"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { analyzeStyle, getFingerprint, setFingerprint, getApiKey, type StyleProfile } from "@/lib/ai";
import {
  Fingerprint,
  Save,
  Pencil,
  ArrowLeft,
  AlertCircle,
  FileText,
  Sparkles,
  Loader2,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function FingerprintPage() {
  const [activeTab, setActiveTab] = useState<"text" | "manual">("text");
  const [textToAnalyze, setTextToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const [styleProfile, setStyleProfile] = useState<StyleProfile>({
    tone: "",
    structure: "",
    vocabulary: "",
    signature: "",
    emoji: "",
  });

  // Load saved fingerprint and check API key
  useEffect(() => {
    const saved = getFingerprint();
    if (saved) {
      setStyleProfile(saved);
      setHasFingerprint(true);
    }
    setHasApiKey(!!getApiKey("gemini"));
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
      setFingerprint(profile);
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

  const handleSaveManual = () => {
    const hasAnyValue = Object.values(styleProfile).some(v => v.trim());
    if (!hasAnyValue) {
      toast({ title: "Заполните хотя бы одно поле", variant: "destructive" });
      return;
    }
    
    setFingerprint(styleProfile);
    setIsEditing(false);
    setHasFingerprint(true);
    toast({ title: "Профиль сохранён", variant: "success" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/voicekeeper">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
            <Fingerprint className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display">Voice Fingerprint</h1>
            <p className="text-xs text-muted-foreground">Ваш авторский стиль</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Отмена</Button>
              <Button size="sm" onClick={handleSaveManual} className="gap-1">
                <Save className="h-3 w-3" />
                Сохранить
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1">
              <Pencil className="h-3 w-3" />
              {hasFingerprint ? "Изменить" : "Вручную"}
            </Button>
          )}
        </div>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="bg-amber-500/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <span className="text-xs">Настройте Gemini API ключ для AI-анализа</span>
            </div>
            <Link href="/dashboard/settings/api-keys">
              <Button size="sm" variant="outline" className="h-7 text-[10px]">Настроить</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Status */}
      {hasFingerprint ? (
        <Card className="bg-emerald-500/5 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium">Fingerprint активен</span>
            </div>
            <Badge variant="success">✓</Badge>
          </div>
        </Card>
      ) : (
        <Card className="bg-orange-500/5 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <span className="text-xs">Настройте стиль для персонализированной генерации</span>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[hsl(15,12%,8%)] rounded-lg">
        {[
          { id: "text", label: "AI Анализ", icon: Sparkles },
          { id: "manual", label: "Вручную", icon: Pencil },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
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

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {activeTab === "text" ? "Анализ текста с AI" : "Ручная настройка"}
            </CardTitle>
            <CardDescription className="text-xs">
              {activeTab === "text" 
                ? "Вставьте примеры постов — Gemini определит ваш стиль" 
                : "Опишите свой стиль вручную"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTab === "text" && (
              <>
                <textarea
                  value={textToAnalyze}
                  onChange={(e) => setTextToAnalyze(e.target.value)}
                  placeholder="Вставьте 3-5 примеров ваших постов для анализа стиля...

Пример:
🔥 Как я увеличил конверсию на 300%

Всё началось с простого A/B теста...

---

💡 Топ-3 ошибки начинающих маркетологов

1. Не тестируют гипотезы
2. Копируют конкурентов
3. Игнорируют аналитику

Что добавите в список? 👇"
                  className="w-full h-44 rounded-lg bg-[hsl(15,15%,6%)] px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{textToAnalyze.length} символов (мин. 100)</span>
                  <span className={textToAnalyze.length >= 500 ? "text-emerald-400" : ""}>
                    {textToAnalyze.length >= 500 ? "✓ Достаточно" : "Рекомендуется 500+"}
                  </span>
                </div>
                <Button
                  onClick={handleAnalyzeText}
                  disabled={isAnalyzing || textToAnalyze.length < 100 || !hasApiKey}
                  className="w-full gap-2"
                  size="sm"
                >
                  {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {isAnalyzing ? "Анализируем с Gemini..." : "Анализировать стиль"}
                </Button>
              </>
            )}

            {activeTab === "manual" && (
              <div className="space-y-3">
                {Object.entries(styleProfile).map(([key, value]) => {
                  const labels: Record<string, { label: string; placeholder: string }> = {
                    tone: { label: "Тональность", placeholder: "Дружелюбный и экспертный" },
                    structure: { label: "Структура", placeholder: "Короткие абзацы, списки, заголовки" },
                    vocabulary: { label: "Словарь", placeholder: "Технический с упрощениями" },
                    signature: { label: "Фишки", placeholder: "Начинает с вопроса, заканчивает CTA" },
                    emoji: { label: "Эмодзи", placeholder: "🔥 💡 ✅ 📈" },
                  };
                  return (
                    <div key={key} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{labels[key].label}</Label>
                      <Input
                        value={value}
                        onChange={(e) => setStyleProfile({ ...styleProfile, [key]: e.target.value })}
                        placeholder={labels[key].placeholder}
                        className="h-8 text-xs"
                      />
                    </div>
                  );
                })}
                <Button onClick={handleSaveManual} className="w-full gap-2" size="sm">
                  <Save className="h-3 w-3" />
                  Сохранить профиль
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Profile Display */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Профиль стиля</CardTitle>
            <CardDescription className="text-xs">
              {hasFingerprint ? "Используется при генерации" : "Будет определён после анализа"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(styleProfile).map(([key, value]) => {
              const labels: Record<string, string> = {
                tone: "Тональность",
                structure: "Структура",
                vocabulary: "Словарь",
                signature: "Фишки",
                emoji: "Эмодзи",
              };
              return (
                <div key={key} className="space-y-0.5">
                  <Label className="text-[10px] text-muted-foreground">{labels[key]}</Label>
                  {isEditing && activeTab !== "manual" ? (
                    <Input
                      value={value}
                      onChange={(e) => setStyleProfile({ ...styleProfile, [key]: e.target.value })}
                      className="h-8 text-xs"
                    />
                  ) : (
                    <p className="text-xs bg-[hsl(15,12%,8%)] rounded-md px-2 py-1.5 min-h-[28px]">
                      {value || <span className="text-muted-foreground italic">Не задано</span>}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
