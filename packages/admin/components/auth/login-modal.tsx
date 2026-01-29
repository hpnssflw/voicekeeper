"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@/ui";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleOAuthLogin = async (provider: "google" | "yandex") => {
    setIsOAuthLoading(provider);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(`OAuth login failed for ${provider}:`, error);
      setErrors({ email: `Ошибка входа через ${provider === "google" ? "Google" : "Яндекс"}` });
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-sm animate-in glass-panel-glow">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="relative w-16 h-16">
                <Image
                  src="/lips.png"
                  alt="VoiceKeeper"
                  fill
                  className="object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold font-display">
              Войти в <span className="gradient-text">VoiceKeeper</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Войдите через один из провайдеров
            </p>
          </div>

          <div className="space-y-3">
            {/* OAuth Buttons */}
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

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthLogin("yandex")}
              disabled={isOAuthLoading !== null}
            >
              {isOAuthLoading === "yandex" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.894c-1.302 0-2.376-.436-3.23-1.302l-1.302-1.302c-.436-.436-.872-.654-1.302-.654-.436 0-.872.218-1.302.654l-1.302 1.302c-.854.866-1.928 1.302-3.23 1.302s-2.376-.436-3.23-1.302c-.866-.854-1.302-1.928-1.302-3.23s.436-2.376 1.302-3.23c.854-.866 1.928-1.302 3.23-1.302s2.376.436 3.23 1.302l1.302 1.302c.436.436.872.654 1.302.654.436 0 .872-.218 1.302-.654l1.302-1.302c.854-.866 1.928-1.302 3.23-1.302s2.376.436 3.23 1.302c.866.854 1.302 1.928 1.302 3.23s-.436 2.376-1.302 3.23c-.854.866-1.928 1.302-3.23 1.302z"/>
                </svg>
              )}
              Войти через Яндекс
            </Button>

            {errors.email && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-xs text-destructive text-center">{errors.email}</p>
              </div>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              При входе вы соглашаетесь с условиями использования
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
