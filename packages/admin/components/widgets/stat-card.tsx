import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  name: string;
  value: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function StatCard({ name, value, icon: Icon, href, className }: StatCardProps) {
  return (
    <Link href={href} className={cn("flex-1 min-w-[70px]", className)}>
      <div className="flex items-center gap-1 p-1.5 rounded-lg bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)] transition-colors">
        <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold font-display leading-tight">{value}</p>
          <p className="text-[9px] text-muted-foreground truncate leading-tight">{name}</p>
        </div>
      </div>
    </Link>
  );
}

