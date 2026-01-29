import { Card, CardContent, CardHeader, CardTitle, Label, Select, Switch } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface StructureSectionProps {
  profile: StyleProfile;
  onChange: (structure: StyleProfile["structure"]) => void;
}

export function StructureSection({ profile, onChange }: StructureSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Структура</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <Select
          label="Начало"
          value={profile.structure?.hookType ?? 'mixed'}
          onChange={(e) => onChange({
            hookType: e.target.value as "question" | "statement" | "provocation" | "mixed",
            paragraphLength: profile.structure?.paragraphLength ?? '3-4 sentences',
            useLists: profile.structure?.useLists ?? false,
            rhythm: profile.structure?.rhythm ?? 'medium',
          })}
          options={[
            { value: 'question', label: 'Вопрос' },
            { value: 'statement', label: 'Утверждение' },
            { value: 'provocation', label: 'Провокация' },
            { value: 'mixed', label: 'Смешанный' },
          ]}
        />
        <Select
          label="Абзацы"
          value={profile.structure?.paragraphLength ?? '3-4 sentences'}
          onChange={(e) => onChange({
            hookType: profile.structure?.hookType ?? 'mixed',
            paragraphLength: e.target.value as "1-2 sentences" | "3-4 sentences" | "5+ sentences",
            useLists: profile.structure?.useLists ?? false,
            rhythm: profile.structure?.rhythm ?? 'medium',
          })}
          options={[
            { value: '1-2 sentences', label: '1-2 предложения' },
            { value: '3-4 sentences', label: '3-4 предложения' },
            { value: '5+ sentences', label: '5+ предложений' },
          ]}
        />
        <div className="flex items-center justify-between py-0.5">
          <Label className="text-[9px] text-muted-foreground">Списки</Label>
          <Switch
            checked={profile.structure?.useLists ?? false}
            onCheckedChange={(v) => onChange({
              hookType: profile.structure?.hookType ?? 'mixed',
              paragraphLength: profile.structure?.paragraphLength ?? '3-4 sentences',
              useLists: v,
              rhythm: profile.structure?.rhythm ?? 'medium',
            })}
          />
        </div>
        <Select
          label="Ритм"
          value={profile.structure?.rhythm ?? 'medium'}
          onChange={(e) => onChange({
            hookType: profile.structure?.hookType ?? 'mixed',
            paragraphLength: profile.structure?.paragraphLength ?? '3-4 sentences',
            useLists: profile.structure?.useLists ?? false,
            rhythm: e.target.value as "fast" | "medium" | "slow",
          })}
          options={[
            { value: 'fast', label: 'Быстрый' },
            { value: 'medium', label: 'Умеренный' },
            { value: 'slow', label: 'Размеренный' },
          ]}
        />
      </CardContent>
    </Card>
  );
}

