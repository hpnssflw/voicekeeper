"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/widgets";
import { useAuth } from "@/lib/auth";
import { useUnderDevelopment } from "@/components/ui/under-development-modal";
import { useTranslations } from "@/lib/use-translations";
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

export default function SettingsPage() {
  const { user } = useAuth();
  const t = useTranslations();
  const underDev = useUnderDevelopment();
  
  const settingsSections = [
    {
      title: t("settings.sections.apiKeys.title"),
      description: t("settings.sections.apiKeys.description"),
      href: "/dashboard/settings/api-keys",
      icon: Key,
      available: true,
    },
    {
      title: t("settings.sections.subscription.title"),
      description: t("settings.sections.subscription.description"),
      href: "/dashboard/settings/subscription",
      icon: CreditCard,
      available: true,
    },
    {
      title: t("settings.sections.profile.title"),
      description: t("settings.sections.profile.description"),
      href: "/dashboard/settings/profile",
      icon: User,
      available: true,
    },
    {
      title: t("settings.sections.notifications.title"),
      description: t("settings.sections.notifications.description"),
      href: null,
      icon: Bell,
      available: false,
    },
    {
      title: t("settings.sections.security.title"),
      description: t("settings.sections.security.description"),
      href: null,
      icon: Shield,
      available: false,
    },
    {
      title: t("settings.sections.locale.title"),
      description: t("settings.sections.locale.description"),
      href: null,
      icon: Globe,
      available: false,
    },
  ];
  
  const plan = user?.plan || "free";
  const generationsUsed = user?.generationsUsed || 0;
  const generationsLimit = user?.generationsLimit || 3;

  const handleUnavailable = (title: string, description: string) => {
    underDev.showModal(title, `${description}. Эта функция скоро будет доступна.`);
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      {/* Current Plan */}
      <Card className="p-2 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-pink-500">
              <Crown className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium capitalize">{plan}</span>
                <Badge variant="secondary" className="text-[8px]">{generationsUsed}/{generationsLimit}</Badge>
              </div>
              <p className="text-[9px] text-muted-foreground">
                {plan === "free" ? t("settings.unlockMore") : plan === "pro" ? t("settings.proDescription") : t("settings.businessDescription")}
              </p>
            </div>
          </div>
          {plan !== "business" && (
            <Link href="/dashboard/settings/subscription">
              <Button size="sm" className="gap-1 bg-gradient-to-r from-orange-500 to-pink-500 border-0 h-6 text-[9px]">
                <Zap className="h-2.5 w-2.5" />
                {t("common.upgrade")}
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-1.5 sm:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          
          if (section.available && section.href) {
            return (
              <Link key={section.title} href={section.href}>
                <Card className="p-2 hover:bg-[hsl(15,12%,10%)] transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <h3 className="text-[11px] font-medium">{section.title}</h3>
                        <p className="text-[9px] text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            );
          }
          
          return (
            <Card 
              key={section.title} 
              className="p-2 hover:bg-[hsl(15,12%,10%)] transition-colors cursor-pointer h-full opacity-60"
              onClick={() => handleUnavailable(section.title, section.description)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-[11px] font-medium">{section.title}</h3>
                      <Badge variant="secondary" className="text-[8px] px-0.5">Soon</Badge>
                    </div>
                    <p className="text-[9px] text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage */}
      <Card className="p-2">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">AI генерации</span>
          <span>{generationsUsed}/{generationsLimit}</span>
        </div>
        <div className="h-1 rounded-full bg-[hsl(15,12%,8%)] overflow-hidden">
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
