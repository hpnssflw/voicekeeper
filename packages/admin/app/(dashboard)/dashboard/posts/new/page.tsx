"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { postsApi } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import {
  ArrowLeft,
  Send,
  Clock,
  Save,
  Hash,
  Users,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const { bots, selectedBotId, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishTarget, setPublishTarget] = useState<"channel" | "subscribers">("channel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBotForPost, setSelectedBotForPost] = useState(selectedBotId || bots[0]?.id);

  const selectedBot = bots.find(b => b.id === selectedBotForPost);

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      toast({ title: "Ошибка", description: "Введите текст поста", variant: "destructive" });
      return;
    }

    if (!selectedBotForPost) {
      toast({ title: "Ошибка", description: "Выберите бота", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await postsApi.create({
        botId: selectedBotForPost,
        authorId: user?.id || "anonymous",
        title: title || undefined,
        content,
        status: "draft",
        publishTarget,
      });
      toast({ title: "Черновик сохранен", variant: "success" });
      router.push("/dashboard/posts");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({ title: "Ошибка", description: "Введите текст поста", variant: "destructive" });
      return;
    }

    if (!selectedBotForPost) {
      toast({ title: "Ошибка", description: "Выберите бота", variant: "destructive" });
      return;
    }

    if (!selectedBot?.channelId && publishTarget === "channel") {
      toast({ 
        title: "Ошибка", 
        description: "Сначала настройте канал для бота", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await postsApi.create({
        botId: selectedBotForPost,
        authorId: user?.id || "anonymous",
        title: title || undefined,
        content,
        status: "published",
        publishTarget,
      });
      toast({ title: "Пост опубликован!", variant: "success" });
      router.push("/dashboard/posts");
    } catch (error) {
      toast({
        title: "Ошибка публикации",
        description: error instanceof Error ? error.message : "Не удалось опубликовать",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = prefix) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Новый пост</h1>
            <p className="text-muted-foreground">
              Создайте и опубликуйте пост в Telegram
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Сохранить черновик
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Опубликовать
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Содержание поста</CardTitle>
              <CardDescription>
                Используйте Markdown для форматирования: *жирный*, _курсив_, `код`
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок (опционально)</Label>
                <Input
                  id="title"
                  placeholder="Заголовок поста"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Formatting toolbar */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertMarkdown("*")}
                  title="Жирный"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertMarkdown("_")}
                  title="Курсив"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertMarkdown("`")}
                  title="Код"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => insertMarkdown("[", "](url)")}
                  title="Ссылка"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Текст поста</Label>
                <textarea
                  id="content"
                  placeholder="Напишите текст вашего поста..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex min-h-[300px] w-full rounded-xl bg-[hsl(var(--surface-base)/0.6)] backdrop-blur-sm px-4 py-3 text-base shadow-[0_0_0_1px_hsl(var(--primary)/0.05),inset_0_1px_2px_hsl(0_0%_0%/0.1)] transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_hsl(var(--primary)/0.3),0_0_20px_-5px_hsl(var(--primary)/0.2)] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {content.length} символов
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Предпросмотр</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-[#1e1e1e] p-4 font-sans text-sm">
                  {title && <p className="font-bold mb-2">{title}</p>}
                  <p className="whitespace-pre-wrap">{content}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Bot Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Бот для публикации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => setSelectedBotForPost(bot.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBotForPost === bot.id
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : "bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {bot.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{bot.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{bot.username}</p>
                  </div>
                  {selectedBotForPost === bot.id && (
                    <Badge variant="success" className="text-xs">Выбран</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Publish Target */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Куда опубликовать</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                onClick={() => setPublishTarget("channel")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  publishTarget === "channel"
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">В канал</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedBot?.channelUsername || "Канал не настроен"}
                  </p>
                </div>
              </div>
              <div
                onClick={() => setPublishTarget("subscribers")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  publishTarget === "subscribers"
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Подписчикам бота</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedBot?.subscriberCount || 0} подписчиков
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestion */}
          <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Нужна помощь?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Используйте AI для генерации контента в вашем стиле
                  </p>
                  <Link href="/dashboard/voicekeeper/generate">
                    <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                      Создать с AI →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

