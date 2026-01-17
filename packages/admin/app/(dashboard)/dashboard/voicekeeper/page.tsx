"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { toast } from "@/components/ui/toaster";
import Link from "next/link";
import {
  Sparkles,
  Fingerprint,
  Wand2,
  TrendingUp,
  Clock,
  Check,
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";

const mockFingerprint = {
  status: "ready",
  confidence: 87,
  lastAnalyzedAt: "2026-01-15T14:30:00Z",
  style: {
    sentimentTone: "positive",
    formalityScore: 0.35,
    emojiDensity: 2.3,
    avgParagraphLength: 48,
    dominantTopics: ["маркетинг", "AI", "продуктивность"],
    signaturePhrases: ["друзья", "на самом деле", "давайте разберёмся"],
    openingPatterns: ["Вопрос к аудитории", "Личная история", "Провокационный тезис"],
    ctaStyle: "мягкий",
  },
  sourcesCount: 45,
};

const mockGenerations = [
  {
    id: "1",
    topic: "AI-инструменты для контент-маркетолога",
    status: "completed",
    confidence: 92,
    createdAt: "2ч назад",
    wasPublished: true,
  },
  {
    id: "2",
    topic: "Как не выгореть при создании контента",
    status: "completed",
    confidence: 88,
    createdAt: "Вчера",
    wasPublished: false,
  },
  {
    id: "3",
    topic: "Тренды Telegram в 2026",
    status: "completed",
    confidence: 85,
    createdAt: "3 дня назад",
    wasPublished: true,
  },
];

export default function VoiceKeeperPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    toast({ title: "Анализ запущен", description: "Это займёт 2-3 минуты" });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({ title: "Анализ завершён", description: "Профиль стиля обновлён", variant: "success" });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VoiceKeeper</h1>
            <p className="text-muted-foreground">
              AI-стратег для вашего контента
            </p>
          </div>
        </div>
        <Link href="/dashboard/voicekeeper/generate">
          <Button className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
            <Wand2 className="h-4 w-4" />
            Создать пост
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FeatureIcon icon={Fingerprint} variant="primary" size="lg" glow />
              <div>
                <p className="text-sm text-muted-foreground">Voice Fingerprint</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{mockFingerprint.confidence}%</p>
                  <Badge variant="success">Готов</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FeatureIcon icon={Zap} variant="success" size="lg" glow />
              <div>
                <p className="text-sm text-muted-foreground">Генераций в этом месяце</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">23</p>
                  <span className="text-sm text-muted-foreground">/ 50</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FeatureIcon icon={Target} variant="warning" size="lg" glow />
              <div>
                <p className="text-sm text-muted-foreground">Средняя точность</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">89%</p>
                  <span className="text-xs text-emerald-500">+3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Voice Fingerprint Card */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-violet-500" />
                  Digital Voice Fingerprint
                </CardTitle>
                <CardDescription>
                  Профиль вашего уникального стиля письма
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="gap-2"
              >
                <RotateCcw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                {isAnalyzing ? "Анализируем..." : "Обновить"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confidence meter */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Уверенность профиля</span>
                <span className="font-medium">{mockFingerprint.confidence}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${mockFingerprint.confidence}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                На основе {mockFingerprint.sourcesCount} постов • Обновлено {new Date(mockFingerprint.lastAnalyzedAt).toLocaleDateString("ru")}
              </p>
            </div>

            {/* Style characteristics */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Характеристики стиля</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Тональность</span>
                    <Badge variant="success">{mockFingerprint.style.sentimentTone}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Формальность</span>
                    <span>{Math.round(mockFingerprint.style.formalityScore * 100)}% неформальный</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Эмодзи на 100 слов</span>
                    <span>{mockFingerprint.style.emojiDensity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Стиль CTA</span>
                    <span>{mockFingerprint.style.ctaStyle}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Ключевые темы</h4>
                <div className="flex flex-wrap gap-2">
                  {mockFingerprint.style.dominantTopics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <h4 className="font-medium text-sm mt-4">Фирменные фразы</h4>
                <div className="flex flex-wrap gap-2">
                  {mockFingerprint.style.signaturePhrases.map((phrase) => (
                    <Badge key={phrase} variant="outline" className="border-violet-500/30 text-violet-400">
                      «{phrase}»
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/dashboard/voicekeeper/fingerprint">
              <Button variant="outline" className="w-full gap-2">
                Детальные настройки профиля
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Generations */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Последние генерации</CardTitle>
            <CardDescription>История созданного контента</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockGenerations.map((gen) => (
              <div
                key={gen.id}
                className="rounded-xl border border-border/50 bg-background/50 p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{gen.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{gen.createdAt}</span>
                      {gen.wasPublished && (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          <Check className="h-2.5 w-2.5 mr-0.5" />
                          Опубликован
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{gen.confidence}%</span>
                    <p className="text-[10px] text-muted-foreground">точность</p>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" className="w-full gap-2 text-sm text-muted-foreground hover:text-foreground">
              Вся история
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-500" />
            Рекомендации AI
          </CardTitle>
          <CardDescription>
            Что можно улучшить в вашем контенте
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Время публикации",
                description: "Ваша аудитория активна в 10:00-12:00. Последние посты выходили в 15:00.",
              },
              {
                icon: BarChart3,
                title: "Длина постов",
                description: "Посты 400-600 символов получают на 23% больше реакций.",
              },
              {
                icon: Sparkles,
                title: "Горячая тема",
                description: "«AI в маркетинге» сейчас на пике. Конкуренты уже публикуют.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-xl border border-violet-500/20 bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-violet-500 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

