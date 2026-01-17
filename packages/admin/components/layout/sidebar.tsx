"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/themes";
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
  const { themeColors } = useTheme();

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

  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;
  const generationsLeft = generationsLimit - generationsUsed;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar - darker than main content for contrast */}
      <aside
        className={cn(
          "flex flex-col transition-all duration-300 relative z-50",
          "shadow-[4px_0_24px_-4px_hsla(0,0%,0%,0.4)]",
          // Mobile: drawer from left
          "fixed lg:sticky top-0 left-0 h-screen",
          "transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapsed state
          collapsed ? "w-16" : "w-64",
          // Mobile: always full width when open
          mobileOpen && "w-64"
        )}
        style={{
          backgroundColor: themeColors.surfaceSidebar
        }}
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
            className="h-8 w-8 lg:hidden"
            style={{ color: themeColors.muted }}
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
            className="h-8 w-8 hidden lg:flex"
            style={{ color: themeColors.muted }}
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
          className="h-8 w-8 mx-auto my-2 hidden lg:flex"
          style={{ color: themeColors.muted }}
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
                <div 
                  className="h-px" 
                  style={{ backgroundColor: `${themeColors.foreground}06` }}
                />
                {!collapsed && item.label && (
                  <p 
                    className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider font-display"
                    style={{ color: `${themeColors.muted}80` }}
                  >
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
                collapsed && "justify-center px-2"
              )}
              style={{
                backgroundColor: isActive 
                  ? item.gradient 
                    ? `${themeColors.primary}15`
                    : `${themeColors.primary}15`
                  : 'transparent',
                color: isActive 
                  ? item.gradient 
                    ? themeColors.foreground
                    : themeColors.primary
                  : themeColors.muted,
              }}
              title={collapsed ? item.name : undefined}
            >
              <Icon 
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                )} 
                style={{
                  color: isActive && item.gradient ? themeColors.primary : undefined
                }}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: item.badge === "AI" 
                          ? `linear-gradient(135deg, ${themeColors.primary}25, ${themeColors.secondary}25)`
                          : `${themeColors.accent}20`,
                        color: item.badge === "AI" ? themeColors.primary : themeColors.accent
                      }}
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
          {/* Usage - slightly lighter background for separation */}
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: themeColors.surfaceCard }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4" style={{ color: themeColors.primary }} />
              <span 
                className="text-xs font-semibold font-display capitalize"
                style={{ color: themeColors.primary }}
              >
                {user?.plan || "Free"} план
              </span>
            </div>
            <p 
              className="text-xs mb-3"
              style={{ color: themeColors.muted }}
            >
              {generationsLeft} генераций осталось
            </p>
            <div 
              className="h-1.5 rounded-full overflow-hidden" 
              style={{ backgroundColor: themeColors.surfaceElevated }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((generationsLimit - generationsUsed) / generationsLimit) * 100}%`,
                  background: themeColors.gradient
                }}
              />
            </div>
            <Link href="/dashboard/settings/subscription">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs gap-1"
                style={{ color: themeColors.primary }}
              >
                <Crown className="h-3 w-3" />
                Улучшить план
              </Button>
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div 
              className="rounded-xl p-3"
              style={{ backgroundColor: themeColors.surfaceCard }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-semibold"
                  style={{ background: themeColors.gradient }}
                >
                  {user.firstName?.charAt(0) || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-medium truncate"
                    style={{ color: themeColors.foreground }}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: themeColors.muted }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-3 text-xs gap-1 hover:bg-red-500/10 hover:text-red-400"
                style={{ color: themeColors.muted }}
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
            className="flex h-9 w-9 mx-auto items-center justify-center rounded-full text-white text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ background: themeColors.gradient }}
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
