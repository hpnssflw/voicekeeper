import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * Универсальная карточка секции с заголовком и описанием
 * Используется для группировки связанных элементов формы
 */
export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  headerClassName,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn("pb-1.5 p-2", headerClassName)}>
        <CardTitle className={cn("text-[11px] flex items-center gap-1.5")}>
          {Icon && <Icon className="h-3 w-3" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-[9px]">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("p-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

