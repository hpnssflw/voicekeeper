import { Badge, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/ui";
import { X } from "lucide-react";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface ForbiddenSectionProps {
  profile: StyleProfile;
  onAddPhrase: (phrase: string) => void;
  onRemovePhrase: (index: number) => void;
  onAddTone: (tone: string) => void;
  onRemoveTone: (index: number) => void;
}

export function ForbiddenSection({
  profile,
  onAddPhrase,
  onRemovePhrase,
  onAddTone,
  onRemoveTone,
}: ForbiddenSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Запрещено</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <div className="space-y-0.5">
          <Label className="text-[9px] text-muted-foreground">Фразы</Label>
          <Input
            placeholder="'в наше время'"
            className="h-5 text-[9px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  onAddPhrase(input.value.trim());
                  input.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {(profile.forbidden?.phrases ?? []).map((phrase, idx) => (
              <Badge key={idx} variant="destructive" className="text-[7px] px-0.5 py-0 gap-0.5">
                {phrase}
                <button onClick={() => onRemovePhrase(idx)} className="ml-0.5">
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-0.5">
          <Label className="text-[9px] text-muted-foreground">Тона</Label>
          <Input
            placeholder="'mentoring'"
            className="h-5 text-[9px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  onAddTone(input.value.trim());
                  input.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {(profile.forbidden?.tones ?? []).map((tone, idx) => (
              <Badge key={idx} variant="destructive" className="text-[7px] px-0.5 py-0 gap-0.5">
                {tone}
                <button onClick={() => onRemoveTone(idx)} className="ml-0.5">
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

