"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Construction, X, Sparkles, Bell } from "lucide-react";

interface UnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export function UnderDevelopmentModal({
  isOpen,
  onClose,
  feature,
  description,
}: UnderDevelopmentModalProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      // In real app, send to backend
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
      <Card className="relative z-10 w-full max-w-md animate-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                <Construction className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 blur-xl opacity-40" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold font-display mb-2">В разработке</h2>
          <p className="text-muted-foreground text-sm mb-1">
            <span className="text-foreground font-medium">{feature}</span>
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {description || "Эта функция скоро будет доступна. Мы активно работаем над её реализацией."}
          </p>

          {!subscribed ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-10 rounded-xl bg-white/[0.03] px-3 text-sm shadow-[0_0_0_1px_hsl(var(--primary)/0.05)] focus:outline-none focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.3)]"
                />
                <Button onClick={handleSubscribe} size="sm" className="gap-1">
                  <Bell className="h-3 w-3" />
                  Уведомить
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Получите уведомление, когда функция будет готова
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
              <Sparkles className="h-5 w-5 mx-auto mb-2" />
              <p className="text-sm font-medium">Отлично!</p>
              <p className="text-xs opacity-80">Мы уведомим вас о запуске</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="mt-4 text-muted-foreground"
          >
            Закрыть
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for using the modal
export function useUnderDevelopment() {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState("");
  const [description, setDescription] = useState<string>();

  const showModal = (featureName: string, desc?: string) => {
    setFeature(featureName);
    setDescription(desc);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    feature,
    description,
    showModal,
    closeModal,
    Modal: () => (
      <UnderDevelopmentModal
        isOpen={isOpen}
        onClose={closeModal}
        feature={feature}
        description={description}
      />
    ),
  };
}

