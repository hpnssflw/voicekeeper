"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth";
import { channelsApi, mtprotoApi, type ChannelInfoResponse, type ParsedPost, type ChannelAnalytics } from "@/lib/api";
import {
  Radio,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Clock,
  RefreshCw,
  Loader2,
  TrendingUp,
  FileText,
  Info,
  CheckCircle2,
  XCircle,
  Bot,
  Phone,
  Key,
  LogOut,
  Eye,
  BarChart3,
  Hash,
  Calendar,
  Zap,
} from "lucide-react";

interface ChannelDetails extends ChannelInfoResponse {
  isLoading?: boolean;
}

export default function ChannelsPage() {
  const { channels, addChannel, removeChannel, bots, selectedBotId, user } = useAuth();
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelUsername, setNewChannelUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channelDetails, setChannelDetails] = useState<Record<string, ChannelDetails>>({});
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [checkingChannel, setCheckingChannel] = useState<string | null>(null);
  
  // MTProto state
  const [mtprotoConfigured, setMtprotoConfigured] = useState(false);
  const [mtprotoSession, setMtprotoSession] = useState<{ authenticated: boolean; user?: any }>({ authenticated: false });
  const [showMtprotoAuth, setShowMtprotoAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [password, setPassword] = useState("");
  const [authStep, setAuthStep] = useState<'phone' | 'code' | '2fa'>('phone');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Parsing state
  const [parsingChannel, setParsingChannel] = useState<string | null>(null);
  const [parsedPosts, setParsedPosts] = useState<Record<string, ParsedPost[]>>({});
  const [channelAnalytics, setChannelAnalytics] = useState<Record<number, ChannelAnalytics>>({});
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const selectedBot = bots.find(b => b.id === selectedBotId);

  // Check MTProto status on mount
  useEffect(() => {
    const checkMtproto = async () => {
      try {
        const status = await mtprotoApi.getStatus();
        setMtprotoConfigured(status.configured);
        
        if (status.configured && user?.id) {
          const session = await mtprotoApi.getSession(user.id);
          setMtprotoSession(session);
        }
      } catch (error) {
        console.warn("Could not check MTProto status:", error);
      }
    };
    
    checkMtproto();
  }, [user?.id]);

  const handleAddChannel = async () => {
    if (!newChannelUsername.trim()) {
      toast({ title: "Ошибка", description: "Введите username канала", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      await addChannel(newChannelUsername);
      setNewChannelUsername("");
      setIsAddingChannel(false);
      toast({ title: "Канал добавлен", description: "Теперь можно запустить парсинг", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить канал",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    removeChannel(channelId);
    toast({ title: "Канал удален", variant: "success" });
  };

  // MTProto Authentication
  const handleStartAuth = async () => {
    if (!phoneNumber.trim()) {
      toast({ title: "Ошибка", description: "Введите номер телефона", variant: "destructive" });
      return;
    }

    setAuthLoading(true);
    try {
      const result = await mtprotoApi.startAuth(user!.id, phoneNumber);
      setPhoneCodeHash(result.phoneCodeHash);
      setAuthStep('code');
      toast({ title: "Код отправлен", description: "Проверьте Telegram", variant: "success" });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCompleteAuth = async () => {
    if (!phoneCode.trim()) {
      toast({ title: "Ошибка", description: "Введите код", variant: "destructive" });
      return;
    }

    setAuthLoading(true);
    try {
      const result = await mtprotoApi.completeAuth({
        ownerId: user!.id,
        phoneNumber,
        phoneCodeHash,
        phoneCode,
        password: authStep === '2fa' ? password : undefined,
      });
      
      if (result.success) {
        setMtprotoSession({ authenticated: true, user: result.user });
        setShowMtprotoAuth(false);
        setAuthStep('phone');
        setPhoneNumber("");
        setPhoneCode("");
        setPassword("");
        toast({ title: "Успешно!", description: "MTProto сессия активирована", variant: "success" });
      }
    } catch (error: any) {
      if (error.message?.includes('2FA') || error.error === '2FA_REQUIRED') {
        setAuthStep('2fa');
        toast({ title: "Требуется 2FA", description: "Введите пароль двухфакторной аутентификации", variant: "warning" });
      } else {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await mtprotoApi.logout(user!.id);
      setMtprotoSession({ authenticated: false });
      toast({ title: "Сессия завершена", variant: "success" });
    } catch (error) {
      console.warn("Logout error:", error);
    }
  };

  // Parse channel
  const handleParseChannel = async (channelUsername: string) => {
    if (!mtprotoSession.authenticated) {
      toast({ title: "Ошибка", description: "Сначала авторизуйтесь через MTProto", variant: "destructive" });
      return;
    }

    setParsingChannel(channelUsername);
    try {
      const result = await mtprotoApi.parseChannel({
        ownerId: user!.id,
        channelUsername,
        limit: 50,
      });
      
      setParsedPosts(prev => ({ ...prev, [channelUsername]: result.posts }));
      setExpandedChannel(channelUsername);
      
      toast({ 
        title: "Парсинг завершен", 
        description: `Получено ${result.posts.length} постов`,
        variant: "success" 
      });
    } catch (error: any) {
      toast({ title: "Ошибка парсинга", description: error.message, variant: "destructive" });
    } finally {
      setParsingChannel(null);
    }
  };

  const checkChannelAccess = async (channelUsername: string) => {
    if (!selectedBotId) {
      toast({ title: "Ошибка", description: "Сначала выберите бота", variant: "destructive" });
      return;
    }

    setCheckingChannel(channelUsername);
    
    try {
      const response = await channelsApi.getInfo({
        channelId: channelUsername,
        botId: selectedBotId,
      });
      
      setChannelDetails(prev => ({
        ...prev,
        [channelUsername]: response,
      }));
      
      toast({ 
        title: "Информация получена", 
        description: `${response.channel.title || channelUsername}: ${response.channel.membersCount} подписчиков`,
        variant: "success" 
      });
    } catch (error) {
      toast({ 
        title: "Ошибка доступа", 
        description: error instanceof Error ? error.message : "Не удалось получить информацию о канале",
        variant: "destructive" 
      });
    } finally {
      setCheckingChannel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Парсинг каналов</h1>
          <p className="text-muted-foreground">
            Анализируйте контент каналов с помощью MTProto API
          </p>
        </div>
        <Button onClick={() => setIsAddingChannel(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить канал
        </Button>
      </div>

      {/* MTProto Status Card */}
      <Card className={mtprotoConfigured ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Zap className={`h-5 w-5 mt-0.5 ${mtprotoConfigured ? "text-emerald-400" : "text-amber-400"}`} />
              <div>
                <p className="font-medium">
                  {mtprotoConfigured ? "MTProto API активен" : "MTProto не настроен"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mtprotoConfigured 
                    ? mtprotoSession.authenticated 
                      ? `Авторизован как ${mtprotoSession.user?.firstName || mtprotoSession.user?.username || 'User'}`
                      : "Требуется авторизация через номер телефона"
                    : "Установите TELEGRAM_API_ID и TELEGRAM_API_HASH на сервере"
                  }
                </p>
                {mtprotoConfigured && !mtprotoSession.authenticated && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 mt-2"
                    onClick={() => setShowMtprotoAuth(true)}
                  >
                    Авторизоваться →
                  </Button>
                )}
              </div>
            </div>
            {mtprotoSession.authenticated && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MTProto Auth Modal */}
      {showMtprotoAuth && (
        <Card className="bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              Авторизация MTProto
            </CardTitle>
            <CardDescription>
              Войдите через номер телефона для доступа к парсингу
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authStep === 'phone' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Номер телефона</Label>
                  <Input
                    placeholder="+7 999 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleStartAuth} disabled={authLoading}>
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Получить код
                  </Button>
                  <Button variant="ghost" onClick={() => setShowMtprotoAuth(false)}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {authStep === 'code' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Код из Telegram</Label>
                  <Input
                    placeholder="12345"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCompleteAuth} disabled={authLoading}>
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Подтвердить
                  </Button>
                  <Button variant="ghost" onClick={() => { setAuthStep('phone'); setPhoneCode(""); }}>
                    Назад
                  </Button>
                </div>
              </div>
            )}

            {authStep === '2fa' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Пароль 2FA</Label>
                  <Input
                    type="password"
                    placeholder="Пароль двухфакторной аутентификации"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Key className="h-4 w-4" />}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCompleteAuth} disabled={authLoading}>
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Войти
                  </Button>
                  <Button variant="ghost" onClick={() => { setAuthStep('phone'); setPassword(""); }}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-white/[0.03] p-4 text-sm text-muted-foreground">
              <p>⚠️ Используйте свой личный аккаунт Telegram для парсинга. Не делитесь сессией с другими.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Channel Form */}
      {isAddingChannel && (
        <Card className="bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
          <CardHeader>
            <CardTitle className="text-lg">Добавить канал для парсинга</CardTitle>
            <CardDescription>
              Укажите username публичного Telegram-канала
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel-username">Username канала</Label>
              <div className="flex gap-2">
                <Input
                  id="channel-username"
                  placeholder="@channel_name"
                  value={newChannelUsername}
                  onChange={(e) => setNewChannelUsername(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleAddChannel} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Добавить"}
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingChannel(false)} disabled={isLoading}>
                  Отмена
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Что даёт MTProto парсинг:
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Полная история сообщений
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Статистика просмотров и реакций
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Анализ хештегов и трендов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Медиа-контент (фото, видео)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channels Grid */}
      {channels.length === 0 && !isAddingChannel ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium font-display mb-2">Нет каналов для парсинга</h3>
            <p className="text-muted-foreground mb-4">
              Добавьте каналы для анализа их контента
            </p>
            <Button onClick={() => setIsAddingChannel(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить первый канал
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {channels.map((channel) => {
            const details = channelDetails[channel.username];
            const isChecking = checkingChannel === channel.username;
            const isParsing = parsingChannel === channel.username;
            const posts = parsedPosts[channel.username] || [];
            const isExpanded = expandedChannel === channel.username;
            
            return (
              <Card key={channel.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 shadow-lg">
                        <Radio className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {details?.channel?.title || channel.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {channel.username}
                          <a
                            href={`https://t.me/${channel.username.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleParseChannel(channel.username)}
                        disabled={!mtprotoSession.authenticated || isParsing}
                        className="gap-1"
                      >
                        {isParsing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Парсить
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteChannel(channel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {details?.channel?.membersCount?.toLocaleString() || 
                         channel.memberCount?.toLocaleString() || 
                         "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{posts.length} постов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.lastParsed ? "Недавно" : "Не парсился"}</span>
                    </div>
                  </div>

                  {/* Parsed Posts Preview */}
                  {posts.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Последние посты</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setExpandedChannel(isExpanded ? null : channel.username)}
                        >
                          {isExpanded ? "Свернуть" : "Показать все"}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {(isExpanded ? posts : posts.slice(0, 3)).map((post) => (
                          <div
                            key={post.messageId}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-clamp-2">
                                {post.text || <span className="text-muted-foreground">[Медиа]</span>}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.date).toLocaleDateString('ru-RU')}
                                </span>
                                {post.views && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {post.views.toLocaleString()}
                                  </span>
                                )}
                                {post.hasHashtags && (
                                  <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {post.hashtags.length}
                                  </span>
                                )}
                              </div>
                            </div>
                            {post.hasMedia && (
                              <Badge variant="secondary" className="shrink-0">
                                {post.mediaType || 'Media'}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

