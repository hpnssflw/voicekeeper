"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/brand/feature-icon";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
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
  },
  {
    title: "Подписка",
    description: "Управление тарифным планом и оплатой",
    href: "/dashboard/settings/subscription",
    icon: CreditCard,
  },
  {
    title: "Уведомления",
    description: "Настройка оповещений и алертов",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Профиль",
    description: "Данные аккаунта и персонализация",
    href: "/dashboard/settings/profile",
    icon: User,
  },
  {
    title: "Безопасность",
    description: "2FA, сессии и права доступа",
    href: "/dashboard/settings/security",
    icon: Shield,
  },
  {
    title: "Язык и регион",
    description: "Языковые настройки и часовой пояс",
    href: "/dashboard/settings/locale",
    icon: Globe,
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  
  const plan = user?.plan || "free";
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

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
      <Card className="bg-gradient-to-r from-orange-500/10 via-transparent to-pink-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/25">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold font-display capitalize">Текущий план: {plan}</h3>
                  <Badge variant="secondary">{generationsUsed}/{generationsLimit} генераций</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan === "free" 
                    ? "Разблокируйте больше возможностей с Pro или Business"
                    : plan === "pro"
                    ? "У вас Pro план. Перейдите на Business для безлимита"
                    : "У вас максимальный план Business"}
                </p>
              </div>
            </div>
            {plan !== "business" && (
              <Link href="/dashboard/settings/subscription">
                <Button className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-red-600 hover:to-emerald-600 border-0 shadow-lg shadow-orange-500/25">
                  <Zap className="h-4 w-4" />
                  Улучшить план
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:bg-white/[0.03] transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <FeatureIcon icon={Icon} variant="info" size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{section.title}</h3>
                          {section.title === "Подписка" && (
                            <Badge variant="secondary" className="capitalize">{plan}</Badge>
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

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Использование ресурсов</CardTitle>
          <CardDescription>
            Текущий период: {new Date().toLocaleDateString("ru", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">AI генерации</span>
                <span>{generationsUsed}/{generationsLimit}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
                  style={{ width: `${Math.min((generationsUsed / generationsLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Trend Radar сканирований</span>
                <span>{plan === "free" ? "Недоступно" : "0/∞"}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
