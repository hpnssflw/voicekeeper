import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { StyleProfile } from "@/lib/ai";

interface SignatureSectionProps {
  profile: StyleProfile;
  onAddOpening: (opening: string) => void;
  onRemoveOpening: (index: number) => void;
  onAddClosing: (closing: string) => void;
  onRemoveClosing: (index: number) => void;
}

export function SignatureSection({
  profile,
  onAddOpening,
  onRemoveOpening,
  onAddClosing,
  onRemoveClosing,
}: SignatureSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Подпись</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-1.5">
        <div className="space-y-0.5">
          <Label className="text-[9px] text-muted-foreground">Начала</Label>
          <Input
            placeholder="'Вопрос'"
            className="h-5 text-[9px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  onAddOpening(input.value.trim());
                  input.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {(profile.signature?.typicalOpenings ?? []).map((opening, idx) => (
              <Badge key={idx} variant="outline" className="text-[7px] px-0.5 py-0 gap-0.5">
                {opening}
                <button onClick={() => onRemoveOpening(idx)} className="ml-0.5">
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-0.5">
          <Label className="text-[9px] text-muted-foreground">Окончания</Label>
          <Input
            placeholder="'CTA'"
            className="h-5 text-[9px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  onAddClosing(input.value.trim());
                  input.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {(profile.signature?.typicalClosings ?? []).map((closing, idx) => (
              <Badge key={idx} variant="outline" className="text-[7px] px-0.5 py-0 gap-0.5">
                {closing}
                <button onClick={() => onRemoveClosing(idx)} className="ml-0.5">
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

