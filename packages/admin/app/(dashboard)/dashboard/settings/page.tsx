"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useUnderDevelopment } from "@/components/ui/under-development-modal";
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
    description: "Настройка токенов AI и сервисов",
    href: "/dashboard/settings/api-keys",
    icon: Key,
    available: true,
  },
  {
    title: "Подписка",
    description: "Управление тарифом и оплатой",
    href: "/dashboard/settings/subscription",
    icon: CreditCard,
    available: true,
  },
  {
    title: "Профиль",
    description: "Данные аккаунта",
    href: "/dashboard/settings/profile",
    icon: User,
    available: true,
  },
  {
    title: "Уведомления",
    description: "Настройка оповещений",
    href: null,
    icon: Bell,
    available: false,
  },
  {
    title: "Безопасность",
    description: "2FA и права доступа",
    href: null,
    icon: Shield,
    available: false,
  },
  {
    title: "Язык и регион",
    description: "Локализация и часовой пояс",
    href: null,
    icon: Globe,
    available: false,
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const underDev = useUnderDevelopment();
  
  const plan = user?.plan || "free";
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

  const handleUnavailable = (title: string, description: string) => {
    underDev.showModal(title, `${description}. Эта функция скоро будет доступна.`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold font-display">Настройки</h1>
        <p className="text-xs text-muted-foreground">Управление аккаунтом</p>
      </div>

      {/* Current Plan */}
      <Card className="p-4 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{plan}</span>
                <Badge variant="secondary" className="text-[9px]">{generationsUsed}/{generationsLimit}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {plan === "free" ? "Перейдите на Pro" : "Текущий план"}
              </p>
            </div>
          </div>
          {plan !== "business" && (
            <Link href="/dashboard/settings/subscription">
              <Button size="sm" className="gap-1 bg-gradient-to-r from-orange-500 to-pink-500 border-0 text-xs">
                <Zap className="h-3 w-3" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          
          if (section.available && section.href) {
            return (
              <Link key={section.title} href={section.href}>
                <Card className="p-3 hover:bg-[hsl(15,12%,10%)] transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h3 className="text-xs font-medium">{section.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            );
          }
          
          return (
            <Card 
              key={section.title} 
              className="p-3 hover:bg-[hsl(15,12%,10%)] transition-colors cursor-pointer h-full opacity-60"
              onClick={() => handleUnavailable(section.title, section.description)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-medium">{section.title}</h3>
                      <Badge variant="secondary" className="text-[8px] px-1">Soon</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">AI генерации</span>
          <span>{generationsUsed}/{generationsLimit}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[hsl(15,12%,8%)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
            style={{ width: `${Math.min((generationsUsed / generationsLimit) * 100, 100)}%` }}
          />
        </div>
      </Card>

      <underDev.Modal />
    </div>
  );
}
