import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { Loader2, Sparkles } from "lucide-react";

interface StylePromptEditorProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  hasApiKey?: boolean;
}

export function StylePromptEditor({
  prompt,
  onPromptChange,
  onAnalyze,
  isAnalyzing = false,
  hasApiKey = false,
}: StylePromptEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-1.5 p-2">
        <CardTitle className="text-[11px]">Опишите свой стиль</CardTitle>
        <CardDescription className="text-[9px]">
          Расскажите о своем стиле письма, как если бы вы писали сочинение. Опишите тон, манеру общения, особенности языка.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Например: Я пишу в дружелюбном, но профессиональном тоне. Использую короткие предложения, избегаю сложных терминов. Люблю задавать вопросы читателям и заканчивать посты призывом к действию..."
          className="w-full h-40 rounded-lg bg-[hsl(15,15%,6%)] px-2 py-1.5 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
          <span>{prompt.length} символов</span>
          {onAnalyze && hasApiKey && (
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing || prompt.length < 50}
              size="sm"
              className="gap-1.5 h-5 text-[8px] px-2"
            >
              {isAnalyzing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
              {isAnalyzing ? "Анализируем..." : "Проанализировать"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

