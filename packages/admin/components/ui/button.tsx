"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
        destructive: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90",
        outline: "bg-card/40 backdrop-blur-sm shadow-[0_0_0_1px_hsl(var(--primary)/0.1)] hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]",
        secondary: "bg-secondary/80 backdrop-blur-sm text-secondary-foreground hover:bg-secondary",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-red-500 via-rose-500 to-emerald-500 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:via-rose-600 hover:to-emerald-600 hover:shadow-red-500/35",
        glass: "bg-white/5 backdrop-blur-xl text-foreground hover:bg-white/10",
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
