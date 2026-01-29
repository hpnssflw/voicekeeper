import { Button } from "@/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  rightContent?: ReactNode;
  leftIcon?: ReactNode;
  action?: ReactNode; // Deprecated: use rightContent instead
  className?: string;
}

/**
 * Универсальный хедер страницы
 * Поддерживает кнопку назад, иконку слева, заголовок, описание и контент справа (статусы, предупреждения, действия)
 */
export function PageHeader({
  title,
  description,
  backHref,
  rightContent,
  leftIcon,
  action, // Deprecated but kept for backward compatibility
  className,
}: PageHeaderProps) {
  const finalRightContent = rightContent || action;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-1.5">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        )}
        {leftIcon && <div className="shrink-0">{leftIcon}</div>}
        <div>
          <h1 className="text-[11px] font-bold font-display">{title}</h1>
          {description && (
            <p className="text-[9px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {finalRightContent && <div className="flex items-center gap-2">{finalRightContent}</div>}
    </div>
  );
}

