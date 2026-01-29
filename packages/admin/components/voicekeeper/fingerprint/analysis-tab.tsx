import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { Loader2, Sparkles } from "lucide-react";

interface AnalysisTabProps {
  textToAnalyze: string;
  onTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasApiKey: boolean;
}

export function AnalysisTab({
  textToAnalyze,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  hasApiKey,
}: AnalysisTabProps) {
  return (
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
          {isAnalyzing ? "Анализируем..." : "Анализировать стиль"}
        </Button>
      </CardContent>
    </Card>
  );
}

