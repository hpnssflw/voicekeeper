import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { actionColors, componentSizes, type ActionColor, type ComponentSize } from "./constants";

interface ActionItemProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  color?: ActionColor;
  className?: string;
  size?: ComponentSize;
}

/**
 * Универсальный компонент действия с иконкой
 * Поддерживает размеры: sm (компактный), md (стандартный), lg (большой)
 */
export function ActionItem({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color = "orange", 
  className,
  size = "md",
}: ActionItemProps) {
  const colors = actionColors[color];
  const sizes = componentSizes[size];

  return (
    <Link href={href} className={cn("block", className)}>
      <div className={cn(
        "rounded-lg transition-colors",
        sizes.padding,
        colors.bg,
        colors.hover
      )}>
        <div className={cn("flex items-center", sizes.gap)}>
          <div className={cn(
            "flex items-center justify-center rounded-md shrink-0",
            sizes.iconContainer,
            colors.iconBg
          )}>
            <Icon className={cn(sizes.icon, colors.iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={cn("font-medium leading-tight", sizes.textTitle)}>{title}</h4>
            {description && (
              <p className={cn("text-muted-foreground leading-tight", sizes.textDesc)}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

