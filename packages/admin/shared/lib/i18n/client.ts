/**
 * Client-side i18n functions
 */

'use client';

export function setLocale(locale: string) {
  document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function getLocale(): string {
  if (typeof window === 'undefined') return 'ru';
  
  const cookies = document.cookie.split(';');
  const localeCookie = cookies.find(c => c.trim().startsWith('locale='));
  
  if (localeCookie) {
    return localeCookie.split('=')[1] || 'ru';
  }
  
  // Try to detect from browser
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'ru';
}

