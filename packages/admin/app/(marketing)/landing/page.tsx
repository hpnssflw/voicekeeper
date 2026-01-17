"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useTheme, themes, ThemeName } from "@/lib/themes";
import {
  Fingerprint,
  Zap,
  Send,
  ArrowRight,
  Sparkles,
  Palette,
  Check,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    icon: Fingerprint,
    label: "Анализ стиля",
  },
  {
    icon: Zap,
    label: "AI генерация",
  },
  {
    icon: Send,
    label: "Публикация",
  },
];

export default function LandingPage() {
  const { theme, themeColors, setTheme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: themeColors.surfaceBase }}
    >
      {/* Background Effects - Dynamic based on theme */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `
            radial-gradient(at 40% 20%, ${themeColors.primary}15 0px, transparent 50%),
            radial-gradient(at 80% 0%, ${themeColors.secondary}12 0px, transparent 50%),
            radial-gradient(at 0% 50%, ${themeColors.accent}08 0px, transparent 50%),
            radial-gradient(at 80% 50%, ${themeColors.primary}10 0px, transparent 50%)
          `
        }}
      />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: `${themeColors.primary}30` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: `${themeColors.secondary}15` }}
      />
      
      {/* Theme Selector Button - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: themeColors.surfaceCard,
            color: themeColors.foreground 
          }}
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Тема</span>
        </button>
        
        {/* Theme Dropdown */}
        {showThemeSelector && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowThemeSelector(false)}
            />
            <div 
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-3 shadow-2xl z-50"
              style={{ backgroundColor: themeColors.surfaceOverlay }}
            >
              <p 
                className="text-xs font-semibold uppercase tracking-wider mb-3 px-2"
                style={{ color: themeColors.muted }}
              >
                Выберите тему
              </p>
              <div className="space-y-1">
                {(Object.keys(themes) as ThemeName[]).map((themeName) => {
                  const t = themes[themeName];
                  const isActive = theme === themeName;
                  return (
                    <button
                      key={themeName}
                      onClick={() => {
                        setTheme(themeName);
                        setShowThemeSelector(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200"
                      style={{ 
                        backgroundColor: isActive ? `${t.primary}20` : 'transparent',
                      }}
                    >
                      {/* Color preview */}
                      <div 
                        className="h-8 w-8 rounded-lg shrink-0"
                        style={{ background: t.gradient }}
                      />
                      <div className="flex-1 text-left">
                        <p 
                          className="font-medium text-sm"
                          style={{ color: themeColors.foreground }}
                        >
                          {t.displayName}
                        </p>
                        <p 
                          className="text-xs"
                          style={{ color: themeColors.muted }}
                        >
                          {t.description}
                        </p>
                      </div>
                      {isActive && (
                        <Check 
                          className="h-4 w-4 shrink-0" 
                          style={{ color: t.primary }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Main Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo Image */}
        <div className="relative mb-6 animate-in animate-in-delay-1">
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64">
            <Image
              src="/lips.png"
              alt="VoiceKeeper"
              fill
              className="object-contain transition-all duration-500"
              style={{ 
                filter: `drop-shadow(0 0 60px ${themeColors.primary}60)` 
              }}
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="animate-in animate-in-delay-2 text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight mb-3 text-center">
          <span 
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: themeColors.gradient }}
          >
            VoiceKeeper
          </span>
        </h1>
        
        {/* Tagline */}
        <p 
          className="animate-in animate-in-delay-3 text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-8"
          style={{ color: themeColors.muted }}
        >
          AI-контент в вашем стиле для Telegram
        </p>

        {/* Flow Steps */}
        <div className="animate-in animate-in-delay-3 flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl backdrop-blur-sm transition-colors duration-500"
                  style={{ backgroundColor: `${themeColors.primary}10` }}
                >
                  <step.icon 
                    className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-500" 
                    style={{ color: themeColors.primary }}
                  />
                </div>
                <span 
                  className="text-[10px] sm:text-xs text-center whitespace-nowrap"
                  style={{ color: themeColors.muted }}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight 
                  className="h-4 w-4 -mt-5 sm:-mt-6 transition-colors duration-500" 
                  style={{ color: `${themeColors.foreground}20` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-xl text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              style={{ 
                background: themeColors.gradientButton,
                boxShadow: `0 20px 40px -10px ${themeColors.glowColor}40`
              }}
            >
              <Sparkles className="h-4 w-4" />
              Начать
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button 
              className="w-full sm:w-auto flex items-center justify-center h-12 px-8 text-base font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              style={{ 
                backgroundColor: `${themeColors.foreground}08`,
                color: themeColors.foreground
              }}
            >
              Войти
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative px-6 pb-6 pt-4">
        <div 
          className="flex items-center justify-center gap-6 text-xs"
          style={{ color: `${themeColors.muted}80` }}
        >
          <span>© 2026 VoiceKeeper</span>
          <span 
            className="w-1 h-1 rounded-full" 
            style={{ backgroundColor: `${themeColors.foreground}15` }}
          />
          <span>Бесплатный старт</span>
        </div>
      </div>
    </div>
  );
}
