import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
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

