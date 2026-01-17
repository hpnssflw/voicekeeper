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
        className={cn(
          "flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm",
          "hover:bg-white/[0.06] transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring/50"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="hidden sm:block text-muted-foreground">Добавить бота</span>
      </button>
    );
  }

  const botColors: Record<string, string> = {
    "demo-1": "from-blue-500 to-cyan-500",
    "default": "from-red-500 to-emerald-500",
  };

  const getColor = (botId: string) => botColors[botId] || botColors["default"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm",
          "hover:bg-white/[0.06] transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring/50"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg",
          getColor(selectedBot.id)
        )}>
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-medium font-display leading-none">{selectedBot.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{selectedBot.username}</p>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl bg-card/90 backdrop-blur-2xl p-2 shadow-2xl shadow-black/30">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider font-display">
              Ваши боты
            </div>
            <div className="space-y-1 mt-1">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => {
                    selectBot(bot.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-all duration-200",
                    selectedBot.id === bot.id
                      ? "bg-primary/10"
                      : "hover:bg-white/[0.05]"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg",
                    bot.isActive ? getColor(bot.id) : "from-muted to-muted"
                  )}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium leading-none">{bot.name}</p>
                      {!bot.isActive && (
                        <span className="rounded-md bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-medium text-yellow-400">
                          Неактивен
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{bot.username}</p>
                  </div>
                  {selectedBot.id === bot.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/bots");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-primary/40">
                <Plus className="h-4 w-4" />
              </div>
              <span className="font-medium font-display">Добавить бота</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
