"use client";

import { Card } from "@/ui";
import { Plus } from "lucide-react";

interface EmptyBotStateProps {
  onAddBot: () => void;
}

export function EmptyBotState({ onAddBot }: EmptyBotStateProps) {
  return (
    <Card
      className="flex cursor-pointer items-center justify-center hover:bg-white/[0.02] transition-all duration-300 shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]"
      onClick={onAddBot}
    >
      <div className="text-center p-4">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 group-hover:border-primary">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-2 text-[11px] font-medium font-display">Добавить бота</p>
        <p className="text-[9px] text-muted-foreground">
          Подключите нового Telegram-бота
        </p>
      </div>
    </Card>
  );
}

