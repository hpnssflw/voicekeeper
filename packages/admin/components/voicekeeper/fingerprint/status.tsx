import { Badge, Card } from "@/ui";
import { Fingerprint } from "lucide-react";

export function FingerprintStatus() {
  return (
    <Card className="bg-emerald-500/5 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Fingerprint className="h-3 w-3 text-emerald-400" />
          <span className="text-[9px] font-medium">Fingerprint активен</span>
        </div>
        <Badge variant="success" className="text-[8px] px-1 py-0">✓</Badge>
      </div>
    </Card>
  );
}

