import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { StyleProfile } from "@/lib/ai";

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
          onChange={(v) => onChange({ ...(profile.tone ?? {}), emotionality: v })}
          min={0}
          max={1}
          step={0.1}
        />
        <Slider
          label="Уверенность"
          value={profile.tone?.assertiveness ?? 0.5}
          onChange={(v) => onChange({ ...(profile.tone ?? {}), assertiveness: v })}
          min={0}
          max={1}
          step={0.1}
        />
        <Slider
          label="Ирония"
          value={profile.tone?.irony ?? 0}
          onChange={(v) => onChange({ ...(profile.tone ?? {}), irony: v })}
          min={0}
          max={1}
          step={0.1}
        />
      </CardContent>
    </Card>
  );
}

