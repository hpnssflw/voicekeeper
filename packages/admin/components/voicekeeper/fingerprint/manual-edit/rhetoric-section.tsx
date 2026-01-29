import { Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Switch } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface RhetoricSectionProps {
  profile: StyleProfile;
  onChange: (rhetoric: StyleProfile["rhetoric"]) => void;
}

export function RhetoricSection({ profile, onChange }: RhetoricSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Риторика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <div className="space-y-0.5">
          <Label className="text-[9px] text-muted-foreground">Вопросов</Label>
          <Input
            type="number"
            value={profile.rhetoric?.questionsPerPost ?? 1}
            onChange={(e) => onChange({
              questionsPerPost: parseInt(e.target.value) || 0,
              metaphors: profile.rhetoric?.metaphors ?? 'rare',
              storytelling: profile.rhetoric?.storytelling ?? false,
              ctaStyle: profile.rhetoric?.ctaStyle ?? 'none',
            })}
            min={0}
            className="h-6 text-[10px]"
          />
        </div>
        <Select
          label="Метафоры"
          value={profile.rhetoric?.metaphors ?? 'rare'}
          onChange={(e) => onChange({
            questionsPerPost: profile.rhetoric?.questionsPerPost ?? 1,
            metaphors: e.target.value as "frequent" | "rare" | "none",
            storytelling: profile.rhetoric?.storytelling ?? false,
            ctaStyle: profile.rhetoric?.ctaStyle ?? 'none',
          })}
          options={[
            { value: 'frequent', label: 'Часто' },
            { value: 'rare', label: 'Редко' },
            { value: 'none', label: 'Нет' },
          ]}
        />
        <div className="flex items-center justify-between py-0.5">
          <Label className="text-[9px] text-muted-foreground">Истории</Label>
          <Switch
            checked={profile.rhetoric?.storytelling ?? false}
            onCheckedChange={(v) => onChange({
              questionsPerPost: profile.rhetoric?.questionsPerPost ?? 1,
              metaphors: profile.rhetoric?.metaphors ?? 'rare',
              storytelling: v,
              ctaStyle: profile.rhetoric?.ctaStyle ?? 'none',
            })}
          />
        </div>
        <Select
          label="CTA"
          value={profile.rhetoric?.ctaStyle ?? 'none'}
          onChange={(e) => onChange({
            questionsPerPost: profile.rhetoric?.questionsPerPost ?? 1,
            metaphors: profile.rhetoric?.metaphors ?? 'rare',
            storytelling: profile.rhetoric?.storytelling ?? false,
            ctaStyle: e.target.value as "soft" | "none" | "direct",
          })}
          options={[
            { value: 'soft', label: 'Мягкий' },
            { value: 'none', label: 'Нет' },
            { value: 'direct', label: 'Прямой' },
          ]}
        />
      </CardContent>
    </Card>
  );
}

