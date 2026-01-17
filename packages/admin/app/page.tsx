"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/features";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isOnboarded } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (DEMO_MODE) {
        // In demo mode, go directly to landing or dashboard
        router.push("/landing");
      } else if (isAuthenticated) {
        // Authenticated user
        if (isOnboarded) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        // Not authenticated - show landing page
        router.push("/landing");
      }
    }
  }, [isLoading, isAuthenticated, isOnboarded, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-70" />
      <div className="text-center relative z-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Загрузка VoiceKeeper...</p>
      </div>
    </div>
  );
}
