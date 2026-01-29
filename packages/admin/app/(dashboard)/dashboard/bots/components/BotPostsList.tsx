"use client";

import { MessageSquare, Calendar, Clock, CheckCircle2, FileText } from "lucide-react";
import { Badge, Button } from "@/ui";
import { Loader2 } from "lucide-react";
import type { Post } from "@/shared/api";

interface BotPostsListProps {
  posts: Post[];
  isLoading?: boolean;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Опубликован</Badge>;
    case 'scheduled':
      return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />Запланирован</Badge>;
    default:
      return <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" />Черновик</Badge>;
  }
}

export function BotPostsList({ posts, isLoading }: BotPostsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-3 text-muted-foreground">
        <MessageSquare className="h-5 w-5 mx-auto mb-1.5 opacity-50" />
        <p className="text-[10px]">Нет постов</p>
        <Button variant="link" size="sm" className="mt-1.5 h-auto p-0 text-[9px]">
          Создать первый пост
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {posts.slice(0, 5).map((post) => (
        <div
          key={post._id}
          className="flex items-center justify-between rounded-lg bg-white/[0.02] p-2"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-[10px] leading-tight">
              {post.title || post.content?.substring(0, 50) || 'Без заголовка'}
            </p>
            <p className="text-[9px] text-muted-foreground flex items-center gap-1 leading-tight">
              <Calendar className="h-2.5 w-2.5" />
              {new Date(post.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {getStatusBadge(post.status)}
          </div>  
        </div>
      ))}
    </div>
  );
}

