"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl bg-card/40 backdrop-blur-sm px-4 py-2.5 text-base",
            "sm:h-10 sm:text-sm sm:py-2",
            "shadow-[0_0_0_1px_hsl(var(--primary)/0.05),inset_0_1px_2px_hsl(0_0%_0%/0.1)]",
            "transition-all duration-200",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_hsl(var(--primary)/0.3),0_0_20px_-5px_hsl(var(--primary)/0.2)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            icon && "pl-11 sm:pl-11",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
