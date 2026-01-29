import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { componentSizes } from "./constants";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "md";
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
  size = "md",
}: SectionCardProps) {
  const sizes = componentSizes[size];

  return (
    <Card className={className}>
      <CardHeader className={cn("pb-1.5", sizes.padding, headerClassName)}>
        <CardTitle className={cn("flex items-center", sizes.gap, sizes.textTitle)}>
          {Icon && <Icon className={sizes.icon} />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={sizes.textDesc}>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(sizes.padding, contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

