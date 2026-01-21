"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, EyeOff, Copy, Loader2, Check } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { BotPostsList } from "./BotPostsList";
import type { Post } from "@/lib/api";

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

interface BotExpandedDetailsProps {
  botId: string;
  token: string;
  botDetails?: BotDetails;
  posts: Post[];
  isLoading: boolean;
  channelInput: string;
  onChannelInputChange: (value: string) => void;
  onSetChannel: () => Promise<void>;
  settingChannel: boolean;
}

export function BotExpandedDetails({
  botId,
  token,
  botDetails,
  posts,
  isLoading,
  channelInput,
  onChannelInputChange,
  onSetChannel,
  settingChannel,
}: BotExpandedDetailsProps) {
  const [showToken, setShowToken] = useState(false);

  // Initialize channel input with current channel if available
  useEffect(() => {
    if (botDetails?.channel?.id) {
      const channelId = botDetails.channel.id;
      const channelValue = typeof channelId === 'string' && channelId.startsWith('@') 
        ? channelId 
        : botDetails.channel.username 
          ? `@${botDetails.channel.username}` 
          : String(channelId);
      
      // Only update if input is empty or different
      if (!channelInput || channelInput !== channelValue) {
        onChannelInputChange(channelValue);
      }
    }
  }, [botDetails?.channel?.id, botDetails?.channel?.username]);

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast({ title: "Токен скопирован" });
  };

  return (
    <div className="space-y-2.5 pt-2 border-t border-white/[0.05]">
      {/* Token Section */}
      <div className="space-y-1">
        <Label className="text-[9px] text-muted-foreground">Токен бота</Label>
        <div className="flex items-center gap-1.5">
          <code className="flex-1 rounded-lg bg-white/[0.03] px-2 py-1.5 font-mono text-[9px]">
            {showToken ? token : "•".repeat(30)}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copyToken}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Channel Settings */}
      <div className="space-y-1">
        <Label className="text-[9px] text-muted-foreground">Канал для публикаций</Label>
        <div className="flex items-center gap-1.5">
          <code className="flex-1 rounded-lg bg-white/[0.03] px-2 py-1.5 font-mono text-[9px]">
            <input
              type="text"
              placeholder="@channel_username или -100123456789"
              value={channelInput}
              onChange={(e) => onChannelInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !settingChannel && channelInput?.trim() && onSetChannel()}
              className="w-full bg-transparent border-0 outline-0 text-[9px] placeholder:text-muted-foreground/50"
            />
          </code>
          <Button
            onClick={onSetChannel}
            disabled={settingChannel || !channelInput?.trim()}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="Сохранить канал"
          >
            {settingChannel ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
          {botDetails?.channel?.id && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                const channelValue = typeof botDetails.channel!.id === 'string' && botDetails.channel!.id.startsWith('@')
                  ? botDetails.channel!.id
                  : botDetails.channel!.username
                    ? `@${botDetails.channel!.username}`
                    : String(botDetails.channel!.id);
                navigator.clipboard.writeText(channelValue);
                toast({ title: "Канал скопирован" });
              }}
              title="Скопировать канал"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
        {botDetails?.channel?.id && (
          <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
            <span className="truncate">
              Текущий канал: <strong>
                {botDetails.channel.title || botDetails.channel.username || String(botDetails.channel.id)}
              </strong>
              {botDetails.channel.membersCount && (
                <span className="ml-1">({botDetails.channel.membersCount.toLocaleString()} подписчиков)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-[9px] text-muted-foreground">Последние посты</Label>
          <Button variant="link" size="sm" className="h-auto p-0 text-[9px]">
            Все посты →
          </Button>
        </div>
        <BotPostsList posts={posts} isLoading={isLoading} />
      </div>
    </div>
  );
}

