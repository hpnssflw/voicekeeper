import { ReactNode } from "react";
import { Card, CardContent } from "@/ui";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  variant?: "card" | "placeholder"; // card = Card wrapper, placeholder = simple div (для боковых панелей)
}

/**
 * Универсальный компонент пустого состояния
 * Поддерживает два варианта: card (с Card оберткой) и placeholder (простой div для боковых панелей)
 */
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  variant = "card",
}: EmptyStateProps) {
  if (variant === "placeholder") {
    return (
      <div
        className={cn(
          "h-full flex items-center justify-center p-4 rounded-lg bg-[hsl(15,12%,8%)] border border-dashed border-white/10",
          className
        )}
      >
        <div className="text-center">
          {icon && <div className="flex justify-center mb-1">{icon}</div>}
          <div className="text-[9px] text-muted-foreground mb-1">{title}</div>
          {description && (
            <div className="text-[8px] text-muted-foreground/70">{description}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("py-6", className)}>
      <CardContent className="text-center p-4">
        <div className="flex justify-center mb-2">{icon}</div>
        <h3 className="text-[11px] font-semibold font-display mb-1">{title}</h3>
        <p className="text-[10px] text-muted-foreground mb-3 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
        {action && <div className="flex items-center justify-center gap-1.5">{action}</div>}
      </CardContent>
    </Card>
  );
}

