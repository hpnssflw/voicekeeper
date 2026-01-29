"use client";

import { Card, CardContent, Button } from "@/ui";
import { useAuth } from "@/features/auth";
import Link from "next/link";
import {
  Users,
  Lock,
  Crown,
  Bot,
} from "lucide-react";

export default function SubscribersPage() {
  const { user, bots } = useAuth();
  
  // Premium gate based on user plan
  const isPremium = user?.plan === "pro" || user?.plan === "business";
  const totalSubscribers = bots.reduce((sum, b) => sum + b.subscriberCount, 0);

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-xl opacity-40" />
        </div>
        <h1 className="mt-5 text-xl font-bold font-display">Подписчики</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Управление базой подписчиков, сегментация аудитории и аналитика.
          Доступно на тарифах Pro и Business.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/settings/subscription">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0">
              <Crown className="h-3.5 w-3.5" />
              Перейти на Pro
            </Button>
          </Link>
          <Link href="/dashboard/bots">
            <Button variant="outline" size="sm">Управление ботами</Button>
          </Link>
        </div>
        
        {/* Preview stats */}
        <Card className="mt-8 p-4 bg-[hsl(15,12%,8%)] max-w-xs w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Всего подписчиков</span>
            </div>
            <span className="text-sm font-bold">{totalSubscribers.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ботов подключено</span>
            </div>
            <span className="text-sm font-bold">{bots.length}</span>
          </div>
        </Card>
      </div>
    );
  }

  // Premium content
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold font-display">Подписчики</h1>
          <p className="text-xs text-muted-foreground">Управление аудиторией</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        <Card className="flex-1 p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-sm font-bold">{totalSubscribers.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">Всего</p>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-sm font-bold">{bots.length}</p>
              <p className="text-[9px] text-muted-foreground">Ботов</p>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400" />
            <div>
              <p className="text-sm font-bold">{bots.length > 0 ? Math.round(totalSubscribers / bots.length) : 0}</p>
              <p className="text-[9px] text-muted-foreground">Ср./бот</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty state */}
      <Card className="py-12">
        <CardContent className="text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium mb-1">Подписчики появятся здесь</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Когда пользователи начнут взаимодействовать с вашими ботами
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
