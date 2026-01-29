import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { Check, Copy, Loader2, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

interface GenerationResultProps {
  result: {
    content: string;
    alternatives: string[];
    confidence: number;
  } | null;
  selectedVersion: number;
  onVersionChange: (version: number) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function GenerationResult({
  result,
  selectedVersion,
  onVersionChange,
  onCopy,
  onRegenerate,
  onSave,
  isSaving,
}: GenerationResultProps) {
  return (
    <Card className={!result ? "opacity-50" : ""}>
      <CardHeader className="pb-1.5 p-1.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[11px]">Результат</CardTitle>
          {result && <Badge variant="success" className="text-[8px]">{result.confidence}%</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-1.5">
        {result ? (
          <>
            {/* Version selector */}
            {result.alternatives.length > 0 && (
              <div className="flex gap-1">
                <button
                  onClick={() => onVersionChange(0)}
                  className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-medium transition-all ${
                    selectedVersion === 0
                      ? "bg-orange-500/15 text-orange-400"
                      : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                  }`}
                >
                  Основная
                </button>
                {result.alternatives.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onVersionChange(idx + 1)}
                    className={`flex-1 py-1 px-1.5 rounded-md text-[9px] font-medium transition-all ${
                      selectedVersion === idx + 1
                        ? "bg-orange-500/15 text-orange-400"
                        : "bg-[hsl(15,12%,8%)] text-muted-foreground"
                    }`}
                  >
                    Вар. {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Content and Actions */}
            <div className="flex items-start gap-1.5">
              <div className="flex-1 rounded-lg bg-[hsl(15,12%,8%)] p-1.5 max-h-[200px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-[10px] font-sans leading-relaxed">
                  {selectedVersion === 0 ? result.content : result.alternatives[selectedVersion - 1]}
                </pre>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button onClick={onCopy} variant="outline" size="sm" className="gap-1 h-6 text-[9px]">
                  <Copy className="h-2.5 w-2.5" />
                  Copy
                </Button>
                <Button onClick={onRegenerate} variant="outline" size="sm" className="gap-1 h-6 text-[9px]">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Ещё
                </Button>
                <Button onClick={onSave} size="sm" className="gap-1 h-6 text-[9px]" disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                  Сохранить
                </Button>
              </div>
            </div>

            {/* Feedback */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[hsl(15,12%,8%)]">
              <span className="text-[9px] text-muted-foreground">Качество?</span>
              <div className="flex gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[9px] gap-0.5 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <ThumbsUp className="h-2.5 w-2.5" />👍
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[9px] gap-0.5 text-red-500 hover:bg-red-500/10"
                >
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
  );
}

