"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({ 
  label, 
  value, 
  min = 0, 
  max = 1, 
  step = 0.1, 
  onChange, 
  className,
  ...props 
}: SliderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-muted-foreground">{label}</label>
          <span className="text-[10px] font-mono text-foreground">{value.toFixed(1)}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[hsl(15,12%,10%)] accent-orange-500 cursor-pointer"
        {...props}
      />
    </div>
  );
}

