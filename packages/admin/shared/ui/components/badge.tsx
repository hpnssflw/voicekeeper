"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-1 py-0 text-[9px] font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white",
        secondary:
          "bg-[hsl(15,12%,14%)] text-secondary-foreground",
        destructive:
          "bg-red-500/15 text-red-400",
        outline: 
          "text-foreground bg-[hsl(15,12%,12%)]",
        success:
          "bg-emerald-500/15 text-emerald-400",
        warning:
          "bg-amber-500/15 text-amber-400",
        info:
          "bg-blue-500/15 text-blue-400",
        gradient:
          "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-300",
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

