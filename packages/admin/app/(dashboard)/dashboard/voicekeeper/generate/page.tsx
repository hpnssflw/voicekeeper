"use client";

import { Button, toast, PageHeader, StatusBadge, WarningBanner } from "@/ui";
import { EmptyState } from "@/components/voicekeeper";
import { GenerationForm } from "@/components/voicekeeper/generate/generation-form";
import { GenerationResult } from "@/components/voicekeeper/generate/generation-result";
import { useAuth } from "@/features/auth";
import { generatePost, getApiKey, getFingerprint, type StyleProfile } from "@/features/voicekeeper";
import { postsApi } from "@/shared/api";
import { Bot, Fingerprint, Key, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GenerationResultData {
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
  const [result, setResult] = useState<GenerationResultData | null>(null);
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
        <PageHeader
          title="Создать пост с AI"
          description="Генерация в вашем стиле"
          backHref="/dashboard/voicekeeper"
        />
        <EmptyState
          icon={<Bot className="h-6 w-6 text-muted-foreground" />}
          title="Сначала добавьте бота"
          description="Для сохранения постов нужен бот"
          action={
            <Link href="/dashboard/bots">
              <Button size="sm" className="gap-1 h-6 text-[9px]">
                <Plus className="h-2.5 w-2.5" />
                Добавить
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title="Создать пост с AI"
        description={`Gemini ${fingerprint ? "+ ваш стиль" : ""}`}
        backHref="/dashboard/voicekeeper"
        rightContent={
          <div className="flex items-center gap-2">
            {fingerprint && (
              <StatusBadge
                icon={Fingerprint}
                label="Fingerprint активен"
                variant="success"
              />
            )}
            {!hasApiKey && (
              <WarningBanner
                icon={Key}
                message="Настройте Gemini API ключ"
                actionLabel="Настроить"
                actionHref="/dashboard/settings/api-keys"
                variant="warning"
              />
            )}
          </div>
        }
      />

      <div className="grid gap-1.5 lg:grid-cols-2">
        <GenerationForm
          topic={topic}
          onTopicChange={setTopic}
          tone={tone}
          onToneChange={setTone}
          length={length}
          onLengthChange={setLength}
          includeEmoji={includeEmoji}
          onIncludeEmojiChange={setIncludeEmoji}
          includeCta={includeCta}
          onIncludeCtaChange={setIncludeCta}
          customInstructions={customInstructions}
          onCustomInstructionsChange={setCustomInstructions}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasApiKey={hasApiKey}
        />

        <GenerationResult
          result={result}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
          onCopy={copyToClipboard}
          onRegenerate={handleGenerate}
          onSave={saveAsPost}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}

