"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20",
        secondary:
          "bg-secondary/80 text-secondary-foreground",
        destructive:
          "bg-destructive/20 text-red-400 shadow-sm shadow-destructive/10",
        outline: 
          "text-foreground bg-card/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]",
        success:
          "bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10",
        warning:
          "bg-amber-500/20 text-amber-400 shadow-sm shadow-amber-500/10",
        info:
          "bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/10",
        gradient:
          "bg-gradient-to-r from-red-500/20 to-emerald-500/20 text-red-400 shadow-sm shadow-red-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
