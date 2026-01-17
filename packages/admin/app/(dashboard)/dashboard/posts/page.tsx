"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeature, DEMO_MODE } from "@/lib/features";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Eye,
  MousePointer,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  Send,
  Clock,
  Filter,
} from "lucide-react";

const mockPosts = [
  {
    id: "1",
    title: "5 AI-инструментов для контент-маркетолога",
    content: "Друзья, сегодня хочу поделиться подборкой инструментов...",
    status: "published",
    bot: "Content Channel Bot",
    views: 2340,
    clicks: 156,
    publishedAt: "2026-01-17T10:00:00Z",
    createdAt: "2026-01-16T18:30:00Z",
    isAiGenerated: true,
  },
  {
    id: "2",
    title: "Как увеличить вовлеченность в Telegram",
    content: "Вопрос к вам: как часто вы анализируете статистику канала?...",
    status: "scheduled",
    bot: "Content Channel Bot",
    views: 0,
    clicks: 0,
    scheduledAt: "2026-01-18T18:00:00Z",
    createdAt: "2026-01-17T12:00:00Z",
    isAiGenerated: true,
  },
  {
    id: "3",
    title: "Новости индустрии #47",
    content: "На этой неделе произошло много интересного...",
    status: "draft",
    bot: "News Bot",
    views: 0,
    clicks: 0,
    createdAt: "2026-01-17T14:30:00Z",
    isAiGenerated: false,
  },
  {
    id: "4",
    title: "Тренды Telegram в 2026",
    content: "Давайте разберёмся, что ждёт нас в этом году...",
    status: "published",
    bot: "Marketing Bot",
    views: 4520,
    clicks: 312,
    publishedAt: "2026-01-15T12:00:00Z",
    createdAt: "2026-01-14T20:00:00Z",
    isAiGenerated: false,
  },
  {
    id: "5",
    title: "Как я автоматизировал создание контента",
    content: "Расскажу про свой workflow с использованием AI...",
    status: "published",
    bot: "Content Channel Bot",
    views: 3180,
    clicks: 245,
    publishedAt: "2026-01-13T14:00:00Z",
    createdAt: "2026-01-12T22:00:00Z",
    isAiGenerated: true,
  },
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const postsFeature = useFeature("posts");

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success">Опубликован</Badge>;
      case "scheduled":
        return <Badge variant="warning">Запланирован</Badge>;
      case "draft":
        return <Badge variant="secondary">Черновик</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Посты</h1>
          <p className="text-muted-foreground">
            Управление контентом всех ваших каналов
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/voicekeeper/generate">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Создать с AI
            </Button>
          </Link>
          <Link href="/dashboard/posts/new">
            <Button className="gap-2" disabled={!postsFeature.canCreate}>
              <Plus className="h-4 w-4" />
              Новый пост
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по постам..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="published">Опубликованные</TabsTrigger>
            <TabsTrigger value="scheduled">Запланированные</TabsTrigger>
            <TabsTrigger value="draft">Черновики</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Posts List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-white/[0.03]">
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Посты не найдены</p>
                <p className="text-muted-foreground">
                  Попробуйте изменить фильтры или создайте новый пост
                </p>
                <Link href="/dashboard/voicekeeper/generate" className="mt-4">
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Создать с AI
                  </Button>
                </Link>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                >
                  {/* Status indicator */}
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      post.status === "published"
                        ? "bg-emerald-500"
                        : post.status === "scheduled"
                        ? "bg-amber-500"
                        : "bg-muted-foreground"
                    }`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      {post.isAiGenerated && (
                        <Badge variant="gradient" className="gap-1 shrink-0">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{post.bot}</span>
                      {post.status === "scheduled" && post.scheduledAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(post.scheduledAt)}
                        </span>
                      )}
                      {post.status === "published" && post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  {post.status === "published" && (
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MousePointer className="h-4 w-4" />
                        {post.clicks}
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="hidden sm:block">
                    {getStatusBadge(post.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {post.status === "draft" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        disabled={!postsFeature.canPublish}
                      >
                        <Send className="h-3 w-3" />
                        <span className="hidden lg:inline">Опубликовать</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Всего постов</span>
              <span className="text-2xl font-bold font-display">{mockPosts.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Опубликовано</span>
              <span className="text-2xl font-bold font-display text-emerald-400">
                {mockPosts.filter((p) => p.status === "published").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Запланировано</span>
              <span className="text-2xl font-bold font-display text-amber-400">
                {mockPosts.filter((p) => p.status === "scheduled").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Черновики</span>
              <span className="text-2xl font-bold font-display">
                {mockPosts.filter((p) => p.status === "draft").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {DEMO_MODE && (
        <p className="text-center text-sm text-muted-foreground">
          В демо-режиме функции создания и публикации отключены
        </p>
      )}
    </div>
  );
}

