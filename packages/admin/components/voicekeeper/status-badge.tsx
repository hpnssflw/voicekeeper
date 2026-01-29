import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  icon: LucideIcon;
  label: string;
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
}

/**
 * Компонент статуса с иконкой и цветным текстом
 * Используется для отображения статусов без фоновых заливок
 */
export function StatusBadge({
  icon: Icon,
  label,
  variant = "info",
  className,
}: StatusBadgeProps) {
  const colorClasses = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
    info: "text-blue-400",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("h-3 w-3", colorClasses[variant])} />
      <span className={cn("text-[9px] font-medium", colorClasses[variant])}>
        {label}
      </span>
    </div>
  );
}

