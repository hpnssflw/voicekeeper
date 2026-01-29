import { Button } from "@/ui";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { componentSizes } from "./constants";

interface WarningBannerProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  variant?: "warning" | "error" | "info";
  size?: "sm" | "md";
}

const warningColors = {
  warning: "text-amber-400",
  error: "text-red-400",
  info: "text-blue-400",
} as const;

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
  size = "sm",
}: WarningBannerProps) {
  const sizes = componentSizes[size];
  const color = warningColors[variant];

  const ActionButton = actionHref ? (
    <Link href={actionHref}>
      <Button size="sm" variant="outline" className={cn(sizes.height, sizes.textDesc, sizes.paddingX)}>
        {actionLabel}
      </Button>
    </Link>
  ) : onActionClick ? (
    <Button
      size="sm"
      variant="outline"
      className={cn(sizes.height, sizes.textDesc, sizes.paddingX)}
      onClick={onActionClick}
    >
      {actionLabel}
    </Button>
  ) : null;

  return (
    <div className={cn("flex items-center", sizes.gap)}>
      <Icon className={cn(sizes.icon, color)} />
      <span className={cn(sizes.text, color)}>{message}</span>
      {ActionButton}
    </div>
  );
}

