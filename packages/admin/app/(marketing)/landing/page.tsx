"use client";

import Link from "next/link";
import Image from "next/image";
import { Fingerprint, Zap, Send, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  { icon: Fingerprint, label: "Анализ стиля" },
  { icon: Zap, label: "AI генерация" },
  { icon: Send, label: "Публикация" },
];

export default function LandingPage() {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[hsl(15,20%,4%)]">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-mesh" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none bg-orange-500/20" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none bg-pink-500/10" />
      
      {/* Main Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Logo */}
        <div className="relative mb-4 animate-in animate-in-delay-1">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <Image
              src="/lips.png"
              alt="VoiceKeeper"
              fill
              className="object-contain drop-shadow-[0_0_40px_hsl(25,95%,53%,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Brand */}
        <h1 className="animate-in animate-in-delay-2 text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-2 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
            VoiceKeeper
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="animate-in animate-in-delay-3 text-center text-xs sm:text-sm text-muted-foreground max-w-xs mb-6">
          AI-контент в вашем стиле для Telegram
        </p>

        {/* Flow Steps */}
        <div className="animate-in animate-in-delay-3 flex items-center justify-center gap-2 sm:gap-3 mb-8">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-orange-500/10">
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="h-3 w-3 -mt-4 text-foreground/15" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-[0.98] transition-transform">
              <Sparkles className="h-3.5 w-3.5" />
              Начать
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center h-10 px-6 text-sm font-medium rounded-lg bg-white/[0.06] text-foreground hover:bg-white/[0.08] transition-colors">
              Войти
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative px-4 pb-4 pt-2">
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
          <span>© 2026 VoiceKeeper</span>
          <span className="w-0.5 h-0.5 rounded-full bg-foreground/15" />
          <span>Бесплатный старт</span>
        </div>
      </div>
    </div>
  );
}
