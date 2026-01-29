import { Card, CardContent, Badge } from "@/ui";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { LucideIcon, CheckCircle2 } from "lucide-react";

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
}

export function StatCard({
  icon: Icon,
  iconVariant = "primary",
  label,
  value,
  badge,
  emptyValue = "—",
}: StatCardProps) {
  const isEmpty = value === emptyValue || value === null || value === undefined || (typeof value === "string" && value.trim() === "");

  return (
    <Card>
      <CardContent className="p-1.5">
        <div className="flex items-center gap-1.5">
          <FeatureIcon icon={Icon} variant={iconVariant === "error" ? "info" : iconVariant} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] text-muted-foreground">{label}</p>
            <div className="flex items-center gap-1.5">
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
                  {typeof value === "number" ? (
                    <p className="text-base font-bold font-display">{value}</p>
                  ) : (
                    <p className="text-base font-bold font-display">{value}</p>
                  )}
                  {badge && (
                    <Badge variant={badge.variant} className="text-[8px] px-1 py-0">
                      {badge.label}
                    </Badge>
                  )}
                  {!isEmpty && iconVariant === "success" && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

