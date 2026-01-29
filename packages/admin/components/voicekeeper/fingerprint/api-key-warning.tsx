import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key } from "lucide-react";
import Link from "next/link";

export function ApiKeyWarning() {
  return (
    <Card className="bg-amber-500/10 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Key className="h-3 w-3 text-amber-400" />
          <span className="text-[9px]">Настройте Gemini API ключ для AI-анализа</span>
        </div>
        <Link href="/dashboard/settings/api-keys">
          <Button size="sm" variant="outline" className="h-5 text-[8px] px-1.5">Настроить</Button>
        </Link>
      </div>
    </Card>
  );
}

