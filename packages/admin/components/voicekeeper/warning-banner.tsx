import { Button } from "@/ui";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface WarningBannerProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  variant?: "warning" | "error" | "info";
}

/**
 * Компактный баннер предупреждения для хедера
 * Без фоновой заливки, только цветной текст и кнопка действия
 */
export function WarningBanner({
  icon: Icon,
  message,
  actionLabel,
  actionHref,
  onActionClick,
  variant = "warning",
}: WarningBannerProps) {
  const colorClasses = {
    warning: "text-amber-400",
    error: "text-red-400",
    info: "text-blue-400",
  };

  const ActionButton = actionHref ? (
    <Link href={actionHref}>
      <Button size="sm" variant="outline" className="h-5 text-[8px] px-1.5">
        {actionLabel}
      </Button>
    </Link>
  ) : onActionClick ? (
    <Button
      size="sm"
      variant="outline"
      className="h-5 text-[8px] px-1.5"
      onClick={onActionClick}
    >
      {actionLabel}
    </Button>
  ) : null;

  return (
    <div className="flex items-center gap-1">
      <Icon className={cn("h-3 w-3", colorClasses[variant])} />
      <span className={cn("text-[9px]", colorClasses[variant])}>{message}</span>
      {ActionButton}
    </div>
  );
}

