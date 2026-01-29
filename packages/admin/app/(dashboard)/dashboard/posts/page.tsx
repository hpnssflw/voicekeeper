"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Badge, Tabs, TabsList, TabsTrigger, PageHeader, EmptyState, ListItem } from "@/ui";
import { useFeature } from "@/shared/lib/features";
import { useAuth } from "@/features/auth";
import { postsApi, type Post } from "@/shared/api";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  Bot,
  Loader2,
  Send,
  Calendar,
  Eye,
  MousePointer,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { toast } from "@/ui";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const postsFeature = useFeature("posts");
  const { bots, selectedBotId } = useAuth();

  // Load posts from API
  useEffect(() => {
    const loadPosts = async () => {
      if (!selectedBotId) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await postsApi.list({ botId: selectedBotId });
        setPosts(response.data || []);
      } catch (error) {
        console.warn("Could not load posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [selectedBotId]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (post.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
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

  const handlePublish = async (postId: string) => {
    try {
      await postsApi.update(postId, { status: 'published' });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, status: 'published' } : p));
      toast({ title: "Пост опубликован", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось опубликовать",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await postsApi.delete(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast({ title: "Пост удален", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось удалить",
        variant: "destructive" 
      });
    }
  };

  const hasBots = bots.length > 0;

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title="Посты"
        description="Управление контентом всех ваших каналов"
        rightContent={
          <div className="flex gap-1">
            <Link href="/dashboard/voicekeeper/generate">
              <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                Создать с AI
              </Button>
            </Link>
            <Link href="/dashboard/posts/new">
              <Button size="sm" className="h-6 text-[9px] gap-1" disabled={!postsFeature.canCreate || !hasBots}>
                <Plus className="h-2.5 w-2.5" />
                Новый пост
              </Button>
            </Link>
          </div>
        }
      />

      {/* Check if bots exist */}
      {!hasBots ? (
        <EmptyState
          icon={<Bot className="h-6 w-6 mx-auto text-muted-foreground" />}
          title="Сначала добавьте бота"
          description="Чтобы создавать и публиковать посты, нужно подключить Telegram-бота"
          action={
            <Link href="/dashboard/bots">
              <Button size="sm" className="h-6 text-[9px] gap-1">
                <Plus className="h-2.5 w-2.5" />
                Добавить бота
              </Button>
            </Link>
          }
        />
      ) : isLoading ? (
        <Card className="py-6">
          <CardContent className="text-center p-4">
            <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
            <p className="mt-2 text-[10px] text-muted-foreground">Загрузка постов...</p>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по постам..."
                icon={<Search className="h-3 w-3" />}
                className="h-6 text-[10px]"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-6">
                <TabsTrigger value="all" className="text-[9px] px-2">Все</TabsTrigger>
                <TabsTrigger value="published" className="text-[9px] px-2">Опубликованные</TabsTrigger>
                <TabsTrigger value="scheduled" className="text-[9px] px-2">Запланированные</TabsTrigger>
                <TabsTrigger value="draft" className="text-[9px] px-2">Черновики</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Empty State */}
          <EmptyState
            icon={<FileText className="h-6 w-6 mx-auto text-muted-foreground" />}
            title="Нет постов"
            description="Создайте свой первый пост с помощью AI или вручную"
            action={
              <>
                <Link href="/dashboard/voicekeeper/generate">
                  <Button size="sm" className="h-6 text-[9px] gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    Создать с AI
                  </Button>
                </Link>
                <Link href="/dashboard/posts/new">
                  <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1">
                    <Plus className="h-2.5 w-2.5" />
                    Написать вручную
                  </Button>
                </Link>
              </>
            }
          />
        </>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по постам..."
                icon={<Search className="h-3 w-3" />}
                className="h-6 text-[10px]"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-6">
                <TabsTrigger value="all" className="text-[9px] px-1.5">Все ({posts.length})</TabsTrigger>
                <TabsTrigger value="published" className="text-[9px] px-1.5">
                  Опубликованные ({posts.filter(p => p.status === 'published').length})
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="text-[9px] px-1.5">
                  Запланированные ({posts.filter(p => p.status === 'scheduled').length})
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-[9px] px-1.5">
                  Черновики ({posts.filter(p => p.status === 'draft').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Posts List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.03]">
                {filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center p-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-[11px] font-medium">Посты не найдены</p>
                    <p className="text-[10px] text-muted-foreground">
                      Попробуйте изменить фильтры или создайте новый пост
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-center gap-2 p-2 hover:bg-accent/50 group"
                    >
                      {/* Status indicator */}
                      <div
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          post.status === "published"
                            ? "bg-emerald-500"
                            : post.status === "scheduled"
                            ? "bg-amber-500"
                            : "bg-gray-500"
                        }`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-medium truncate text-[11px] leading-tight">
                            {post.title || post.content?.substring(0, 50) || 'Без заголовка'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-muted-foreground mt-0.5 flex-wrap">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="h-2.5 w-2.5" />
                            {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          {post.metrics && (
                            <>
                              <span className="flex items-center gap-0.5">
                                <Eye className="h-2.5 w-2.5" />
                                {post.metrics.views}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MousePointer className="h-2.5 w-2.5" />
                                {post.metrics.clicks}
                              </span>
                            </>
                          )}
                          {post.publishTarget && (
                            <Badge variant="outline" className="text-[8px] px-1 py-0">
                              {post.publishTarget === 'channel' ? 'В канал' : 'Подписчикам'}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="hidden sm:block">
                        {getStatusBadge(post.status)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {post.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handlePublish(post._id)}
                            title="Опубликовать"
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          title="Редактировать"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(post._id)}
                          title="Удалить"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid gap-1.5 md:grid-cols-4">
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Всего постов</span>
                  <span className="text-[13px] font-bold font-display">{posts.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Опубликовано</span>
                  <span className="text-[13px] font-bold font-display text-emerald-400">
                    {posts.filter((p) => p.status === "published").length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Запланировано</span>
                  <span className="text-[13px] font-bold font-display text-amber-400">
                    {posts.filter((p) => p.status === "scheduled").length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Черновики</span>
                  <span className="text-[13px] font-bold font-display">
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
