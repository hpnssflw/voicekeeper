import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { usersApi } from "@/lib/api";

/**
 * API endpoint для синхронизации OAuth сессии с нашей системой пользователей
 * Вызывается после успешного OAuth входа
 * 
 * Упрощенная версия: не блокирует вход, если MongoDB недоступна
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { user } = session;
    const userId = (user as any).id || `oauth-${user.email?.replace(/[^a-zA-Z0-9]/g, "-")}`;
    
    // Пытаемся синхронизировать с MongoDB, но не блокируем, если не получилось
    try {
      // Проверяем, существует ли пользователь
      let existingUser;
      try {
        existingUser = await usersApi.get(userId);
      } catch {
        // Пользователь не существует, создадим нового
      }

      const provider = (user as any).provider || "oauth";
      
      await usersApi.update(userId, {
        email: user.email || "",
        firstName: (user.name?.split(" ")[0]) || user.email?.split("@")[0] || "User",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        photoUrl: user.image || undefined,
        plan: existingUser?.plan || "free",
        generationsUsed: existingUser?.generationsUsed || 0,
        generationsLimit: existingUser?.generationsLimit || 3,
        isOnboarded: existingUser?.isOnboarded || false,
      });

      return NextResponse.json({
        success: true,
        userId,
        isOnboarded: existingUser?.isOnboarded || false,
        synced: true,
      });
    } catch (error) {
      // MongoDB недоступна или произошла ошибка - не блокируем вход
      // Возвращаем успех с данными из OAuth сессии
      console.warn("Failed to sync user to MongoDB (non-blocking):", error instanceof Error ? error.message : "Unknown error");
      
      return NextResponse.json({
        success: true,
        userId,
        isOnboarded: false,
        synced: false,
        // Возвращаем данные из OAuth сессии
        user: {
          email: user.email || "",
          firstName: (user.name?.split(" ")[0]) || user.email?.split("@")[0] || "User",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          photoUrl: user.image || undefined,
          plan: "free",
          generationsUsed: 0,
          generationsLimit: 3,
        }
      });
    }
  } catch (error) {
    console.error("Sync error:", error);
    // Даже при критической ошибке возвращаем успех, чтобы не блокировать вход
    return NextResponse.json(
      { 
        success: true,
        synced: false,
        error: "Sync failed but login successful"
      },
      { status: 200 }
    );
  }
}

