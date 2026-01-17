"use client";

import { Bell, Search, Plus, Command, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotSelector } from "./bot-selector";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-xl px-4 sm:px-6 relative z-10">
      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <BotSelector />
      </div>

      {/* Search - Center (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            placeholder="Поиск постов, ботов..."
            className="pl-10 pr-20 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all text-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/dashboard/voicekeeper/generate">
          <Button size="sm" className="gap-1 sm:gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 text-xs sm:text-sm px-2 sm:px-4">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Создать с AI</span>
            <span className="sm:hidden">AI</span>
          </Button>
        </Link>
        
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>
        
        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white ring-2 ring-background">
          VK
        </div>
      </div>
    </header>
  );
}
