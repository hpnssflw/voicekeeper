"use client";

import { Button, Card, CardContent } from "@/ui";
import { useAuth } from "@/features/auth";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
        router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleOAuthLogin = async (provider: "google") => {
    setIsOAuthLoading(provider);
    setErrors({});
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error(`OAuth login failed for ${provider}:`, error);
      setErrors({ email: `Ошибка входа через Google` });
      setIsOAuthLoading(null);
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
              Войдите через один из провайдеров
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthLogin("google")}
              disabled={isOAuthLoading !== null}
            >
              {isOAuthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Войти через Google
            </Button>

          </div>

          {errors.email && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-xs text-destructive text-center">{errors.email}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              При входе вы соглашаетесь с условиями использования
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
