"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useUnderDevelopment, ActionItem, StatCard, PageHeader } from "@/ui";
import {
  EmptyState,
  FeatureSection,
} from "@/components/voicekeeper";
import { getFingerprint } from "@/features/voicekeeper/fingerprint";
import { useAuth } from "@/features/auth";
import {
  Bot,
  Fingerprint,
  Plus,
  Target,
  TrendingUp,
  Wand2,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VoiceKeeperPage() {
  const { user, bots } = useAuth();
  const underDev = useUnderDevelopment();
  const [hasFingerprint, setHasFingerprint] = useState(false);
  
  const hasBots = bots.length > 0;
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

  // Check for saved fingerprint
  useEffect(() => {
    if (!user?.id) return;
    const loadFingerprint = async () => {
      try {
        const fingerprint = await getFingerprint(user.id);
        setHasFingerprint(!!fingerprint);
      } catch (error) {
        console.error("Failed to load fingerprint:", error);
      }
    };
    loadFingerprint();
  }, [user?.id]);

  const handleAnalyze = () => {
    underDev.showModal(
      "Voice Fingerprint Анализ",
      "Анализ вашего стиля письма на основе существующих постов. Требуется минимум 10 опубликованных постов для точного определения стиля."
    );
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title="VoiceKeeper"
        description="AI-стратег для вашего контента"
      />

      {/* Check for bots */}
      {!hasBots ? (
        <EmptyState
          icon={<Bot className="h-6 w-6 text-muted-foreground" />}
          title="Сначала добавьте бота"
          description="Для использования VoiceKeeper необходим подключенный Telegram-бот"
          action={
            <Link href="/dashboard/bots">
              <Button size="sm" className="gap-1 h-6 text-[9px]">
                <Plus className="h-2.5 w-2.5" />
                Добавить бота
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid gap-1.5 md:grid-cols-3">
            <StatCard
              icon={Fingerprint}
              iconVariant={hasFingerprint ? "success" : "primary"}
              label="Voice Fingerprint"
              value={hasFingerprint ? "Активен" : "—"}
              badge={hasFingerprint ? { label: "Активен", variant: "success" } : { label: "Не настроен", variant: "secondary" }}
            />

            <StatCard
              icon={Zap}
              iconVariant="success"
              label="Генераций"
              value={generationsUsed}
              badge={{ label: `/ ${generationsLimit}`, variant: "secondary" }}
            />

            <StatCard
              icon={Target}
              iconVariant="warning"
              label="План"
              value={user?.plan || "free"}
            />
          </div>

          <div className="grid gap-1.5 lg:grid-cols-3">
            {/* Voice Fingerprint Card */}
            <div className="lg:col-span-2">
              <FeatureSection
                icon={Fingerprint}
                iconColor="text-red-400"
                title="Digital Voice Fingerprint"
                description="Профиль вашего уникального стиля письма"
                configureHref="/dashboard/voicekeeper/fingerprint"
                isActive={hasFingerprint}
                activeMessage="Voice Fingerprint активен"
                activeDescription="Ваш стиль используется при генерации"
                editLabel="Изменить профиль"
                emptyTitle="Профиль не настроен"
                emptyDescription="Проанализируйте ваши существующие посты, чтобы AI мог имитировать ваш уникальный стиль письма"
                emptyActionLabel="Начать анализ"
                emptyActionHref="/dashboard/voicekeeper/fingerprint"
                onEmptyAction={handleAnalyze}
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-1.5 p-1.5">
                <CardTitle className="text-[11px]">Действия</CardTitle>
                <CardDescription className="text-[9px]">Что можно сделать с VoiceKeeper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 p-1.5">
                <ActionItem
                  icon={Wand2}
                  title="Создать пост"
                  description="AI-генерация контента"
                  href="/dashboard/voicekeeper/generate"
                  color="red"
                  size="sm"
                />
                
                <ActionItem
                  icon={Fingerprint}
                  title="Анализ стиля"
                  description="Voice Fingerprint"
                  href="/dashboard/voicekeeper/fingerprint"
                  color="emerald"
                  size="sm"
                />
                
                <ActionItem
                  icon={TrendingUp}
                  title="Trend Radar"
                  description="Анализ трендов"
                  href="/dashboard/trends"
                  color="amber"
                  size="sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Plan Upgrade Banner */}
          {user?.plan === "free" && (
            <Card className="bg-gradient-to-r from-orange-500/10 via-transparent to-pink-500/10">
              <CardContent className="p-1.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                  <div>
                    <h3 className="text-[10px] font-semibold font-display mb-0.5">Увеличьте лимит генераций</h3>
                    <p className="text-[9px] text-muted-foreground">
                      Pro план даёт 50 генераций в месяц и доступ к Voice Fingerprint
                    </p>
                  </div>
                  <Link href="/dashboard/settings/subscription">
                    <Button size="sm" className="gap-1 h-6 text-[9px]">
                      <Zap className="h-2.5 w-2.5" />
                      Улучшить
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <underDev.Modal />
    </div>
  );
}
