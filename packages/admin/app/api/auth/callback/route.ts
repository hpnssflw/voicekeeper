import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Этот файл не используется напрямую, NextAuth обрабатывает callback автоматически
// Но оставляем для возможных кастомных обработок
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  // NextAuth уже обработал callback, просто редиректим
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

