"use client";

import { useState } from "react";
import { Bell, Search, Plus, Command, Menu, LogOut, User, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotSelector } from "./bot-selector";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/lib/auth";
import { useTheme, themes, ThemeName } from "@/lib/themes";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, themeColors, setTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <>
      <header 
        className="flex h-16 items-center justify-between px-4 sm:px-6 relative z-10 shadow-[0_4px_24px_-4px_hsla(0,0%,0%,0.3)] transition-colors duration-500"
        style={{ backgroundColor: themeColors.surfaceHeader }}
      >
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
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" 
              style={{ color: themeColors.muted }}
            />
            <Input
              placeholder="Поиск постов, ботов..."
              className="pl-11 pr-20 text-sm"
            />
            <kbd 
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-md px-1.5 font-mono text-[10px] font-medium"
              style={{ 
                backgroundColor: themeColors.surfaceElevated,
                color: themeColors.muted
              }}
            >
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/voicekeeper/generate">
                <button 
                  className="flex items-center gap-1 sm:gap-2 h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-xl text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]"
                  style={{ 
                    background: themeColors.gradientButton,
                    boxShadow: `0 8px 24px -4px ${themeColors.glowColor}30`
                  }}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Создать с AI</span>
                  <span className="sm:hidden">AI</span>
                </button>
              </Link>
              
              {/* Theme selector */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9"
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                
                {showThemeMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowThemeMenu(false)}
                    />
                    <div 
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl p-2 shadow-2xl"
                      style={{ backgroundColor: themeColors.surfaceOverlay }}
                    >
                      <p 
                        className="text-xs font-semibold uppercase tracking-wider mb-2 px-2"
                        style={{ color: themeColors.muted }}
                      >
                        Тема
                      </p>
                      {(Object.keys(themes) as ThemeName[]).map((themeName) => {
                        const t = themes[themeName];
                        const isActive = theme === themeName;
                        return (
                          <button
                            key={themeName}
                            onClick={() => {
                              setTheme(themeName);
                              setShowThemeMenu(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200"
                            style={{ 
                              backgroundColor: isActive ? `${t.primary}20` : 'transparent',
                            }}
                          >
                            <div 
                              className="h-6 w-6 rounded-md shrink-0"
                              style={{ background: t.gradient }}
                            />
                            <span 
                              className="text-sm"
                              style={{ color: themeColors.foreground }}
                            >
                              {t.displayName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span 
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
                  style={{ 
                    backgroundColor: themeColors.primary,
                    boxShadow: `0 0 8px ${themeColors.primary}`
                  }}
                />
              </Button>
              
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold font-display text-white shadow-lg"
                  style={{ 
                    background: themeColors.gradient,
                    boxShadow: `0 4px 12px ${themeColors.glowColor}30`
                  }}
                >
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </button>
                
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div 
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl p-2 shadow-2xl"
                      style={{ backgroundColor: themeColors.surfaceOverlay }}
                    >
                      <div 
                        className="px-3 py-2 mb-1" 
                        style={{ borderBottom: `1px solid ${themeColors.surfaceElevated}` }}
                      >
                        <p 
                          className="text-sm font-medium"
                          style={{ color: themeColors.foreground }}
                        >
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p 
                          className="text-xs truncate"
                          style={{ color: themeColors.muted }}
                        >
                          {user?.email}
                        </p>
                      </div>
                      <Link 
                        href="/dashboard/settings/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/[0.06]"
                        style={{ color: themeColors.foreground }}
                      >
                        <User className="h-4 w-4" />
                        Профиль
                      </Link>
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
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-xl text-white shadow-lg transition-all duration-200 hover:scale-105"
              style={{ 
                background: themeColors.gradientButton,
                boxShadow: `0 8px 24px -4px ${themeColors.glowColor}30`
              }}
            >
              Войти
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
