import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { StyleProfile } from "@/lib/ai";

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
            onChange={(e) => onChange({ ...(profile.rhetoric ?? {}), questionsPerPost: parseInt(e.target.value) || 0 })}
            min={0}
            className="h-6 text-[10px]"
          />
        </div>
        <Select
          label="Метафоры"
          value={profile.rhetoric?.metaphors ?? 'rare'}
          onChange={(e) => onChange({ ...(profile.rhetoric ?? {}), metaphors: e.target.value as any })}
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
            onCheckedChange={(v) => onChange({ ...(profile.rhetoric ?? {}), storytelling: v })}
          />
        </div>
        <Select
          label="CTA"
          value={profile.rhetoric?.ctaStyle ?? 'none'}
          onChange={(e) => onChange({ ...(profile.rhetoric ?? {}), ctaStyle: e.target.value as any })}
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

