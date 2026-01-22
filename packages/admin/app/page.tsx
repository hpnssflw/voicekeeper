"use client";

import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Always redirect to landing page
      router.push("/landing");
    }
  }, [isLoading, router]);

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
