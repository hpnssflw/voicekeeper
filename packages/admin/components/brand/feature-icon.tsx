"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureIconProps {
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
}

const variants = {
  primary: {
    bg: "from-red-500 to-rose-600",
    glow: "from-red-500/30 to-rose-600/30",
  },
  secondary: {
    bg: "from-slate-500 to-slate-600",
    glow: "from-slate-500/30 to-slate-600/30",
  },
  success: {
    bg: "from-emerald-500 to-teal-600",
    glow: "from-emerald-500/30 to-teal-600/30",
  },
  warning: {
    bg: "from-amber-500 to-orange-600",
    glow: "from-amber-500/30 to-orange-600/30",
  },
  info: {
    bg: "from-blue-500 to-cyan-600",
    glow: "from-blue-500/30 to-cyan-600/30",
  },
};

const sizes = {
  sm: { container: "h-10 w-10", icon: "h-5 w-5" },
  md: { container: "h-12 w-12", icon: "h-6 w-6" },
  lg: { container: "h-14 w-14", icon: "h-7 w-7" },
};

export function FeatureIcon({
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
  glow = false,
}: FeatureIconProps) {
  const v = variants[variant];
  const s = sizes[size];
  
  return (
    <div className={cn("relative", className)}>
      {glow && (
        <div className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-br blur-xl",
          v.glow
        )} />
      )}
      <div className={cn(
        "relative flex items-center justify-center rounded-xl",
        "bg-gradient-to-br shadow-lg",
        v.bg,
        s.container
      )}>
        <Icon className={cn("text-white", s.icon)} />
      </div>
    </div>
  );
}

