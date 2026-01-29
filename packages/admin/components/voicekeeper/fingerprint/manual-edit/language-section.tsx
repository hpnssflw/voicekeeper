import { Card, CardContent, CardHeader, CardTitle, Label, Select, Slider, Switch } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

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
          onChange={(e) => onChange({
            sentenceLength: e.target.value as "short" | "medium" | "long",
            slangLevel: profile.language?.slangLevel ?? 0.3,
            professionalLexicon: profile.language?.professionalLexicon ?? true,
            emojiFrequency: profile.language?.emojiFrequency ?? 0.2,
          })}
          options={[
            { value: 'short', label: 'Короткие' },
            { value: 'medium', label: 'Средние' },
            { value: 'long', label: 'Длинные' },
          ]}
        />
        <Slider
          label="Сленг"
          value={profile.language?.slangLevel ?? 0.3}
          onChange={(v) => onChange({
            sentenceLength: profile.language?.sentenceLength ?? 'medium',
            slangLevel: v,
            professionalLexicon: profile.language?.professionalLexicon ?? true,
            emojiFrequency: profile.language?.emojiFrequency ?? 0.2,
          })}
          min={0}
          max={1}
          step={0.1}
        />
        <div className="flex items-center justify-between py-0.5">
          <Label className="text-[9px] text-muted-foreground">Проф. лексика</Label>
          <Switch
            checked={profile.language?.professionalLexicon ?? true}
            onCheckedChange={(v) => onChange({
              sentenceLength: profile.language?.sentenceLength ?? 'medium',
              slangLevel: profile.language?.slangLevel ?? 0.3,
              professionalLexicon: v,
              emojiFrequency: profile.language?.emojiFrequency ?? 0.2,
            })}
          />
        </div>
        <Slider
          label="Эмодзи"
          value={profile.language?.emojiFrequency ?? 0.2}
          onChange={(v) => onChange({
            sentenceLength: profile.language?.sentenceLength ?? 'medium',
            slangLevel: profile.language?.slangLevel ?? 0.3,
            professionalLexicon: profile.language?.professionalLexicon ?? true,
            emojiFrequency: v,
          })}
          min={0}
          max={1}
          step={0.1}
        />
      </CardContent>
    </Card>
  );
}

