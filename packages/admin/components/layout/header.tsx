"use client";

import { LoginModal } from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/use-translations";
import { Command, LogOut, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      <header className="flex h-10 items-center justify-between px-2 sm:px-3 relative z-40 bg-[hsl(15,18%,6%)] shadow-[0_1px_0_0_hsl(15,12%,10%)]">
        {/* Left section */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-6 w-6"
          >
            <Menu className="h-3 w-3" />
          </Button>
        </div>

        {/* Search - Center */}
        <div className="hidden md:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-7 pr-12 h-6 text-[10px]"
            />
            <kbd className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-3 select-none items-center gap-0.5 rounded px-0.5 font-mono text-[8px] font-medium bg-[hsl(15,12%,10%)] text-muted-foreground">
              <Command className="h-2 w-2" />K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 h-6 px-2 rounded-lg text-[10px] font-medium transition-colors hover:bg-white/5"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-semibold font-display text-white bg-gradient-to-br from-orange-500 to-pink-500">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[9px] font-medium text-foreground leading-tight truncate max-w-[100px]">
                    {user?.email || user?.username || user?.firstName || "User"}
                  </p>
                </div>
              </button>
              
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-[100]"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-[110] mt-1 w-40 rounded-lg bg-[hsl(15,15%,9%)] p-1 shadow-2xl shadow-black/40">
                    <div className="px-1.5 py-1 mb-1 border-b border-[hsl(15,12%,12%)]">
                      <p className="text-[10px] font-medium text-foreground truncate">
                        {user?.email || user?.username || user?.firstName || "User"}
                      </p>
                      {user?.firstName && (
                        <p className="text-[9px] text-muted-foreground truncate">
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                    </div>
                    <Link 
                      href="/dashboard/settings/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[10px] transition-colors hover:bg-white/6"
                    >
                      <User className="h-3 w-3" />
                      {t("common.profile")}
                    </Link>
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logout();
                      }}
                      className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3 w-3" />
                      {t("common.logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 h-6 px-2.5 text-[10px] font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-pink-500"
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
