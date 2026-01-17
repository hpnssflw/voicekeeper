"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useAuth } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/features";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isOnboarded, login } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle authentication and onboarding redirects
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        if (DEMO_MODE) {
          // Auto-login for demo mode
          login("demo@voicekeeper.app", "demo123");
        } else {
          // Redirect to login for production
          router.push("/login");
        }
      } else if (!isOnboarded && !DEMO_MODE) {
        // Redirect to onboarding if not completed
        router.push("/onboarding");
      }
    }
  }, [isLoading, isAuthenticated, isOnboarded, router, login]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-70" />
        <div className="text-center relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated && !DEMO_MODE) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-70" />
        <div className="text-center relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Перенаправление...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Background mesh with aurora effect */}
      <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-70" />
      <div className="fixed inset-0 bg-dots pointer-events-none opacity-30" />
      
      <Sidebar 
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden relative lg:ml-0">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Demo mode indicator */}
      <DemoBadge />
    </div>
  );
}
