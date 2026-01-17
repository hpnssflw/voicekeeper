"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/themes";
import { DEMO_MODE } from "@/lib/features";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isOnboarded, login } = useAuth();
  const { themeColors } = useTheme();
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
      <div 
        className="flex h-screen items-center justify-center transition-colors duration-500" 
        style={{ backgroundColor: themeColors.surfaceBase }}
      >
        <div 
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            background: `
              radial-gradient(at 40% 20%, ${themeColors.primary}12 0px, transparent 50%),
              radial-gradient(at 80% 0%, ${themeColors.secondary}10 0px, transparent 50%)
            `
          }}
        />
        <div className="text-center relative z-10">
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto mb-4" 
            style={{ color: themeColors.primary }}
          />
          <p style={{ color: themeColors.muted }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated && !DEMO_MODE) {
    return (
      <div 
        className="flex h-screen items-center justify-center transition-colors duration-500" 
        style={{ backgroundColor: themeColors.surfaceBase }}
      >
        <div 
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            background: `
              radial-gradient(at 40% 20%, ${themeColors.primary}12 0px, transparent 50%),
              radial-gradient(at 80% 0%, ${themeColors.secondary}10 0px, transparent 50%)
            `
          }}
        />
        <div className="text-center relative z-10">
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto mb-4" 
            style={{ color: themeColors.primary }}
          />
          <p style={{ color: themeColors.muted }}>Перенаправление...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen overflow-hidden transition-colors duration-500" 
      style={{ backgroundColor: themeColors.surfaceBase }}
    >
      {/* Subtle background effects */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          background: `
            radial-gradient(at 40% 20%, ${themeColors.primary}08 0px, transparent 50%),
            radial-gradient(at 80% 0%, ${themeColors.secondary}06 0px, transparent 50%),
            radial-gradient(at 0% 100%, ${themeColors.secondary}06 0px, transparent 50%)
          `
        }}
      />
      
      <Sidebar 
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden relative lg:ml-0">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      {/* Demo mode indicator */}
      <DemoBadge />
    </div>
  );
}
