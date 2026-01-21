import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { usersApi } from "@/lib/api";

/**
 * API endpoint для синхронизации OAuth сессии с нашей системой пользователей
 * Вызывается после успешного OAuth входа
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
    
    // Создаем или обновляем пользователя в нашей системе
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
      });
    } catch (error) {
      console.error("Failed to sync user:", error);
      return NextResponse.json(
        { error: "Failed to sync user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

