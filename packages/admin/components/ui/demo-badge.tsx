"use client";

import { DEMO_MODE } from "@/lib/features";
import { Badge } from "./badge";
import { Info } from "lucide-react";

export function DemoBadge() {
  if (!DEMO_MODE) return null;
  
  return (
    <Badge variant="warning" className="gap-1 fixed bottom-4 right-4 z-50">
      <Info className="h-3 w-3" />
      Demo Mode
    </Badge>
  );
}

export function DemoOverlay({ children, message = "Доступно после регистрации" }: { 
  children: React.ReactNode;
  message?: string;
}) {
  if (!DEMO_MODE) return <>{children}</>;
  
  return (
    <div className="relative">
      <div className="pointer-events-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureGate({ 
  feature,
  children,
  fallback,
}: {
  feature: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!feature) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}

