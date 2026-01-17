"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import Link from "next/link";
import {
  Settings,
  Key,
  CreditCard,
  Bell,
  User,
  Shield,
  Globe,
  ChevronRight,
  Crown,
  Zap,
} from "lucide-react";

const settingsSections = [
  {
    title: "API ключи",
    description: "Настройка токенов AI, Telegram и других сервисов",
    href: "/dashboard/settings/api-keys",
    icon: Key,
    badge: null,
  },
  {
    title: "Подписка",
    description: "Управление тарифным планом и оплатой",
    href: "/dashboard/settings/subscription",
    icon: CreditCard,
    badge: "Free",
    badgeVariant: "secondary" as const,
  },
  {
    title: "Уведомления",
    description: "Настройка оповещений и алертов",
    href: "/dashboard/settings/notifications",
    icon: Bell,
    badge: null,
  },
  {
    title: "Профиль",
    description: "Данные аккаунта и персонализация",
    href: "/dashboard/settings/profile",
    icon: User,
    badge: null,
  },
  {
    title: "Безопасность",
    description: "2FA, сессии и права доступа",
    href: "/dashboard/settings/security",
    icon: Shield,
    badge: null,
  },
  {
    title: "Язык и регион",
    description: "Языковые настройки и часовой пояс",
    href: "/dashboard/settings/locale",
    icon: Globe,
    badge: null,
  },
];

const currentPlan = {
  name: "Free",
  generations: 3,
  maxGenerations: 3,
  competitors: 0,
  maxCompetitors: 0,
  daysLeft: null,
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Настройки</h1>
        <p className="text-muted-foreground">
          Управление аккаунтом и конфигурация
        </p>
      </div>

      {/* Current Plan Banner */}
      <Card className="glass-panel-glow bg-gradient-to-r from-red-500/10 to-emerald-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg shadow-red-500/25">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold font-display">Текущий план: {currentPlan.name}</h3>
                  <Badge variant="secondary">{currentPlan.generations}/{currentPlan.maxGenerations} генераций</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Разблокируйте больше возможностей с Pro или Business
                </p>
              </div>
            </div>
            <Link href="/dashboard/settings/subscription">
              <Button className="gap-2 bg-gradient-to-r from-red-500 to-emerald-500 hover:from-red-600 hover:to-emerald-600 border-0 shadow-lg shadow-red-500/25">
                <Zap className="h-4 w-4" />
                Улучшить план
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="glass-panel hover:bg-white/[0.03] transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <FeatureIcon icon={Icon} variant="info" size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{section.title}</h3>
                          {section.badge && (
                            <Badge variant={section.badgeVariant}>{section.badge}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="glass-panel-glow">
        <CardHeader>
          <CardTitle className="font-display">Использование ресурсов</CardTitle>
          <CardDescription>
            Текущий период: Январь 2026
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">AI генерации</span>
                <span>{currentPlan.generations}/{currentPlan.maxGenerations}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-emerald-500 shadow-[0_0_10px_hsl(0,72%,51%,0.5)]"
                  style={{ width: `${(currentPlan.generations / currentPlan.maxGenerations) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Конкуренты</span>
                <span>{currentPlan.competitors}/{currentPlan.maxCompetitors || "∞"}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: currentPlan.maxCompetitors ? `${(currentPlan.competitors / currentPlan.maxCompetitors) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">API запросы</span>
                <span>247/∞</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

