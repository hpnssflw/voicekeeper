/**
 * Auth context and provider
 * React context for auth state management
 */

"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usersApi } from "../../../shared/api";
import type { User, Bot, Channel, RegisterData, TelegramAuthData, AuthContextType } from "../model/types";
import {
  loadBotsForUser,
  registerUser,
  loginUser,
  loginWithTelegramUser,
  updateUserData,
  addBotForUser,
  removeBotForUser,
  updateBotForUser,
  addChannelForUser,
  createUserFromOAuth,
} from "./logic";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state only from OAuth session (no localStorage)
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Только если есть OAuth сессия - загружаем пользователя
        if (sessionStatus === "authenticated" && session?.user) {
          const oauthUser = session.user;
          const userId = (oauthUser as any).id || `oauth-${oauthUser.email?.replace(/[^a-zA-Z0-9]/g, "-")}`;
          
          // Создаем пользователя из OAuth данных (независимо от MongoDB)
          const userFromOAuth = createUserFromOAuth(oauthUser);
          
          // Устанавливаем пользователя сразу (не блокируем на MongoDB)
          setUser(userFromOAuth);
          setIsLoading(false);
          
          // Пытаемся синхронизировать с MongoDB в фоне (не блокируем)
          try {
            const syncResponse = await fetch("/api/auth/sync", {
              method: "POST",
            });
            
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              
              // Если синхронизация успешна, обновляем данные пользователя
              if (syncData.synced && syncData.user) {
                const updatedUser: User = {
                  ...userFromOAuth,
                  plan: syncData.user.plan || "free",
                  generationsUsed: syncData.user.generationsUsed || 0,
                  generationsLimit: syncData.user.generationsLimit || 3,
                };
                setUser(updatedUser);
              }
              
              // Пытаемся загрузить данные из MongoDB (опционально)
              try {
                const apiUser = await usersApi.get(userId);
                const user: User = {
                  id: apiUser.userId,
                  email: apiUser.email || oauthUser.email || "",
                  firstName: apiUser.firstName || oauthUser.name?.split(" ")[0] || "",
                  lastName: apiUser.lastName || oauthUser.name?.split(" ").slice(1).join(" ") || "",
                  photoUrl: apiUser.photoUrl || oauthUser.image || undefined,
                  plan: apiUser.plan || "free",
                  generationsUsed: apiUser.generationsUsed || 0,
                  generationsLimit: apiUser.generationsLimit || 3,
                  createdAt: new Date().toISOString(),
                };
                
                setUser(user);
                
                // Загружаем ботов
                const loadedBots = await loadBotsForUser(userId);
                setBots(loadedBots);
                
                if (loadedBots.length > 0 && !selectedBotId) {
                  setSelectedBotId(loadedBots[0].id);
                }
              } catch (error) {
                // MongoDB недоступна - используем данные из OAuth
                console.warn("MongoDB unavailable, using OAuth data:", error);
                // Пытаемся загрузить ботов
                try {
                  const loadedBots = await loadBotsForUser(userId);
                  setBots(loadedBots);
                  if (loadedBots.length > 0 && !selectedBotId) {
                    setSelectedBotId(loadedBots[0].id);
                  }
                } catch (botError) {
                  console.warn("Failed to load bots:", botError);
                }
              }
            }
          } catch (error) {
            // Синхронизация не удалась - продолжаем с OAuth данными
            console.warn("Failed to sync OAuth session (non-blocking):", error);
          }
          return;
        }

        // Если нет OAuth сессии - пользователь не залогинен
        if (sessionStatus === "unauthenticated") {
          setUser(null);
          setBots([]);
          setChannels([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
        setUser(null);
        setIsLoading(false);
      } finally {
        if (sessionStatus !== "loading") {
          setIsLoading(false);
        }
      }
    };

    if (sessionStatus !== "loading") {
      loadAuth();
    }
  }, [sessionStatus, session, selectedBotId]);

  // Persist user to MongoDB via API (no localStorage)
  useEffect(() => {
    if (!isLoading && user) {
      // Save to MongoDB via API
      if (user.id) {
        usersApi.update(user.id, {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          plan: user.plan,
          generationsUsed: user.generationsUsed,
          generationsLimit: user.generationsLimit,
        }).catch(error => {
          console.warn("Failed to save user to API:", error);
        });
      }
    }
  }, [user, isLoading]);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const newUser = await registerUser(data);
      setUser(newUser);
      const loadedBots = await loadBotsForUser(newUser.id);
      setBots(loadedBots);
      if (loadedBots.length > 0 && !selectedBotId) {
        setSelectedBotId(loadedBots[0].id);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      const loadedBots = await loadBotsForUser(loggedInUser.id);
      setBots(loadedBots);
      if (loadedBots.length > 0 && !selectedBotId) {
        setSelectedBotId(loadedBots[0].id);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTelegram = async (telegramData: TelegramAuthData) => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginWithTelegramUser(telegramData);
      setUser(loggedInUser);
      const loadedBots = await loadBotsForUser(loggedInUser.id);
      setBots(loadedBots);
      if (loadedBots.length > 0 && !selectedBotId) {
        setSelectedBotId(loadedBots[0].id);
      }
    } catch (error) {
      console.error("Telegram login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (provider: "google") => {
    // Перенаправляем на страницу авторизации NextAuth
    window.location.href = `/api/auth/signin/${provider}`;
  };

  const logout = async () => {
    // Очищаем локальное состояние
    setUser(null);
    setBots([]);
    setChannels([]);
    setSelectedBotId(null);
    
    // Выходим из OAuth сессии NextAuth
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.warn("Failed to sign out from OAuth:", error);
      // Даже если signOut не сработал, очищаем состояние
      setUser(null);
      setBots([]);
      setChannels([]);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      // Удаляем профиль из MongoDB
      await usersApi.delete(user.id);
      
      // Очищаем локальные данные и выходим из OAuth (logout уже делает signOut)
      await logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
      // Даже если удаление из MongoDB не удалось, очищаем локальные данные и выходим
      await logout();
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updated = await updateUserData(user.id, data);
      setUser(updated);
    } catch (error) {
      console.error("Failed to update user:", error);
      // Still update local state for UI responsiveness
      setUser({ ...user, ...data });
    }
  };

  const addBot = async (token: string): Promise<Bot> => {
    if (!user) throw new Error("User not logged in");
    
    try {
      const newBot = await addBotForUser(token, user.id, bots);
      setBots((prev) => [...prev, newBot]);
      
      if (!selectedBotId) {
        setSelectedBotId(newBot.id);
      }
      
      return newBot;
    } catch (error: any) {
      // If backend is not available, fallback to local-only mode
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        console.warn("Backend not available, using local-only mode");
        
        const newBot: Bot = {
          id: "bot-" + Date.now(),
          name: "My Bot (offline)",
          username: "@bot_" + Date.now().toString().slice(-6),
          token,
          isActive: true,
          subscriberCount: 0,
          postsCount: 0,
        };

        setBots((prev) => [...prev, newBot]);
        
        if (!selectedBotId) {
          setSelectedBotId(newBot.id);
        }

        return newBot;
      }
      
      throw error;
    }
  };

  const removeBot = async (botId: string) => {
    try {
      await removeBotForUser(botId);
    } catch (error) {
      console.error("Failed to delete bot from API:", error);
    }
    
    // Update local state
    setBots((prev) => prev.filter((b) => b.id !== botId));
    
    if (selectedBotId === botId) {
      const remaining = bots.filter((b) => b.id !== botId);
      setSelectedBotId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateBot = async (botId: string, data: Partial<Bot>) => {
    try {
      await updateBotForUser(botId, data);
      
      // Update local state
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
      );
    } catch (error) {
      console.error("Failed to update bot:", error);
      // Still update local state for UI responsiveness
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
      );
    }
  };

  const selectBot = (botId: string) => {
    setSelectedBotId(botId);
  };

  const addChannel = async (username: string): Promise<Channel> => {
    const newChannel = await addChannelForUser(username, selectedBotId, bots, channels);
    setChannels((prev) => [...prev, newChannel]);
    return newChannel;
  };

  const removeChannel = (channelId: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        bots,
        channels,
        selectedBotId,
        register,
        login,
        loginWithTelegram,
        loginWithOAuth,
        logout,
        deleteAccount,
        updateUser,
        addBot,
        removeBot,
        updateBot,
        selectBot,
        addChannel,
        removeChannel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

