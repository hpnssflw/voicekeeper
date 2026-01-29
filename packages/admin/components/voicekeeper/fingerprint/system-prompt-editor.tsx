import { SectionCard } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";
import { generateSystemPrompt } from "@/features/voicekeeper/fingerprint";

interface SystemPromptEditorProps {
  profile: StyleProfile;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export function SystemPromptEditor({
  profile,
  systemPrompt,
  onSystemPromptChange,
}: SystemPromptEditorProps) {
  return (
    <SectionCard
      title="System Prompt"
      description="Редактируйте system prompt, который используется для генерации постов в вашем стиле"
      size="sm"
    >
        <textarea
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="System prompt будет сгенерирован автоматически на основе вашего стиля..."
          className="w-full h-40 rounded-lg bg-[hsl(15,15%,6%)] px-2 py-1.5 text-[10px] font-mono resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-1">
          <span>{systemPrompt.length} символов</span>
          <span className="text-[8px]">Автоматически обновляется при изменении стиля</span>
        </div>
    </SectionCard>
  );
}

