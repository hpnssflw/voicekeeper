import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { StyleProfile } from "@/lib/ai";

interface LanguageSectionProps {
  profile: StyleProfile;
  onChange: (language: StyleProfile["language"]) => void;
}

export function LanguageSection({ profile, onChange }: LanguageSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Язык</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <Select
          label="Длина предложений"
          value={profile.language?.sentenceLength ?? 'medium'}
          onChange={(e) => onChange({ ...(profile.language ?? {}), sentenceLength: e.target.value as any })}
          options={[
            { value: 'short', label: 'Короткие' },
            { value: 'medium', label: 'Средние' },
            { value: 'long', label: 'Длинные' },
          ]}
        />
        <Slider
          label="Сленг"
          value={profile.language?.slangLevel ?? 0.3}
          onChange={(v) => onChange({ ...(profile.language ?? {}), slangLevel: v })}
          min={0}
          max={1}
          step={0.1}
        />
        <div className="flex items-center justify-between py-0.5">
          <Label className="text-[9px] text-muted-foreground">Проф. лексика</Label>
          <Switch
            checked={profile.language?.professionalLexicon ?? true}
            onCheckedChange={(v) => onChange({ ...(profile.language ?? {}), professionalLexicon: v })}
          />
        </div>
        <Slider
          label="Эмодзи"
          value={profile.language?.emojiFrequency ?? 0.2}
          onChange={(v) => onChange({ ...(profile.language ?? {}), emojiFrequency: v })}
          min={0}
          max={1}
          step={0.1}
        />
      </CardContent>
    </Card>
  );
}

