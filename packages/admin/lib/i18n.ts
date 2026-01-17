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
  
  // Simple translator function
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
  };
  
  const formatMessage = (template: string, values?: Record<string, any>): string => {
    if (!values) return template;
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return values[key]?.toString() || match;
    });
  };
  
  return (key: string, values?: Record<string, any>): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getNestedValue(messages, fullKey);
    
    if (typeof message === 'string') {
      return formatMessage(message, values);
    }
    
    return fullKey;
  };
}

