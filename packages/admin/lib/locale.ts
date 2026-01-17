'use server';

import { cookies } from 'next/headers';
import { defaultLocale, type Locale } from '../i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value;
  
  if (locale === 'ru' || locale === 'en') {
    return locale;
  }
  
  return defaultLocale;
}

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('locale', locale, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}

