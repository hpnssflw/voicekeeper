import { Button } from "@/components/ui/button";
import { ArrowLeft, Fingerprint, Save } from "lucide-react";
import Link from "next/link";

interface FingerprintHeaderProps {
  onSave: () => void;
}

export function FingerprintHeader({ onSave }: FingerprintHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Link href="/dashboard/voicekeeper">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ArrowLeft className="h-3 w-3" />
          </Button>
        </Link>
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-pink-500">
          <Fingerprint className="h-3 w-3 text-white" />
        </div>
        <div>
          <h1 className="text-[11px] font-bold font-display">Voice Fingerprint</h1>
          <p className="text-[9px] text-muted-foreground">Структурированный профиль стиля</p>
        </div>
      </div>
      <Button size="sm" onClick={onSave} className="gap-1 h-6 text-[9px]">
        <Save className="h-2.5 w-2.5" />
        Сохранить
      </Button>
    </div>
  );
}

