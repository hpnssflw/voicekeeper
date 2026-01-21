"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { botsApi, postsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  Bold,
  Code,
  Hash,
  Italic,
  Link as LinkIcon,
  Loader2,
  Save,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BotDetails {
  id: string;
  username: string;
  firstName?: string;
  telegramId?: number;
  isActive: boolean;
  channel?: {
    id: number | string;
    username?: string;
    title?: string;
    membersCount?: number;
  } | null;
  stats?: {
    postsCount: number;
    publishedCount: number;
  };
}

export default function NewPostPage() {
  const router = useRouter();
  const { bots, selectedBotId, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishTarget, setPublishTarget] = useState<"channel" | "subscribers">("channel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBotForPost, setSelectedBotForPost] = useState(selectedBotId || bots[0]?.id);
  const [botDetails, setBotDetails] = useState<BotDetails | null>(null);

  const selectedBot = bots.find(b => b.id === selectedBotForPost);

  // Load bot details from API to get channel information
  useEffect(() => {
    if (selectedBotForPost) {
      botsApi.get(selectedBotForPost)
        .then(details => {
          setBotDetails(details);
        })
        .catch(error => {
          console.warn("Could not load bot details:", error);
          // Fallback to local bot data
          const localBot = bots.find(b => b.id === selectedBotForPost);
          if (localBot) {
            setBotDetails({
              id: localBot.id,
              username: localBot.username.replace('@', ''),
              firstName: localBot.name,
              telegramId: localBot.telegramId,
              isActive: localBot.isActive,
              channel: localBot.channelId ? {
                id: localBot.channelId,
                username: localBot.channelUsername,
                title: localBot.channelTitle,
              } : null,
            });
          }
        });
    }
  }, [selectedBotForPost, bots]);

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

    if (!botDetails?.channel?.id && publishTarget === "channel") {
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
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold">Новый пост</h1>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              Создайте и опубликуйте пост в Telegram
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSubmitting} className="h-6 text-[9px]">
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
            Сохранить черновик
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={isSubmitting} className="h-6 text-[9px]">
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
            Опубликовать
          </Button>
        </div>
      </div>

      <div className="grid gap-1.5 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-1.5">
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Содержание поста</CardTitle>
              <CardDescription className="text-[9px]">
                Используйте Markdown для форматирования: *жирный*, _курсив_, `код`
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-[9px]">Заголовок (опционально)</Label>
                <Input
                  id="title"
                  placeholder="Заголовок поста"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-7 text-[11px]"
                />
              </div>

              {/* Formatting toolbar */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.03]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => insertMarkdown("*")}
                  title="Жирный"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => insertMarkdown("_")}
                  title="Курсив"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => insertMarkdown("`")}
                  title="Код"
                >
                  <Code className="h-3 w-3" />
                </Button>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => insertMarkdown("[", "](url)")}
                  title="Ссылка"
                >
                  <LinkIcon className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label htmlFor="content" className="text-[9px]">Текст поста</Label>
                <textarea
                  id="content"
                  placeholder="Напишите текст вашего поста..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex min-h-[200px] w-full rounded-lg bg-white/[0.03] px-2 py-1.5 text-[11px] shadow-[0_0_0_1px_hsl(var(--primary)/0.05)] transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_hsl(var(--primary)/0.3)] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <p className="text-[9px] text-muted-foreground">
                  {content.length} символов
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {content && (
            <Card>
              <CardHeader className="pb-1.5 p-2">
                <CardTitle className="text-[11px]">Предпросмотр</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="rounded-lg bg-[#1e1e1e] p-2 font-sans text-[10px]">
                  {title && <p className="font-bold mb-1">{title}</p>}
                  <p className="whitespace-pre-wrap">{content}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-1.5">
          {/* Bot Selection */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Бот для публикации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 p-2">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => setSelectedBotForPost(bot.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedBotForPost === bot.id
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : "bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-[9px] font-bold">
                      {bot.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[10px] truncate">{bot.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{bot.username}</p>
                  </div>
                  {selectedBotForPost === bot.id && (
                    <Badge variant="success" className="text-[8px] px-1 py-0">Выбран</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Publish Target */}
          <Card>
            <CardHeader className="pb-1.5 p-2">
              <CardTitle className="text-[11px]">Куда опубликовать</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 p-2">
              <div
                onClick={() => setPublishTarget("channel")}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  publishTarget === "channel"
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[10px]">В канал</p>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {botDetails?.channel?.username || botDetails?.channel?.title || (typeof botDetails?.channel?.id === 'string' && botDetails.channel.id.startsWith('@') ? botDetails.channel.id : null) || selectedBot?.channelUsername || "Канал не настроен"}
                  </p>
                </div>
              </div>
              <div
                onClick={() => setPublishTarget("subscribers")}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  publishTarget === "subscribers"
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[10px]">Подписчикам бота</p>
                  <p className="text-[9px] text-muted-foreground">
                    {selectedBot?.subscriberCount || 0} подписчиков
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestion */}
          <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[10px]">Нужна помощь?</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Используйте AI для генерации контента в вашем стиле
                  </p>
                  <Link href="/dashboard/voicekeeper/generate">
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-[9px]">
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

