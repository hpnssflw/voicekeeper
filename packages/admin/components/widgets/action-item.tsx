import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionItemProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  color?: "orange" | "amber" | "emerald" | "blue" | "purple";
  className?: string;
}

const colorClasses = {
  orange: "bg-orange-500/[0.06] hover:bg-orange-500/[0.1]",
  amber: "bg-amber-500/[0.06] hover:bg-amber-500/[0.1]",
  emerald: "bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]",
  blue: "bg-blue-500/[0.06] hover:bg-blue-500/[0.1]",
  purple: "bg-purple-500/[0.06] hover:bg-purple-500/[0.1]",
};

const iconBgClasses = {
  orange: "bg-orange-500/15",
  amber: "bg-amber-500/15",
  emerald: "bg-emerald-500/15",
  blue: "bg-blue-500/15",
  purple: "bg-purple-500/15",
};

const iconColorClasses = {
  orange: "text-orange-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
};

export function ActionItem({ title, description, icon: Icon, href, color = "orange", className }: ActionItemProps) {
  return (
    <Link href={href} className={cn("block", className)}>
      <div className={cn("rounded-lg p-2 hover:transition-colors transition-colors", colorClasses[color])}>
        <div className="flex items-center gap-1.5">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-md shrink-0", iconBgClasses[color])}>
            <Icon className={cn("h-3 w-3", iconColorClasses[color])} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[11px] font-medium leading-tight">{title}</h4>
            {description && <p className="text-[9px] text-muted-foreground leading-tight">{description}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}

