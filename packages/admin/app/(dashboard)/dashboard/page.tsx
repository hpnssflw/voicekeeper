"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ActionItem, EmptyState, PageHeader, StatCard } from "@/ui";
import { useAuth } from "@/features/auth";
import { useTranslations } from "@/shared/lib/i18n";
import {
  ArrowRight,
  BarChart3,
  Bot,
  FileText,
  Plus,
  Radio,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, bots, channels } = useAuth();
  const t = useTranslations();
  
  const activeBots = bots.filter(b => b.isActive).length;
  const totalPosts = bots.reduce((sum, b) => sum + b.postsCount, 0);
  const totalSubscribers = bots.reduce((sum, b) => sum + b.subscriberCount, 0);
  
  const stats = [
    { name: t("dashboard.stats.bots"), value: activeBots.toString(), icon: Bot, href: "/dashboard/bots" },
    { name: t("dashboard.stats.posts"), value: totalPosts.toString(), icon: FileText, href: "/dashboard/posts" },
    { name: t("dashboard.stats.subscribers"), value: totalSubscribers > 1000 ? `${(totalSubscribers / 1000).toFixed(1)}K` : totalSubscribers.toString(), icon: Users, href: "/dashboard/subscribers" },
    { name: t("dashboard.stats.channels"), value: channels.length.toString(), icon: Radio, href: "/dashboard/channels" },
  ];

  const hasData = bots.length > 0 || channels.length > 0;

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title={user?.firstName ? t("dashboard.greeting", { name: user.firstName }) : t("dashboard.title")}
        description={hasData ? t("dashboard.overview") : t("dashboard.startWithBot")}
        rightContent={
          <div className="flex items-center gap-2">
            {stats.map((stat) => (
              <StatCard
                key={stat.name}
                icon={stat.icon}
                label={stat.name}
                value={stat.value}
                href={stat.href}
                variant="compact"
              />
            ))}
          </div>
        }
      />

      {/* Empty State or Content */}
      {!hasData ? (
        <EmptyState
          icon={
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
          }
          title={t("dashboard.emptyState.title")}
          description={t("dashboard.emptyState.description")}
          action={
            <>
              <Link href="/dashboard/bots">
                <Button size="sm" className="h-6 text-[9px]">
                  <Bot className="h-2.5 w-2.5" />
                  {t("dashboard.emptyState.addBot")}
                </Button>
              </Link>
              <Link href="/dashboard/channels">
                <Button variant="outline" size="sm" className="h-6 text-[9px]">
                  <Radio className="h-2.5 w-2.5" />
                  {t("dashboard.emptyState.addChannel")}
                </Button>
              </Link>
            </>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Bots */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>{t("dashboard.yourBots.title")}</CardTitle>
                <CardDescription>{t("dashboard.yourBots.description")}</CardDescription>
              </div>
              <Link href="/dashboard/bots">
                <Button variant="ghost" size="sm" className="gap-1 text-[10px]">
                  {t("dashboard.yourBots.allBots")} <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {bots.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-2">{t("dashboard.yourBots.noBots")}</p>
                  <Link href="/dashboard/bots">
                    <Button size="sm" className="gap-1.5">
                      <Plus className="h-3 w-3" />
                      {t("dashboard.yourBots.addBot")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {bots.slice(0, 4).map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between rounded-lg bg-[hsl(15,12%,8%)] p-2.5 hover:bg-[hsl(15,12%,10%)] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bot.isActive ? "bg-gradient-to-br from-orange-500 to-pink-500" : "bg-muted"}`}>
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium">{bot.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{bot.username}</p>
                        </div>

                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1"><Users className="h-3 w-3" />{bot.subscriberCount}</div>
                          <div className="flex items-center gap-1"><FileText className="h-3 w-3" />{bot.postsCount}</div>
                        </div>
                        <Badge variant={bot.isActive ? "success" : "secondary"}>
                          {bot.isActive ? t("dashboard.yourBots.active") : t("dashboard.yourBots.inactive")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-pink-500">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[11px]">{t("dashboard.quickActions.title")}</CardTitle>
                  <CardDescription className="text-[9px]">{t("dashboard.quickActions.description")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 p-2">
              <ActionItem
                title={t("dashboard.quickActions.createPost")}
                description="VoiceKeeper"
                icon={Sparkles}
                href="/dashboard/voicekeeper/generate"
                color="orange"
              />
              <ActionItem
                title={t("dashboard.quickActions.trendRadar")}
                description="Analysis"
                icon={TrendingUp}
                href="/dashboard/trends"
                color="amber"
              />
              <ActionItem
                title={t("dashboard.quickActions.fingerprint")}
                description="Setup"
                icon={BarChart3}
                href="/dashboard/voicekeeper/fingerprint"
                color="emerald"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan */}
      {user && (
        <Card className="bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge variant="gradient" className="capitalize text-[9px] px-1.5 py-0">{user.plan}</Badge>
                <span className="text-[9px] text-muted-foreground">
                  {user.plan === "free" ? t("dashboard.plan.free") : user.plan === "pro" ? t("dashboard.plan.pro") : t("dashboard.plan.business")}
                </span>
              </div>
              {user.plan === "free" && (
                <Link href="/dashboard/settings/subscription">
                  <Button variant="ghost" size="sm" className="h-6 gap-0.5 text-orange-400 text-[9px]">
                    <Zap className="h-2.5 w-2.5" />
                    {t("common.upgrade")}
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


