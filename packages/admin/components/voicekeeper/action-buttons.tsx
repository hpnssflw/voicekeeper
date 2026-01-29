import { Button } from "@/ui";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ActionButton {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  layout?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Группа кнопок действий (like/dislike, save и т.д.)
 * Поддерживает горизонтальное и вертикальное расположение
 */
export function ActionButtons({
  buttons,
  layout = "horizontal",
  className,
}: ActionButtonsProps) {
  return (
    <div
      className={cn(
        "flex gap-1",
        layout === "vertical" ? "flex-col" : "flex-row",
        className
      )}
    >
      {buttons.map((button, idx) => {
        const Icon = button.icon;
        return (
          <Button
            key={idx}
            size="sm"
            variant={button.variant || "outline"}
            onClick={button.onClick}
            disabled={button.disabled}
            className={cn(
              "h-6 text-[8px] px-2 gap-1",
              layout === "horizontal" ? "flex-1" : "w-full",
              button.active && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
              button.className
            )}
          >
            <Icon className="h-2.5 w-2.5" />
            {button.label}
          </Button>
        );
      })}
    </div>
  );
}

