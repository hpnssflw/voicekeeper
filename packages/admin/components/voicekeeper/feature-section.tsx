import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/ui";
import { StatusBadge } from "./status-badge";
import { LucideIcon, CheckCircle2, Pencil } from "lucide-react";
import Link from "next/link";

interface FeatureSectionProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  configureHref: string;
  isActive: boolean;
  activeMessage?: string;
  activeDescription?: string;
  editLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  onEmptyAction?: () => void;
}

export function FeatureSection({
  icon: Icon,
  iconColor = "text-red-400",
  title,
  description,
  configureHref,
  isActive,
  activeMessage = "Активен",
  activeDescription,
  editLabel = "Изменить профиль",
  emptyTitle = "Профиль не настроен",
  emptyDescription,
  emptyActionLabel = "Начать анализ",
  emptyActionHref,
  onEmptyAction,
}: FeatureSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-1.5 p-1.5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-1.5 text-[11px]">
              <Icon className={`h-3 w-3 ${iconColor}`} />
              {title}
            </CardTitle>
            <CardDescription className="text-[9px]">{description}</CardDescription>
          </div>
          <Link href={configureHref}>
            <Button variant="outline" size="sm" className="gap-1 h-6 text-[9px]">
              Настроить
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-1.5">
        {isActive ? (
          <div className="py-1.5">
            <div className="flex items-center gap-1.5 mb-2 p-1.5 rounded-lg bg-emerald-500/5">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-emerald-400">{activeMessage}</p>
                {activeDescription && (
                  <p className="text-[9px] text-muted-foreground">{activeDescription}</p>
                )}
              </div>
            </div>
            <Link href={configureHref}>
              <Button variant="outline" size="sm" className="w-full gap-1 h-6 text-[9px]">
                <Pencil className="h-2.5 w-2.5" />
                {editLabel}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="py-2 text-center">
            <Icon className={`h-8 w-8 mx-auto text-gray-600 mb-1.5`} />
            <h3 className="text-[10px] font-medium mb-0.5">{emptyTitle}</h3>
            {emptyDescription && (
              <p className="text-[9px] text-muted-foreground max-w-sm mx-auto mb-2">
                {emptyDescription}
              </p>
            )}
            {(emptyActionHref || onEmptyAction) && (
              <Link href={emptyActionHref || "#"}>
                <Button onClick={onEmptyAction} size="sm" className="gap-1 h-6 text-[9px]">
                  {emptyActionLabel}
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

