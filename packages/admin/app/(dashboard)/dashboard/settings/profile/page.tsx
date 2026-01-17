"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  AtSign,
  Calendar,
  Crown,
  Save,
  Camera,
  Loader2,
  Check,
  Globe,
  Building,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telegramUsername: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    timezone: "Europe/Moscow",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        telegramUsername: user.telegramUsername || "",
        bio: "",
        company: "",
        location: "",
        website: "",
        timezone: "Europe/Moscow",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        telegramUsername: formData.telegramUsername,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Профиль</h1>
        <p className="text-muted-foreground">
          Управление данными вашего аккаунта
        </p>
      </div>

      {/* Avatar & Basic Info */}
      <Card className="glass-panel-glow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-3xl font-bold text-white shadow-lg shadow-orange-500/25">
                {formData.firstName?.charAt(0) || <User className="h-10 w-10" />}
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold font-display">
                  {formData.firstName} {formData.lastName}
                </h2>
                <Badge variant="gradient" className="text-xs capitalize">
                  {user?.plan || "Free"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{formData.email}</p>
              {formData.telegramUsername && (
                <p className="text-sm text-muted-foreground">@{formData.telegramUsername}</p>
              )}
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Зарегистрирован: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "Недавно"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="glass-panel-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <User className="h-5 w-5 text-primary" />
            Личные данные
          </CardTitle>
          <CardDescription>
            Основная информация о вашем аккаунте
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Иван"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Иванов"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegramUsername">Telegram username</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telegramUsername"
                value={formData.telegramUsername}
                onChange={(e) => updateField("telegramUsername", e.target.value)}
                placeholder="username"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="glass-panel-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Building className="h-5 w-5 text-primary" />
            Дополнительно
          </CardTitle>
          <CardDescription>
            Опциональная информация для персонализации
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Расскажите немного о себе..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  placeholder="Название компании"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Местоположение</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Город, страна"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Веб-сайт</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Часовой пояс</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => updateField("timezone", e.target.value)}
                  placeholder="Europe/Moscow"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card className="glass-panel-glow bg-gradient-to-br from-orange-500/5 via-transparent to-pink-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold font-display capitalize">Тариф: {user?.plan || "Free"}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === "business" 
                    ? "Безлимитный доступ ко всем функциям"
                    : user?.plan === "pro"
                    ? "50 генераций в месяц"
                    : "3 генерации в месяц"}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Crown className="h-4 w-4" />
              Управление подпиской
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Отмена</Button>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-[140px]">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Сохранено!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Сохранить
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

