import { Card, CardContent, Badge } from "@/ui";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { LucideIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { backgroundColors, componentSizes } from "./constants";

interface StatCardProps {
  icon: LucideIcon;
  iconVariant?: "primary" | "success" | "warning" | "error";
  label: string;
  value: string | number;
  badge?: {
    label: string;
    variant: "success" | "secondary";
  };
  emptyValue?: string;
  href?: string;
  className?: string;
  variant?: "card" | "compact"; // card = Card wrapper, compact = simple div
}

/**
 * Универсальная карточка статистики
 * Поддерживает два варианта: card (с Card оберткой) и compact (простой div)
 */
export function StatCard({
  icon: Icon,
  iconVariant = "primary",
  label,
  value,
  badge,
  emptyValue = "—",
  href,
  className,
  variant = "card",
}: StatCardProps) {
  const isEmpty = value === emptyValue || value === null || value === undefined || (typeof value === "string" && value.trim() === "");

  const sizes = componentSizes[variant === "compact" ? "sm" : "md"];
  
  const content = (
    <div className={cn(
      "flex items-center",
      variant === "compact" 
        ? `${sizes.gap} ${sizes.padding} rounded-lg ${backgroundColors.default} ${backgroundColors.hover} transition-colors`
        : sizes.gap,
      className
    )}>
      {variant === "compact" ? (
        <Icon className={cn(sizes.icon, "text-muted-foreground shrink-0")} />
      ) : (
        <FeatureIcon icon={Icon} variant={iconVariant === "error" ? "info" : iconVariant} size="sm" />
      )}
      <div className="min-w-0 flex-1">
        {variant === "compact" ? (
          <>
            <p className={cn("font-bold font-display leading-tight", sizes.textTitle)}>{value}</p>
            <p className={cn("text-muted-foreground truncate leading-tight", sizes.textDesc)}>{label}</p>
          </>
        ) : (
          <>
            <p className={cn("text-muted-foreground", sizes.textDesc)}>{label}</p>
            <div className={cn("flex items-center", sizes.gap)}>
              {isEmpty ? (
                <>
                  <p className="text-base font-bold font-display">{emptyValue}</p>
                  {badge && (
                    <Badge variant={badge.variant} className="text-[8px] px-1 py-0">
                      {badge.label}
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <p className="text-base font-bold font-display">{value}</p>
                  {badge && (
                    <Badge variant={badge.variant} className="text-[8px] px-1 py-0">
                      {badge.label}
                    </Badge>
                  )}
                  {!isEmpty && iconVariant === "success" && (
                    <CheckCircle2 className={cn(sizes.icon, "text-emerald-400 shrink-0")} />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn(variant === "card" ? "block" : "flex-1 min-w-[70px]", className)}>
        {variant === "card" ? (
          <Card>
            <CardContent className="p-1.5">{content}</CardContent>
          </Card>
        ) : (
          content
        )}
      </Link>
    );
  }

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardContent className="p-1.5">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

