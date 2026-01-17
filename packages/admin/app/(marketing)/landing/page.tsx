"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Fingerprint,
  Zap,
  Send,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo Image */}
        <div className="relative mb-6 animate-in animate-in-delay-1">
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64">
            <Image
              src="/lips.png"
              alt="VoiceKeeper"
              fill
              className="object-contain drop-shadow-[0_0_60px_rgba(239,68,68,0.4)]"
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="animate-in animate-in-delay-2 text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight mb-3 text-center">
          <span className="gradient-text">VoiceKeeper</span>
        </h1>
        
        {/* Tagline */}
        <p className="animate-in animate-in-delay-3 text-muted-foreground text-center text-sm sm:text-base max-w-xs sm:max-w-sm mb-8">
          AI-контент в вашем стиле для Telegram
        </p>

        {/* Flow Steps */}
        <div className="animate-in animate-in-delay-3 flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/[0.05] backdrop-blur-sm shadow-[inset_0_1px_0_0_hsla(0,0%,100%,0.05)]">
                  <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground text-center whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-white/20 -mt-5 sm:-mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="gradient" 
              className="w-full sm:w-auto gap-2 h-12 px-8 text-base shadow-xl shadow-red-500/20"
            >
              <Sparkles className="h-4 w-4" />
              Начать
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button 
              variant="glass" 
              size="lg" 
              className="w-full sm:w-auto h-12 px-8 text-base"
            >
              Войти
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative px-6 pb-6 pt-4">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <span>© 2026 VoiceKeeper</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>Бесплатный старт</span>
        </div>
      </div>
    </div>
  );
}
