import { createTranslator } from 'next-intl';
import { getLocale } from './locale';

// Load messages for a locale
export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch {
    // Fallback to Russian if locale not found
    return (await import(`../messages/ru.json`)).default;
  }
}

// Get translator for server components
export async function getTranslations(namespace?: string) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  return createTranslator({ locale, messages, namespace });
}

// Client-side hook (will be used in client components)
export function useTranslations(namespace?: string) {
  // This will be implemented in client components
  // For now, return a mock function
  return (key: string, values?: Record<string, any>) => {
    // This is a placeholder - actual implementation will use next-intl's useTranslations
    return key;
  };
}

