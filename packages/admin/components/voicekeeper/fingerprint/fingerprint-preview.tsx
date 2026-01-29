import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { Save, ThumbsDown, ThumbsUp } from "lucide-react";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface FingerprintPreviewProps {
  profile: StyleProfile;
  onSatisfactionChange?: (satisfaction: "like" | "dislike" | null) => void;
  onSave?: () => void;
}

export function FingerprintPreview({ profile, onSatisfactionChange, onSave }: FingerprintPreviewProps) {
  const satisfaction = profile.satisfaction ?? null;

  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Ваш стиль</CardTitle>
        <CardDescription className="text-[8px]">
          Краткая выжимка и теги вашего стиля
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1.5 space-y-2">
        {/* Краткая выжимка */}
        {profile.summary && (
          <div className="p-1.5 rounded bg-[hsl(15,12%,8%)]">
            <div className="text-[9px] font-medium mb-1">Выжимка</div>
            <div className="text-[8px] text-muted-foreground">{profile.summary}</div>
          </div>
        )}

        {/* Теги стиля */}
        {(profile.tags && profile.tags.length > 0) && (
          <div className="space-y-1">
            <div className="text-[9px] font-medium">Теги стиля</div>
            <div className="flex flex-wrap gap-0.5">
              {profile.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-[7px] px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Оценка удовлетворенности */}
        {onSatisfactionChange && (
          <div className="pt-1.5 border-t border-white/5">
            <div className="text-[9px] font-medium mb-1.5">Оцените результат</div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={satisfaction === "like" ? "default" : "outline"}
                onClick={() => onSatisfactionChange(satisfaction === "like" ? null : "like")}
                className={`h-6 text-[8px] px-2 gap-1 flex-1 ${
                  satisfaction === "like" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ""
                }`}
              >
                <ThumbsUp className="h-2.5 w-2.5" />
                Подходит
              </Button>
              <Button
                size="sm"
                variant={satisfaction === "dislike" ? "default" : "outline"}
                onClick={() => onSatisfactionChange(satisfaction === "dislike" ? null : "dislike")}
                className={`h-6 text-[8px] px-2 gap-1 flex-1 ${
                  satisfaction === "dislike" ? "bg-red-500/20 text-red-400 border-red-500/30" : ""
                }`}
              >
                <ThumbsDown className="h-2.5 w-2.5" />
                Не подходит
              </Button>
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        {onSave && (
          <div className="pt-1.5 border-t border-white/5">
            <Button
              size="sm"
              onClick={onSave}
              className="w-full gap-1 h-6 text-[8px]"
            >
              <Save className="h-2.5 w-2.5" />
              Сохранить
            </Button>
          </div>
        )}

        {/* Детали fingerprint (если есть) */}
        {(profile.tone || profile.language || profile.structure || profile.rhetoric) && (
          <div className="pt-1.5 border-t border-white/5">
            <div className="text-[9px] font-medium mb-1">Детали</div>
            <div className="grid gap-1 text-[7px] text-muted-foreground">
              {profile.tone && (
                <div>Тон: эмоц. {(profile.tone.emotionality ?? 0.5).toFixed(1)}, увер. {(profile.tone.assertiveness ?? 0.5).toFixed(1)}</div>
              )}
              {profile.language && (
                <div>Язык: {profile.language.sentenceLength === 'short' ? 'короткие' : profile.language.sentenceLength === 'long' ? 'длинные' : 'средние'} предложения</div>
              )}
              {profile.structure && (
                <div>Структура: {profile.structure.hookType === 'question' ? 'вопросы' : profile.structure.hookType === 'provocation' ? 'провокации' : 'смешанный'} начало</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

