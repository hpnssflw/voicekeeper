"use client";

import { useState } from "react";
import { Bot, ChevronDown, Plus, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotItem {
  id: string;
  name: string;
  username: string;
  isActive: boolean;
  color: string;
}

// Mock data - будет заменено на API
const mockBots: BotItem[] = [
  { id: "1", name: "Content Channel", username: "@content_bot", isActive: true, color: "from-blue-500 to-cyan-500" },
  { id: "2", name: "Marketing Bot", username: "@marketing_bot", isActive: true, color: "from-emerald-500 to-teal-500" },
  { id: "3", name: "News Bot", username: "@news_channel_bot", isActive: false, color: "from-amber-500 to-orange-500" },
];

export function BotSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotItem>(mockBots[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm",
          "hover:bg-accent hover:border-border transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br",
          selectedBot.color
        )}>
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-medium leading-none">{selectedBot.name}</p>
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
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl p-2 shadow-xl shadow-black/20 animate-in">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ваши боты
            </div>
            <div className="space-y-1 mt-1">
              {mockBots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => {
                    setSelectedBot(bot);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-all duration-200",
                    selectedBot.id === bot.id
                      ? "bg-primary/10"
                      : "hover:bg-accent"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br",
                    bot.isActive ? bot.color : "from-muted to-muted"
                  )}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium leading-none">{bot.name}</p>
                      {!bot.isActive && (
                        <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-medium text-yellow-400">
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
            
            <div className="h-px bg-border/50 my-2" />
            
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to add bot page
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-primary/50">
                <Plus className="h-4 w-4" />
              </div>
              <span className="font-medium">Добавить бота</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
