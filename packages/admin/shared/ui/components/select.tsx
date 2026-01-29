"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-[10px] text-muted-foreground">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-7 w-full rounded-lg bg-[hsl(15,15%,6%)] px-2.5 py-1.5 text-[11px]",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

