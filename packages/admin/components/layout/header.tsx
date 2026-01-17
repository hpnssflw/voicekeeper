"use client";

import { useState } from "react";
import { Bell, Search, Plus, Command, Menu, LogOut, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotSelector } from "./bot-selector";
import { LoginModal } from "@/components/auth/login-modal";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/use-translations";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between px-3 sm:px-4 relative z-40 bg-[hsl(15,18%,6%)] shadow-[0_1px_0_0_hsl(15,12%,10%)]">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {isAuthenticated && <BotSelector />}
        </div>

        {/* Search - Center */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-9 pr-16 h-8 text-xs"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-4 select-none items-center gap-0.5 rounded px-1 font-mono text-[9px] font-medium bg-[hsl(15,12%,10%)] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/voicekeeper/generate">
                <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98] bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("dashboard.createWithAI")}</span>
                </button>
              </Link>
              
              <LocaleSwitcher />
              
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
              </Button>
              
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold font-display text-white bg-gradient-to-br from-orange-500 to-pink-500"
                >
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </button>
                
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-[110] mt-1 w-48 rounded-lg bg-[hsl(15,15%,9%)] p-1.5 shadow-2xl shadow-black/40">
                      <div className="px-2 py-1.5 mb-1 border-b border-[hsl(15,12%,12%)]">
                        <p className="text-xs font-medium text-foreground truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link 
                        href="/dashboard/settings/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <User className="h-3.5 w-3.5" />
                        {t("common.profile")}
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        {t("common.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 h-8 px-3 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-pink-500"
            >
              {t("common.login")}
            </button>
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
