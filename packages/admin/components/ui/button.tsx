"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/35",
        destructive: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/90",
        outline: "bg-[hsl(240,10%,16%)] hover:bg-[hsl(240,10%,20%)]",
        secondary: "bg-[hsl(240,10%,18%)] text-secondary-foreground hover:bg-[hsl(240,10%,22%)]",
        ghost: "hover:bg-white/[0.06]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-red-500 via-rose-500 to-emerald-500 text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:via-rose-600 hover:to-emerald-600 hover:shadow-red-500/40",
        glass: "bg-white/[0.06] text-foreground hover:bg-white/[0.1]",
        success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600",
        warning: "bg-amber-500 text-black shadow-lg shadow-amber-500/25 hover:bg-amber-600",
      },
      size: {
        default: "h-11 px-5 py-2.5 sm:h-10 sm:px-4 sm:py-2",
        sm: "h-10 rounded-lg px-4 text-xs sm:h-9",
        lg: "h-14 rounded-2xl px-8 text-base sm:h-12",
        icon: "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
