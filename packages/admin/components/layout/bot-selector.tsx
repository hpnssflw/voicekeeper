"use client";

import { useState } from "react";
import { Bot, ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/themes";
import { useRouter } from "next/navigation";

export function BotSelector() {
  const router = useRouter();
  const { bots, selectedBotId, selectBot } = useAuth();
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedBot = bots.find((b) => b.id === selectedBotId) || bots[0];

  if (!selectedBot) {
    return (
      <button
        onClick={() => router.push("/dashboard/bots")}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
          "hover:opacity-80 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring/50"
        )}
        style={{ backgroundColor: themeColors.surfaceCard }}
      >
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed"
          style={{ borderColor: `${themeColors.muted}50` }}
        >
          <Plus className="h-4 w-4" style={{ color: themeColors.muted }} />
        </div>
        <span className="hidden sm:block" style={{ color: themeColors.muted }}>
          Добавить бота
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
          "hover:opacity-90 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring/50"
        )}
        style={{ backgroundColor: themeColors.surfaceCard }}
      >
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-lg shadow-lg"
          style={{ background: themeColors.gradient }}
        >
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p 
            className="font-medium font-display leading-none"
            style={{ color: themeColors.foreground }}
          >
            {selectedBot.name}
          </p>
          <p 
            className="text-xs mt-0.5"
            style={{ color: themeColors.muted }}
          >
            {selectedBot.username}
          </p>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
          style={{ color: themeColors.muted }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl p-2 shadow-2xl"
            style={{ backgroundColor: themeColors.surfaceOverlay }}
          >
            <div 
              className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider font-display"
              style={{ color: `${themeColors.muted}80` }}
            >
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
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-all duration-200"
                  style={{
                    backgroundColor: selectedBot.id === bot.id ? `${themeColors.primary}15` : 'transparent'
                  }}
                >
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-lg shadow-lg"
                    style={{ 
                      background: bot.isActive ? themeColors.gradient : themeColors.surfaceElevated 
                    }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p 
                        className="font-medium leading-none"
                        style={{ color: themeColors.foreground }}
                      >
                        {bot.name}
                      </p>
                      {!bot.isActive && (
                        <span 
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ 
                            backgroundColor: `${themeColors.accent}20`,
                            color: themeColors.accent
                          }}
                        >
                          Неактивен
                        </span>
                      )}
                    </div>
                    <p 
                      className="text-xs mt-0.5"
                      style={{ color: themeColors.muted }}
                    >
                      {bot.username}
                    </p>
                  </div>
                  {selectedBot.id === bot.id && (
                    <Check className="h-4 w-4" style={{ color: themeColors.primary }} />
                  )}
                </button>
              ))}
            </div>
            
            <div 
              className="h-px my-2" 
              style={{ backgroundColor: themeColors.surfaceElevated }} 
            />
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/bots");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors"
              style={{ color: themeColors.primary }}
            >
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed"
                style={{ borderColor: `${themeColors.primary}50` }}
              >
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
