"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bot, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { BotStats } from "./BotStats";
import { BotExpandedDetails } from "./BotExpandedDetails";
import type { Post } from "@/lib/api";

interface BotData {
  id: string;
  name: string;
  username: string;
  token: string;
  telegramId?: number;
  isActive: boolean;
  subscriberCount: number;
  postsCount: number;
  channelId?: string | number;
  channelUsername?: string;
  channelTitle?: string;
}

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

interface BotCardProps {
  bot: BotData;
  isExpanded: boolean;
  botDetails?: BotDetails;
  posts: Post[];
  isLoading: boolean;
  channelInput: string;
  settingChannel: boolean;
  onToggleExpanded: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onChannelInputChange: (value: string) => void;
  onSetChannel: () => Promise<void>;
}

export function BotCard({
  bot,
  isExpanded,
  botDetails,
  posts,
  isLoading,
  channelInput,
  settingChannel,
  onToggleExpanded,
  onToggleStatus,
  onDelete,
  onChannelInputChange,
  onSetChannel,
}: BotCardProps) {
  const getColor = () => "from-orange-500 to-pink-500";

  return (
    <Card className={`${!bot.isActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-1.5 p-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${
                bot.isActive ? getColor() : "from-muted to-muted"
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <CardTitle className="text-[11px] flex items-center gap-1.5 leading-tight">
                {bot.name}
                {bot.telegramId && (
                  <Badge variant="outline" className="text-[8px] font-mono px-1 py-0">
                    ID: {bot.telegramId}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-0.5 text-[9px] leading-tight">
                {bot.username}
                <a
                  href={`https://t.me/${bot.username.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Switch
              checked={bot.isActive}
              onCheckedChange={onToggleStatus}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggleExpanded}
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 p-2">
        <BotStats
          subscriberCount={bot.subscriberCount}
          postsCount={bot.postsCount}
          onDelete={onDelete}
        />

        {isExpanded && (
          <BotExpandedDetails
            botId={bot.id}
            token={bot.token}
            botDetails={botDetails}
            posts={posts}
            isLoading={isLoading}
            channelInput={channelInput}
            onChannelInputChange={onChannelInputChange}
            onSetChannel={onSetChannel}
            settingChannel={settingChannel}
          />
        )}
      </CardContent>
    </Card>
  );
}

