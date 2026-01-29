import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Switch } from "@/ui";
import { Loader2, Wand2 } from "lucide-react";

interface GenerationFormProps {
  topic: string;
  onTopicChange: (value: string) => void;
  tone: "friendly" | "professional" | "provocative" | "humorous" | "serious" | "casual";
  onToneChange: (tone: "friendly" | "professional" | "provocative" | "humorous" | "serious" | "casual") => void;
  length: "short" | "medium" | "long";
  onLengthChange: (length: "short" | "medium" | "long") => void;
  includeEmoji: boolean;
  onIncludeEmojiChange: (value: boolean) => void;
  includeCta: boolean;
  onIncludeCtaChange: (value: boolean) => void;
  customInstructions: string;
  onCustomInstructionsChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

export function GenerationForm({
  topic,
  onTopicChange,
  tone,
  onToneChange,
  length,
  onLengthChange,
  includeEmoji,
  onIncludeEmojiChange,
  includeCta,
  onIncludeCtaChange,
  customInstructions,
  onCustomInstructionsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
}: GenerationFormProps) {
  const toneOptions = [
    { value: "friendly", label: "Дружелюбный", emoji: "😊" },
    { value: "professional", label: "Профи", emoji: "💼" },
    { value: "provocative", label: "Провокация", emoji: "🔥" },
    { value: "humorous", label: "Юмор", emoji: "😄" },
    { value: "serious", label: "Серьёзный", emoji: "🤔" },
    { value: "casual", label: "Неформальный", emoji: "😎" },
  ] as const;

  const lengthOptions = [
    { value: "short", label: "Короткий", desc: "~200" },
    { value: "medium", label: "Средний", desc: "~500" },
    { value: "long", label: "Длинный", desc: "~1000" },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-1.5 p-1.5">
        <CardTitle className="text-[11px]">Параметры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-1.5">
        {/* Topic */}
        <div className="space-y-0.5">
          <Label className="text-[10px]">Тема *</Label>
          <Input
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="О чём пост?"
            className="h-6 text-[10px]"
          />
        </div>

        {/* Tone */}
        <div className="space-y-0.5">
          <Label className="text-[10px]">Тон</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {toneOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onToneChange(opt.value)}
                className={`p-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  tone === opt.value
                    ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                    : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                }`}
              >
                <span className="text-sm">{opt.emoji}</span>
                <span className="text-[9px] font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div className="space-y-0.5">
          <Label className="text-[10px]">Длина</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {lengthOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onLengthChange(opt.value)}
                className={`p-1.5 rounded-lg text-center transition-all ${
                  length === opt.value
                    ? "bg-orange-500/15 ring-1 ring-orange-500/30"
                    : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
                }`}
              >
                <p className="text-[9px] font-medium">{opt.label}</p>
                <p className="text-[8px] text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <Switch id="emoji" checked={includeEmoji} onCheckedChange={onIncludeEmojiChange} />
            <Label htmlFor="emoji" className="text-[9px]">Эмодзи</Label>
          </div>
          <div className="flex items-center gap-1">
            <Switch id="cta" checked={includeCta} onCheckedChange={onIncludeCtaChange} />
            <Label htmlFor="cta" className="text-[9px]">CTA</Label>
          </div>
        </div>

        {/* Custom */}
        <div className="space-y-0.5">
          <Label className="text-[10px]">Доп. инструкции</Label>
          <textarea
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            placeholder="Добавь историю, упомяни продукт..."
            className="w-full h-20 rounded-lg bg-[hsl(15,15%,6%)] px-2 py-1.5 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>

        {/* Generate */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !topic.trim() || !hasApiKey}
          variant="gradient"
          className="w-full gap-1 h-6 text-[9px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              Генерируем...
            </>
          ) : (
            <>
              <Wand2 className="h-2.5 w-2.5" />
              Создать пост
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

