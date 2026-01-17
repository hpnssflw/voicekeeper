"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
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
  Radio,
  LogOut,
  User,
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
    name: "Каналы",
    href: "/dashboard/channels",
    icon: Radio,
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, bots, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/landing");
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  const activeBots = bots.filter((b) => b.isActive).length;
  const totalGenerations = 47; // Would come from subscription

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-card/30 backdrop-blur-2xl transition-all duration-300 relative z-50",
          "shadow-[1px_0_0_0_hsl(var(--primary)/0.05),8px_0_32px_-8px_hsl(0_0%_0%/0.3)]",
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
      <div className="flex h-16 items-center justify-between px-4">
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
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item, idx) => {
          if ("type" in item && item.type === "divider") {
            return (
              <div key={idx} className="py-4">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                {!collapsed && item.label && (
                  <p className="mt-4 px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider font-display">
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
                    ? "bg-gradient-to-r from-red-500/15 to-emerald-500/15 text-white shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]"
                    : "bg-primary/10 text-primary shadow-[0_0_15px_-5px_hsl(var(--primary)/0.2)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                isActive && item.gradient && "text-red-400"
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                        item.badge === "AI"
                          ? "bg-gradient-to-r from-red-500/20 to-emerald-500/20 text-red-400"
                          : "bg-amber-500/15 text-amber-400"
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

      {/* Bottom section - Usage & User */}
      {!collapsed && (
        <div className="p-4 space-y-3">
          {/* Usage */}
          <div className="rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-emerald-500/10 p-4 shadow-[inset_0_1px_0_0_hsla(0,0%,100%,0.05)]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400 font-display capitalize">
                {user?.plan || "Free"} план
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {totalGenerations} генераций осталось
            </p>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-500 shadow-[0_0_10px_hsl(0,72%,51%,0.5)]"
                style={{ width: `${totalGenerations}%` }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-xs gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Crown className="h-3 w-3" />
              Улучшить план
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="rounded-2xl bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-emerald-500 text-white text-sm font-semibold">
                  {user.firstName?.charAt(0) || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-3 text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3 w-3" />
                Выйти
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Collapsed state user avatar */}
      {collapsed && user && (
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-emerald-500 text-white text-sm font-semibold hover:opacity-80 transition-opacity"
            title="Выйти"
          >
            {user.firstName?.charAt(0) || <User className="h-4 w-4" />}
          </button>
        </div>
      )}
    </aside>
    </>
  );
}
