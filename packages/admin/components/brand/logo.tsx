"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { icon: "h-6 w-6", iconInner: "h-3 w-3", text: "text-lg" },
  md: { icon: "h-8 w-8", iconInner: "h-4 w-4", text: "text-xl" },
  lg: { icon: "h-10 w-10", iconInner: "h-5 w-5", text: "text-2xl" },
  xl: { icon: "h-14 w-14", iconInner: "h-7 w-7", text: "text-3xl" },
};

export function Logo({ className, size = "md", showText = true, animated = false }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl",
        "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
        s.icon,
        animated && "animate-pulse-slow"
      )}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 blur-lg opacity-50" />
        
        {/* Icon */}
        <Sparkles className={cn("relative text-white", s.iconInner)} />
        
        {/* Shine overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight", s.text)}>
            Voice<span className="gradient-text">Keeper</span>
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
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };
  
  const innerSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-xl",
      "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
      iconSizes[size],
      className
    )}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 blur-md opacity-40" />
      <Sparkles className={cn("relative text-white", innerSizes[size])} />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path
        d="M16 8L18.5 13L24 14L20 18L21 24L16 21L11 24L12 18L8 14L13.5 13L16 8Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

