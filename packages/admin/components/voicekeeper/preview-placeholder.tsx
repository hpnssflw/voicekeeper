import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PreviewPlaceholderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Placeholder для предпросмотра когда данных нет
 * Используется вместо пустых состояний в боковых панелях
 */
export function PreviewPlaceholder({
  icon,
  title,
  description,
  className,
}: PreviewPlaceholderProps) {
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

