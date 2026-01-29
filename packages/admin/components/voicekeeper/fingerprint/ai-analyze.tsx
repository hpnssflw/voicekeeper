import { Button, SectionCard } from "@/ui";
import { Loader2, Sparkles } from "lucide-react";

interface AIAnalyzeProps {
  textToAnalyze: string;
  onTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasApiKey: boolean;
}

export function AIAnalyze({
  textToAnalyze,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  hasApiKey,
}: AIAnalyzeProps) {
  return (
    <SectionCard
      title="AI Анализ стиля"
      description="Вставьте примеры ваших постов — AI просканирует стиль и создаст профиль"
      size="sm"
    >
      <div className="space-y-2">
        <textarea
          value={textToAnalyze}
          onChange={(e) => onTextChange(e.target.value)}
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
          onClick={onAnalyze}
          disabled={isAnalyzing || textToAnalyze.length < 100 || !hasApiKey}
          className="w-full gap-1.5 h-6 text-[9px]"
        >
          {isAnalyzing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
          {isAnalyzing ? "Сканируем стиль..." : "Проанализировать стиль"}
        </Button>
      </div>
    </SectionCard>
  );
}

