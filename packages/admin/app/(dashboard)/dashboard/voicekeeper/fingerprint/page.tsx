"use client";

import { toast } from "@/components/ui/toaster";
import { AnalysisTab } from "@/components/voicekeeper/fingerprint/analysis-tab";
import { ApiKeyWarning } from "@/components/voicekeeper/fingerprint/api-key-warning";
import { FingerprintHeader } from "@/components/voicekeeper/fingerprint/header";
import { ManualEditTab } from "@/components/voicekeeper/fingerprint/manual-edit-tab";
import { SettingsPreview } from "@/components/voicekeeper/fingerprint/settings-preview";
import { FingerprintStatus } from "@/components/voicekeeper/fingerprint/status";
import { FingerprintTabs } from "@/components/voicekeeper/fingerprint/tabs";
import { analyzeStyle, getApiKey, getFingerprint, setFingerprint, type StyleProfile } from "@/lib/ai";
import { useAuth } from "@/lib/auth";
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"text" | "manual">("text");
  const [textToAnalyze, setTextToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const [styleProfile, setStyleProfile] = useState<StyleProfile>(defaultStyleProfile);

  // Load saved fingerprint and check API key
  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      try {
        const saved = await getFingerprint(user.id);
        if (saved) {
          // Миграция legacy профилей
          if (isLegacyProfile(saved)) {
            const migrated = migrateLegacyProfile(saved);
            setStyleProfile(migrated);
            // Сохраняем мигрированный профиль
            await setFingerprint(migrated, user.id);
          } else {
            setStyleProfile(saved);
          }
          setHasFingerprint(true);
        }
        const apiKey = await getApiKey("gemini", user.id);
        setHasApiKey(!!apiKey);
      } catch (error) {
        console.error("Failed to load fingerprint/API key:", error);
      }
    };
    loadData();
  }, [user?.id]);

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
      if (!user?.id) {
        toast({ title: "Ошибка", description: "Пользователь не найден", variant: "destructive" });
        return;
      }
      const profile = await analyzeStyle(textToAnalyze, user.id);
      setStyleProfile(profile);
      await setFingerprint(profile, user.id);
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
      if (!user?.id) {
        toast({ title: "Ошибка", description: "Пользователь не найден", variant: "destructive" });
        return;
      }
      await setFingerprint(styleProfile, user.id);
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

  return (
    <div className="space-y-1.5">
      <FingerprintHeader onSave={handleSave} />

      {!hasApiKey && <ApiKeyWarning />}

      {hasFingerprint && <FingerprintStatus />}

      <div className="grid gap-1.5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-1.5">
          <FingerprintTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "text" && (
            <AnalysisTab
              textToAnalyze={textToAnalyze}
              onTextChange={setTextToAnalyze}
              onAnalyze={handleAnalyzeText}
              isAnalyzing={isAnalyzing}
              hasApiKey={hasApiKey}
            />
          )}

          {activeTab === "manual" && (
            <ManualEditTab
              profile={styleProfile}
              onProfileChange={setStyleProfile}
            />
          )}
        </div>

        {hasFingerprint && <SettingsPreview profile={styleProfile} />}
      </div>
    </div>
  );
}
