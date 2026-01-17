"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { icon: "w-7 h-7", text: "text-lg" },
  md: { icon: "w-9 h-9", text: "text-xl" },
  lg: { icon: "w-11 h-11", text: "text-2xl" },
  xl: { icon: "w-16 h-16", text: "text-3xl" },
};

export function Logo({ className, size = "md", showText = true, animated = false }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative", s.icon, animated && "animate-pulse-slow")}>
        <Image
          src="/lips.png"
          alt="VoiceKeeper"
          fill
          className="object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold font-display tracking-tight gradient-text", s.text)}>
            VoiceKeeper
          </span>
          {size === "xl" && (
            <span className="text-sm text-muted-foreground -mt-1">AI Content Strategy</span>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };
  
  return (
    <div className={cn("relative", iconSizes[size], className)}>
      <Image
        src="/lips.png"
        alt="VoiceKeeper"
        fill
        className="object-contain drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]"
      />
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-8 h-8", className)}>
      <Image
        src="/lips.png"
        alt="VoiceKeeper"
        fill
        className="object-contain"
      />
    </div>
  );
}
