import { Card, CardContent, CardHeader, CardTitle, Slider } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface ToneSectionProps {
  profile: StyleProfile;
  onChange: (tone: StyleProfile["tone"]) => void;
}

export function ToneSection({ profile, onChange }: ToneSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Тон</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <Slider
          label="Эмоциональность"
          value={profile.tone?.emotionality ?? 0.5}
          onChange={(v) => onChange({
            emotionality: v,
            assertiveness: profile.tone?.assertiveness ?? 0.5,
            irony: profile.tone?.irony ?? 0,
          })}
          min={0}
          max={1}
          step={0.1}
        />
        <Slider
          label="Уверенность"
          value={profile.tone?.assertiveness ?? 0.5}
          onChange={(v) => onChange({
            emotionality: profile.tone?.emotionality ?? 0.5,
            assertiveness: v,
            irony: profile.tone?.irony ?? 0,
          })}
          min={0}
          max={1}
          step={0.1}
        />
        <Slider
          label="Ирония"
          value={profile.tone?.irony ?? 0}
          onChange={(v) => onChange({
            emotionality: profile.tone?.emotionality ?? 0.5,
            assertiveness: profile.tone?.assertiveness ?? 0.5,
            irony: v,
          })}
          min={0}
          max={1}
          step={0.1}
        />
      </CardContent>
    </Card>
  );
}

