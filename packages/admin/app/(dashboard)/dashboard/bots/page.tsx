"use client";

import { toast } from "@/components/ui/toaster";
import { PageHeader } from "@/components/widgets";
import { botsApi, postsApi, type Post } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { AddBotForm, BotCard, EmptyBotState } from "./components";

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

export default function BotsPage() {
  const { bots, addBot, removeBot, updateBot } = useAuth();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [showToken, setShowToken] = useState<Record<string, boolean>>({});
  const [expandedBots, setExpandedBots] = useState<Set<string>>(new Set());
  const [botDetails, setBotDetails] = useState<Record<string, BotDetails>>({});
  const [botPosts, setBotPosts] = useState<Record<string, Post[]>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [channelInput, setChannelInput] = useState<Record<string, string>>({});
  const [settingChannel, setSettingChannel] = useState<Record<string, boolean>>({});

  // Load details for all bots on mount and when bots change - cards are expanded by default
  useEffect(() => {
    const botIds = bots.map(b => b.id);
    const newExpandedBots = new Set(botIds);
    setExpandedBots(newExpandedBots);
    
    // Load details for all bots
    botIds.forEach(botId => {
      if (!loadingDetails[botId] && !botDetails[botId]) {
        loadBotDetails(botId);
      }
    });
  }, [bots.length]); // Load when bots count changes

  const handleAddBot = async (token: string) => {
    await addBot(token);
  };

  const toggleBotStatus = async (botId: string, isActive: boolean) => {
    updateBot(botId, { isActive: !isActive });
    
    try {
      await botsApi.update(botId, { isActive: !isActive });
    } catch (error) {
      console.warn("Could not update bot status on server:", error);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    removeBot(botId);
    
    try {
      await botsApi.delete(botId);
    } catch (error) {
      console.warn("Could not delete bot on server:", error);
    }
    
    toast({ title: "Бот удален", variant: "success" });
  };

  const loadBotDetails = async (botId: string) => {
    if (loadingDetails[botId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [botId]: true }));
    
    try {
      // Load bot details from API
      const details = await botsApi.get(botId);
      setBotDetails(prev => ({ ...prev, [botId]: details }));
      
      // Load posts for this bot
      const postsResponse = await postsApi.list({ botId, limit: 10 });
      setBotPosts(prev => ({ ...prev, [botId]: postsResponse.data || [] }));
    } catch (error) {
      console.warn("Could not load bot details:", error);
      // Use local data as fallback
      const localBot = bots.find(b => b.id === botId);
      if (localBot) {
        setBotDetails(prev => ({
          ...prev,
          [botId]: {
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
            stats: {
              postsCount: localBot.postsCount,
              publishedCount: 0,
            },
          },
        }));
      }
    } finally {
      setLoadingDetails(prev => ({ ...prev, [botId]: false }));
    }
  };

  const toggleExpanded = (botId: string) => {
    setExpandedBots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(botId)) {
        newSet.delete(botId);
      } else {
        newSet.add(botId);
        loadBotDetails(botId);
      }
      return newSet;
    });
  };

  const handleSetChannel = async (botId: string) => {
    const channelId = channelInput[botId];
    if (!channelId?.trim()) return;
    
    setSettingChannel(prev => ({ ...prev, [botId]: true }));
    
    try {
      const response = await botsApi.update(botId, { channelId });
      
      // Update local state from response.channel
      if (response.channel) {
        updateBot(botId, {
          channelId: response.channel.id,
          channelUsername: response.channel.username,
          channelTitle: response.channel.title,
        });
      }
      
      // Refresh details
      await loadBotDetails(botId);
      
      setChannelInput(prev => ({ ...prev, [botId]: '' }));
      toast({ title: "Канал настроен", variant: "success" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось настроить канал",
        variant: "destructive",
      });
    } finally {
      setSettingChannel(prev => ({ ...prev, [botId]: false }));
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <PageHeader
        title="Управление ботами"
        description="Добавляйте и настраивайте Telegram-ботов для ваших каналов"
      />

      {/* Add Bot Form */}
      {isAddingBot && (
        <AddBotForm
          onSuccess={() => setIsAddingBot(false)}
          onCancel={() => setIsAddingBot(false)}
          addBot={handleAddBot}
        />
      )}

      {/* Bots Grid */}
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Add Bot Card */}
        {!isAddingBot && (
          <EmptyBotState onAddBot={() => setIsAddingBot(true)} />
        )}

        {/* Bot Cards */}
        {bots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={{
              id: bot.id,
              name: bot.name,
              username: bot.username,
              token: bot.token,
              telegramId: bot.telegramId,
              isActive: bot.isActive,
              subscriberCount: bot.subscriberCount,
              postsCount: bot.postsCount,
              channelId: bot.channelId ? String(bot.channelId) : undefined,
              channelUsername: bot.channelUsername,
              channelTitle: bot.channelTitle,
            }}
            isExpanded={expandedBots.has(bot.id)}
            botDetails={botDetails[bot.id]}
            posts={botPosts[bot.id] || []}
            isLoading={loadingDetails[bot.id] || false}
            channelInput={channelInput[bot.id] || ''}
            settingChannel={settingChannel[bot.id] || false}
            onToggleExpanded={() => toggleExpanded(bot.id)}
            onToggleStatus={() => toggleBotStatus(bot.id, bot.isActive)}
            onDelete={() => handleDeleteBot(bot.id)}
            onChannelInputChange={(value) => setChannelInput(prev => ({ ...prev, [bot.id]: value }))}
            onSetChannel={() => handleSetChannel(bot.id)}
          />
        ))}
      </div>
    </div>
  );
}
