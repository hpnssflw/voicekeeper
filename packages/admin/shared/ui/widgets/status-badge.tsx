import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { componentSizes } from "./constants";

interface StatusBadgeProps {
  icon: LucideIcon;
  label: string;
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
  size?: "sm" | "md";
}

const statusColors = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
  info: "text-blue-400",
} as const;

/**
 * Компонент статуса с иконкой и цветным текстом
 * Используется для отображения статусов без фоновых заливок
 */
export function StatusBadge({
  icon: Icon,
  label,
  variant = "info",
  className,
  size = "sm",
}: StatusBadgeProps) {
  const sizes = componentSizes[size];
  const color = statusColors[variant];

  return (
    <div className={cn("flex items-center", sizes.gap, className)}>
      <Icon className={cn(sizes.icon, color)} />
      <span className={cn("font-medium", sizes.text, color)}>
        {label}
      </span>
    </div>
  );
}

