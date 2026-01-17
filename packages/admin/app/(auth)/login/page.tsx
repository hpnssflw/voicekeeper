"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded, login, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [authLoading, isAuthenticated, isOnboarded, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }
    
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      // Redirect handled in useEffect
    } catch (error) {
      setErrors({ email: "Неверный email или пароль" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-mesh">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="relative w-20 h-20">
            <Image
              src="/lips.png"
              alt="VoiceKeeper"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              priority
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display">
          <span className="gradient-text">VoiceKeeper</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">AI-контент в вашем стиле</p>
      </div>

      <Card className="w-full max-w-md glass-panel-glow">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold font-display">Вход в аккаунт</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Введите данные для входа
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button 
              type="submit"
              className="w-full gap-2" 
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <button 
                onClick={() => router.push("/onboarding")} 
                className="text-primary hover:underline font-medium"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back to landing */}
      <p className="mt-6 text-sm text-muted-foreground">
        <button 
          onClick={() => router.push("/landing")} 
          className="hover:text-foreground transition-colors"
        >
          ← Вернуться на главную
        </button>
      </p>
    </div>
  );
}
