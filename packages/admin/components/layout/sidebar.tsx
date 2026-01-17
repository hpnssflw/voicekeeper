"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo, LogoIcon } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Sparkles,
  Settings,
  LayoutDashboard,
  Radar,
  FileText,
  Users,
  Key,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Боты",
    href: "/dashboard/bots",
    icon: Bot,
  },
  {
    name: "Посты",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    name: "Рассылки",
    href: "/dashboard/broadcasts",
    icon: Megaphone,
  },
  {
    name: "Подписчики",
    href: "/dashboard/subscribers",
    icon: Users,
  },
  { type: "divider" as const, label: "AI Tools" },
  {
    name: "VoiceKeeper",
    href: "/dashboard/voicekeeper",
    icon: Sparkles,
    badge: "AI",
    gradient: true,
  },
  {
    name: "Генерация",
    href: "/dashboard/voicekeeper/generate",
    icon: Zap,
  },
  {
    name: "Fingerprint",
    href: "/dashboard/voicekeeper/fingerprint",
    icon: Key,
  },
  {
    name: "Trend Radar",
    href: "/dashboard/trends",
    icon: Radar,
    badge: "Pro",
  },
  { type: "divider" as const, label: "Настройки" },
  {
    name: "API Ключи",
    href: "/dashboard/settings/api-keys",
    icon: Key,
  },
  {
    name: "Настройки",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 relative z-50",
          // Mobile: drawer from left
          "fixed lg:sticky top-0 left-0 h-screen",
          "transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapsed state
          collapsed ? "w-16" : "w-64",
          // Mobile: always full width when open
          mobileOpen && "w-64"
        )}
      >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex-1">
            <Logo size="md" />
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <LogoIcon size="md" />
          </Link>
        )}
        {/* Mobile close button */}
        {mobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="h-8 w-8 text-muted-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {/* Desktop collapse button */}
        {!collapsed && !mobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-muted-foreground hidden lg:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed && !mobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 mx-auto my-2 text-muted-foreground hidden lg:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item, idx) => {
          if ("type" in item && item.type === "divider") {
            return (
              <div key={idx} className="py-3">
                <div className="h-px bg-border/50" />
                {!collapsed && item.label && (
                  <p className="mt-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? item.gradient
                    ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white"
                    : "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                isActive && item.gradient && "text-violet-400"
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        item.badge === "AI"
                          ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-400"
                          : "bg-amber-500/20 text-amber-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - Usage */}
      {!collapsed && (
        <div className="border-t border-border/50 p-4">
          <div className="rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Pro план</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              47 генераций осталось
            </p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: "47%" }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-xs gap-1 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
            >
              <Crown className="h-3 w-3" />
              Улучшить план
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
