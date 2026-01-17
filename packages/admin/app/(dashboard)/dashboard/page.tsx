"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/use-translations";
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight font-display">
            {user?.firstName ? t("dashboard.greeting", { name: user.firstName }) : t("dashboard.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {hasData ? t("dashboard.overview") : t("dashboard.startWithBot")}
          </p>
        </div>
        <Link href="/dashboard/voicekeeper/generate">
          <Button variant="gradient" size="sm" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="flex-1 min-w-[80px]">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)] transition-colors">
              <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold font-display">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground truncate">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State or Content */}
      {!hasData ? (
        <Card className="py-8">
          <CardContent className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/20">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-semibold font-display mb-1">{t("dashboard.emptyState.title")}</h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
              {t("dashboard.emptyState.description")}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Link href="/dashboard/bots">
                <Button size="sm" className="gap-1.5">
                  <Bot className="h-3 w-3" />
                  {t("dashboard.emptyState.addBot")}
                </Button>
              </Link>
              <Link href="/dashboard/channels">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Radio className="h-3 w-3" />
                  {t("dashboard.emptyState.addChannel")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle>{t("dashboard.quickActions.title")}</CardTitle>
                  <CardDescription>{t("dashboard.quickActions.description")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/voicekeeper/generate" className="block">
                <div className="rounded-lg bg-orange-500/[0.06] p-3 hover:bg-orange-500/[0.1] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/15">
                      <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">{t("dashboard.quickActions.createPost")}</h4>
                      <p className="text-[10px] text-muted-foreground">VoiceKeeper</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/trends" className="block">
                <div className="rounded-lg bg-amber-500/[0.06] p-3 hover:bg-amber-500/[0.1] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">{t("dashboard.quickActions.trendRadar")}</h4>
                      <p className="text-[10px] text-muted-foreground">Analysis</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/voicekeeper/fingerprint" className="block">
                <div className="rounded-lg bg-emerald-500/[0.06] p-3 hover:bg-emerald-500/[0.1] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15">
                      <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">{t("dashboard.quickActions.fingerprint")}</h4>
                      <p className="text-[10px] text-muted-foreground">Setup</p>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan */}
      {user && (
        <Card className="bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="gradient" className="capitalize">{user.plan}</Badge>
                <span className="text-[10px] text-muted-foreground">
                  {user.plan === "free" ? t("dashboard.plan.free") : user.plan === "pro" ? t("dashboard.plan.pro") : t("dashboard.plan.business")}
                </span>
              </div>
              {user.plan === "free" && (
                <Link href="/dashboard/settings/subscription">
                  <Button variant="ghost" size="sm" className="gap-1 text-orange-400 text-[10px]">
                    <Zap className="h-3 w-3" />
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

