"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeature } from "@/lib/features";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  Bot,
} from "lucide-react";

export interface Post {
  id: string;
  title: string;
  content: string;
  status: "published" | "scheduled" | "draft";
  botId: string;
  views: number;
  clicks: number;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  isAiGenerated: boolean;
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const postsFeature = useFeature("posts");
  const { bots } = useAuth();
  
  // Posts would come from API - for now empty array
  const posts: Post[] = [];

  const filteredPosts = posts.filter((post) => {
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

  const hasBots = bots.length > 0;

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
            <Button className="gap-2" disabled={!postsFeature.canCreate || !hasBots}>
              <Plus className="h-4 w-4" />
              Новый пост
            </Button>
          </Link>
        </div>
      </div>

      {/* Check if bots exist */}
      {!hasBots ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Сначала добавьте бота</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Чтобы создавать и публиковать посты, нужно подключить Telegram-бота
            </p>
            <Link href="/dashboard/bots">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить бота
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <>
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

          {/* Empty State */}
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium font-display mb-2">Нет постов</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Создайте свой первый пост с помощью AI или вручную
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard/voicekeeper/generate">
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Создать с AI
                  </Button>
                </Link>
                <Link href="/dashboard/posts/new">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Написать вручную
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
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

          {/* Posts List - will be populated from API */}
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
                            : "bg-gray-500"
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
                      </div>

                      {/* Status badge */}
                      <div className="hidden sm:block">
                        {getStatusBadge(post.status)}
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
                  <span className="text-2xl font-bold font-display">{posts.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Опубликовано</span>
                  <span className="text-2xl font-bold font-display text-emerald-400">
                    {posts.filter((p) => p.status === "published").length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Запланировано</span>
                  <span className="text-2xl font-bold font-display text-amber-400">
                    {posts.filter((p) => p.status === "scheduled").length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Черновики</span>
                  <span className="text-2xl font-bold font-display">
                    {posts.filter((p) => p.status === "draft").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
