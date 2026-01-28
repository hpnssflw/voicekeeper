import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Кастомный провайдер для Яндекс OAuth
const YandexProvider = {
  id: "yandex",
  name: "Yandex",
  type: "oauth",
  authorization: {
    url: "https://oauth.yandex.ru/authorize",
    params: {
      response_type: "code",
    },
  },
  token: {
    url: "https://oauth.yandex.ru/token",
    async request(context: any) {
      const tokens = await fetch("https://oauth.yandex.ru/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: context.params.code,
          client_id: process.env.YANDEX_CLIENT_ID!,
          client_secret: process.env.YANDEX_CLIENT_SECRET!,
        }),
      }).then((res) => res.json());

      return { tokens };
    },
  },
  userinfo: {
    url: "https://login.yandex.ru/info",
    async request(context: any) {
      const userInfo = await fetch("https://login.yandex.ru/info", {
        headers: {
          Authorization: `OAuth ${context.tokens.access_token}`,
        },
      }).then((res) => res.json());

      return {
        id: userInfo.id,
        email: userInfo.default_email || userInfo.emails?.[0],
        name: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() || userInfo.login,
        image: userInfo.default_avatar_id
          ? `https://avatars.yandex.net/get-yapic/${userInfo.default_avatar_id}/islands-200`
          : null,
      };
    },
  },
  clientId: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  profile(profile: any) {
    return {
      id: profile.id,
      email: profile.default_email || profile.emails?.[0],
      name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.login,
      image: profile.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
        : null,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Разрешаем вход для всех пользователей
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Сохраняем данные пользователя в токен
      if (user) {
        token.id = user.id || user.email?.split("@")[0] || `user-${Date.now()}`;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем данные в сессию
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // После успешного OAuth входа перенаправляем на dashboard
      // Если url начинается с /, это относительный путь - используем его
      if (url.startsWith("/")) {
        // Если это /login или /api/auth, редиректим на dashboard
        if (url === "/login" || url.startsWith("/api/auth")) {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      // Если это абсолютный URL с тем же origin - используем его
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // По умолчанию редиректим на dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  // Убираем pages.signIn, чтобы NextAuth не редиректил на /login после успешного OAuth
  // pages: {
  //   signIn: "/login",
  // },
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      // В production предупреждаем, но не падаем во время сборки
      // Переменная должна быть установлена в Vercel Environment Variables
      if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
        console.warn("⚠️  NEXTAUTH_SECRET is not set! Please set it in Vercel Environment Variables.");
      }
      // Используем fallback для сборки, но в runtime это должно быть установлено
      return "fallback-secret-key-change-in-production-please-set-nexauth-secret";
    }
    return secret;
  })(),
  debug: process.env.NODE_ENV === "development",
};

