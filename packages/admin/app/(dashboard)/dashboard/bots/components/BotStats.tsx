"use client";

import { Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BotStatsProps {
  subscriberCount: number;
  postsCount: number;
  onDelete: () => void;
}

export function BotStats({ subscriberCount, postsCount, onDelete }: BotStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 text-[10px]">
      <div className="flex items-center gap-1">
        <Users className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
        <span className="truncate">{subscriberCount.toLocaleString()} подписчиков</span>
      </div>
      <div className="flex items-center gap-1">
        <FileText className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
        <span>{postsCount} постов</span>
      </div>
      <div className="flex items-center gap-1 justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

