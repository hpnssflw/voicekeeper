import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ActionCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  href: string;
  bgColor?: string;
  hoverBgColor?: string;
}

export function ActionCard({
  icon: Icon,
  iconColor = "text-red-400",
  title,
  description,
  href,
  bgColor = "bg-red-500/[0.06]",
  hoverBgColor = "hover:bg-red-500/[0.1]",
}: ActionCardProps) {
  // Extract color from bgColor for icon background
  const iconBgColor = bgColor.includes("red") 
    ? "bg-red-500/15" 
    : bgColor.includes("emerald") 
    ? "bg-emerald-500/15"
    : bgColor.includes("amber")
    ? "bg-amber-500/15"
    : "bg-red-500/15";

  return (
    <Link href={href} className="block">
      <div className={`rounded-lg ${bgColor} p-1.5 ${hoverBgColor} transition-colors`}>
        <div className="flex items-center gap-1.5">
          <div className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBgColor}`}>
            <Icon className={`h-3 w-3 ${iconColor}`} />
          </div>
          <div>
            <h4 className="text-[10px] font-medium">{title}</h4>
            <p className="text-[8px] text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

