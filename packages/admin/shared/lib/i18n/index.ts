/**
 * i18n module
 * Exports all i18n functions and types
 */

export * from './config';
export * from './hooks';

// Server-side exports (explicit to avoid conflicts)
export {
  getLocale as getServerLocale,
  setLocale as setServerLocale,
  getMessages,
  getTranslations,
} from './server';

// Client-side exports (explicit to avoid conflicts)
export {
  getLocale as getClientLocale,
  setLocale as setClientLocale,
} from './client';

// Default exports for convenience (client-side for client components)
export { getLocale, setLocale } from './client';

