"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/use-translations";
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
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const t = useTranslations();
  
  const navigation = [
    { name: t("navigation.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("navigation.bots"), href: "/dashboard/bots", icon: Bot },
    { name: t("navigation.channels"), href: "/dashboard/channels", icon: Radio },
    { name: t("navigation.posts"), href: "/dashboard/posts", icon: FileText },
    { name: t("navigation.broadcasts"), href: "/dashboard/broadcasts", icon: Megaphone },
    { name: t("navigation.subscribers"), href: "/dashboard/subscribers", icon: Users },
    { type: "divider" as const, label: "AI Tools" },
    { name: t("navigation.voicekeeper"), href: "/dashboard/voicekeeper", icon: Sparkles, badge: "AI", gradient: true },
    { name: t("navigation.generate"), href: "/dashboard/voicekeeper/generate", icon: Zap },
    { name: t("navigation.fingerprint"), href: "/dashboard/voicekeeper/fingerprint", icon: Key },
    { name: t("navigation.trendRadar"), href: "/dashboard/trends", icon: Radar, badge: "Pro" },
    { type: "divider" as const, label: t("common.settings") },
    { name: t("navigation.apiKeys"), href: "/dashboard/settings/api-keys", icon: Key },
    { name: t("common.settings"), href: "/dashboard/settings", icon: Settings },
    { type: "divider" as const, label: t("common.help") || "Help" },
    { name: t("navigation.features"), href: "/dashboard/features", icon: BookOpen },
  ];

  const handleLogout = () => {
    logout();
    router.push("/landing");
  };

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

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col transition-all duration-300 relative z-50 bg-[hsl(15,20%,5%)]",
          "shadow-[1px_0_0_0_hsl(15,12%,8%)]",
          "fixed lg:sticky top-0 left-0 h-screen",
          "transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-14" : "w-56",
          mobileOpen && "w-56"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-3">
          {!collapsed ? (
            <Link href="/dashboard" className="flex-1">
              <Logo size="sm" />
            </Link>
          ) : (
            <Link href="/dashboard" className="mx-auto">
              <LogoIcon size="sm" />
            </Link>
          )}
          {mobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-7 w-7 lg:hidden text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          {!collapsed && !mobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-7 w-7 hidden lg:flex text-muted-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {collapsed && !mobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 mx-auto my-1 hidden lg:flex text-muted-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {navigation.map((item, idx) => {
            if ("type" in item && item.type === "divider") {
              return (
                <div key={idx} className="py-2">
                  <div className="h-px bg-[hsl(15,12%,10%)]" />
                  {!collapsed && item.label && (
                    <p className="mt-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 font-display">
                      {item.label}
                    </p>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            // Special case for Dashboard - only exact match
            // For other routes, check if pathname starts with href
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-150",
                  collapsed && "justify-center px-1.5",
                  isActive 
                    ? "bg-orange-500/15 text-orange-400" 
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                          item.badge === "AI" 
                            ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400"
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

        {/* Bottom section */}
        {!collapsed && (
          <div className="p-2 space-y-2">
            {/* Usage */}
            <div className="rounded-lg bg-[hsl(15,15%,7%)] p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="h-3 w-3 text-orange-400" />
                <span className="text-[10px] font-semibold font-display text-orange-400 capitalize">
                  {user?.plan || "Free"} {t("common.plan") || "план"}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">
                {generationsLeft} {t("common.generationsLeft") || "генераций осталось"}
              </p>
              <div className="h-1 rounded-full overflow-hidden bg-[hsl(15,12%,10%)]">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 to-pink-500"
                  style={{ width: `${((generationsLimit - generationsUsed) / generationsLimit) * 100}%` }}
                />
              </div>
              <Link href="/dashboard/settings/subscription">
                <Button variant="ghost" size="sm" className="w-full mt-2 text-[10px] gap-1 h-7 text-orange-400">
                  <Crown className="h-3 w-3" />
                  {t("common.upgrade")}
                </Button>
              </Link>
            </div>

            {/* User */}
            {user && (
              <div className="rounded-lg bg-[hsl(15,15%,7%)] p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md text-white text-xs font-semibold bg-gradient-to-br from-orange-500 to-pink-500">
                    {user.firstName?.charAt(0) || <User className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{user.firstName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full mt-2 text-[10px] gap-1 h-6 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-3 w-3" />
                  {t("common.logout")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Collapsed user */}
        {collapsed && user && (
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex h-7 w-7 mx-auto items-center justify-center rounded-md text-white text-xs font-semibold bg-gradient-to-br from-orange-500 to-pink-500 hover:opacity-80"
              title="Выйти"
            >
              {user.firstName?.charAt(0) || <User className="h-3 w-3" />}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
