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
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // OAuth only - redirect to login
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="fixed inset-0 pointer-events-none opacity-30 bg-mesh" />
        <div className="text-center relative z-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-xs text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !DEMO_MODE) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="fixed inset-0 pointer-events-none opacity-30 bg-mesh" />
        <div className="text-center relative z-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-xs text-muted-foreground">Перенаправление...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-mesh" />
      
      <Sidebar 
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden relative lg:ml-0">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-2 sm:p-3 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      <DemoBadge />
    </div>
  );
}
