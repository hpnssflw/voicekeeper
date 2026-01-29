"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600",
        destructive: "bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600",
        outline: "bg-[hsl(15,12%,10%)] hover:bg-[hsl(15,12%,14%)]",
        secondary: "bg-[hsl(15,12%,12%)] text-secondary-foreground hover:bg-[hsl(15,12%,16%)]",
        ghost: "hover:bg-white/[0.06]",
        link: "text-orange-400 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40",
        glass: "bg-white/[0.06] text-foreground hover:bg-white/[0.1]",
        success: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600",
        warning: "bg-amber-500 text-black shadow-md shadow-amber-500/20 hover:bg-amber-600",
      },
      size: {
        default: "h-7 px-2.5 py-1.5  text-[11px]",
        sm: "h-6 px-2 text-[10px]",
        lg: "h-9 rounded-xl px-4 text-xs",
        icon: "h-7 w-7",
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
