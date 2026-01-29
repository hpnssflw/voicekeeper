"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/shared/lib/i18n";
import { getLocale, setLocale as setLocaleCookie } from "@/shared/lib/i18n/client";

export function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState<Locale>("ru");

  useEffect(() => {
    const locale = getLocale() as Locale;
    setCurrentLocale(locale || "ru");
  }, []);

  const switchLocale = (locale: Locale) => {
    setCurrentLocale(locale);
    setLocaleCookie(locale);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-[hsl(15,12%,8%)] p-0.5">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          disabled={isPending}
          className={`px-2 py-1 text-[9px] font-medium rounded transition-all ${
            currentLocale === locale
              ? "bg-orange-500/20 text-orange-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

