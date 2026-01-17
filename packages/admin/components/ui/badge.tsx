"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm",
        secondary:
          "bg-[hsl(240,10%,18%)] text-secondary-foreground",
        destructive:
          "bg-red-500/15 text-red-400",
        outline: 
          "text-foreground bg-[hsl(240,10%,16%)]",
        success:
          "bg-emerald-500/15 text-emerald-400",
        warning:
          "bg-amber-500/15 text-amber-400",
        info:
          "bg-blue-500/15 text-blue-400",
        gradient:
          "bg-gradient-to-r from-red-500/20 to-emerald-500/20 text-red-300",
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
