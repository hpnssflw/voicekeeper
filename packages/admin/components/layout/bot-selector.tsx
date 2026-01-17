"use client";

import { useState } from "react";
import { Bot, ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function BotSelector() {
  const router = useRouter();
  const { bots, selectedBotId, selectBot } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const selectedBot = bots.find((b) => b.id === selectedBotId) || bots[0];

  if (!selectedBot) {
    return (
      <button
        onClick={() => router.push("/dashboard/bots")}
        className="flex items-center gap-2 rounded-lg bg-[hsl(15,15%,8%)] px-2 py-1.5 text-xs hover:bg-[hsl(15,15%,10%)] transition-all"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded border border-dashed border-muted-foreground/40">
          <Plus className="h-3 w-3 text-muted-foreground" />
        </div>
        <span className="hidden sm:block text-muted-foreground">Добавить бота</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-[hsl(15,15%,8%)] px-2 py-1.5 text-xs hover:bg-[hsl(15,15%,10%)] transition-all"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-orange-500 to-pink-500">
          <Bot className="h-3 w-3 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-medium font-display leading-none text-foreground">{selectedBot.name}</p>
          <p className="text-[10px] text-muted-foreground">{selectedBot.username}</p>
        </div>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-[110] mt-1 w-56 rounded-lg bg-[hsl(15,15%,9%)] p-1.5 shadow-2xl shadow-black/40">
            <div className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 font-display">
              Ваши боты
            </div>
            <div className="space-y-0.5 mt-0.5">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => {
                    selectBot(bot.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs transition-all",
                    selectedBot.id === bot.id ? "bg-orange-500/15" : "hover:bg-white/[0.04]"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded",
                    bot.isActive ? "bg-gradient-to-br from-orange-500 to-pink-500" : "bg-[hsl(15,12%,14%)]"
                  )}>
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium leading-none truncate">{bot.name}</p>
                      {!bot.isActive && (
                        <span className="rounded px-1 py-0.5 text-[8px] font-medium bg-amber-500/20 text-amber-400">
                          Off
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{bot.username}</p>
                  </div>
                  {selectedBot.id === bot.id && (
                    <Check className="h-3 w-3 text-orange-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="h-px my-1.5 bg-[hsl(15,12%,12%)]" />
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/bots");
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded border border-dashed border-orange-500/50">
                <Plus className="h-3 w-3" />
              </div>
              <span className="font-medium font-display">Добавить</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
