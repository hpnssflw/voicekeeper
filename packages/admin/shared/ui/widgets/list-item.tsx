import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ListItem({ children, className, onClick }: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg bg-[hsl(15,12%,8%)] p-2 hover:bg-[hsl(15,12%,10%)] transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

