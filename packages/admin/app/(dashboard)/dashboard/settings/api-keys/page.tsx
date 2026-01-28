"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { getApiKey, setApiKey, getAiProvider, setAiProvider, testApiKey } from "@/lib/ai";
import { useAuth } from "@/lib/auth";
import {
  Eye,
  EyeOff,
  Save,
  Check,
  Sparkles,
  Zap,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function ApiKeysPage() {
  const { user } = useAuth();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  const [provider, setProvider] = useState<"gemini" | "openai">("gemini");
  
  const [keys, setKeys] = useState({
    geminiKey: "",
    openaiKey: "",
  });

  // Load saved keys on mount
  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      try {
        const geminiKey = await getApiKey("gemini", user.id);
        const openaiKey = await getApiKey("openai", user.id);
        const currentProvider = await getAiProvider(user.id);
        setKeys({
          geminiKey: geminiKey || "",
          openaiKey: openaiKey || "",
        });
        setProvider(currentProvider);
      } catch (error) {
        console.error("Failed to load API keys:", error);
      }
    };
    loadData();
  }, [user?.id]);

  const handleSave = async (keyType: "gemini" | "openai") => {
    if (!user?.id) return;
    const key = keyType === "gemini" ? keys.geminiKey : keys.openaiKey;
    try {
      await setApiKey(keyType, key, user.id);
      toast({ title: "Ключ сохранён", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка сохранения", 
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive" 
      });
    }
  };

  const handleProviderChange = async (newProvider: "gemini" | "openai") => {
    if (!user?.id) return;
    try {
      setProvider(newProvider);
      await setAiProvider(newProvider, user.id);
      toast({ title: "Провайдер изменён", variant: "success" });
    } catch (error) {
      toast({ 
        title: "Ошибка сохранения", 
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive" 
      });
    }
  };

  const handleTest = async (keyType: "gemini" | "openai") => {
    const key = keyType === "gemini" ? keys.geminiKey : keys.openaiKey;
    if (!key) {
      toast({ title: "Введите ключ", variant: "destructive" });
      return;
    }

    setIsTesting({ ...isTesting, [keyType]: true });
    
    try {
      const isValid = await testApiKey(keyType, key);
      if (isValid) {
        toast({ title: "API работает!", variant: "success" });
      } else {
        toast({ title: "Ключ невалидный", variant: "destructive" });
      }
    } catch {
      toast({ title: "Ошибка проверки", variant: "destructive" });
    } finally {
      setIsTesting({ ...isTesting, [keyType]: false });
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h1 className="text-lg font-bold font-display">API Ключи</h1>
        <p className="text-xs text-muted-foreground">Ключи сохраняются локально в браузере</p>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleProviderChange("gemini")}
          className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all ${
            provider === "gemini"
              ? "bg-orange-500/10 ring-1 ring-orange-500/30"
              : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
          }`}
        >
          <Sparkles className={`h-4 w-4 ${provider === "gemini" ? "text-orange-400" : "text-muted-foreground"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium">Gemini</p>
            <p className="text-[10px] text-muted-foreground">Рекомендуется</p>
          </div>
          {provider === "gemini" && <Check className="h-3 w-3 text-orange-400" />}
        </button>
        <button
          onClick={() => handleProviderChange("openai")}
          className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all ${
            provider === "openai"
              ? "bg-orange-500/10 ring-1 ring-orange-500/30"
              : "bg-[hsl(15,12%,8%)] hover:bg-[hsl(15,12%,10%)]"
          }`}
        >
          <Zap className={`h-4 w-4 ${provider === "openai" ? "text-orange-400" : "text-muted-foreground"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium">OpenAI</p>
            <p className="text-[10px] text-muted-foreground">GPT-4o</p>
          </div>
          {provider === "openai" && <Check className="h-3 w-3 text-orange-400" />}
        </button>
      </div>

      {/* Gemini */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium">Gemini API</span>
              {keys.geminiKey && <Badge variant="success" className="text-[9px] px-1.5">✓</Badge>}
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              Получить <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKeys.gemini ? "text" : "password"}
                value={keys.geminiKey}
                onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                placeholder="AIza..."
                className="h-8 text-xs font-mono pr-8"
              />
              <button
                onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKeys.gemini ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-2"
              onClick={() => handleTest("gemini")}
              disabled={isTesting.gemini}
            >
              {isTesting.gemini ? <Loader2 className="h-3 w-3 animate-spin" /> : "Тест"}
            </Button>
            <Button 
              size="sm" 
              className="h-8 px-2"
              onClick={() => handleSave("gemini")}
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-[10px] text-emerald-400/80">
            💡 <code 
              className="bg-emerald-500/10 px-1 rounded cursor-pointer hover:bg-emerald-500/20" 
              onClick={() => setKeys({ ...keys, geminiKey: "AIzaSyD0dgcfnSg9h96u9rSUQ8POMXAShxwWqUs" })}
            >Тестовый ключ (клик)</code>
          </p>
        </div>
      </Card>

      {/* OpenAI */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">OpenAI API</span>
              {keys.openaiKey ? (
                <Badge variant="success" className="text-[9px] px-1.5">✓</Badge>
              ) : (
                <Badge variant="secondary" className="text-[9px] px-1.5">Опц.</Badge>
              )}
            </div>
            <a href="https://platform.openai.com/api-keys" target="_blank" className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              Получить <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKeys.openai ? "text" : "password"}
                value={keys.openaiKey}
                onChange={(e) => setKeys({ ...keys, openaiKey: e.target.value })}
                placeholder="sk-..."
                className="h-8 text-xs font-mono pr-8"
              />
              <button
                onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKeys.openai ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-2"
              onClick={() => handleTest("openai")}
              disabled={isTesting.openai || !keys.openaiKey}
            >
              {isTesting.openai ? <Loader2 className="h-3 w-3 animate-spin" /> : "Тест"}
            </Button>
            <Button 
              size="sm" 
              className="h-8 px-2"
              onClick={() => handleSave("openai")}
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Info */}
      <p className="text-[10px] text-muted-foreground text-center">
        Ключи хранятся только в вашем браузере и не отправляются на сервер
      </p>
    </div>
  );
}
