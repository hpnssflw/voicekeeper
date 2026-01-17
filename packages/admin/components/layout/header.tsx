"use client";

import { useState } from "react";
import { Bell, Search, Plus, Command, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotSelector } from "./bot-selector";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between bg-card/20 backdrop-blur-2xl px-4 sm:px-6 relative z-10 shadow-[0_1px_0_0_hsl(var(--primary)/0.05)]">
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
          {isAuthenticated && <BotSelector />}
        </div>

        {/* Search - Center (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Поиск постов, ботов..."
              className="pl-11 pr-20 text-sm"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-md bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/voicekeeper/generate">
                <Button size="sm" variant="gradient" className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Создать с AI</span>
                  <span className="sm:hidden">AI</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_hsl(0,62%,50%,0.6)]" />
              </Button>
              
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 text-sm font-semibold font-display text-white shadow-lg shadow-red-500/25"
                >
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </button>
                
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-card/90 backdrop-blur-2xl p-2 shadow-2xl shadow-black/30">
                      <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Выйти
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="gradient"
              size="sm"
            >
              Войти
            </Button>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
