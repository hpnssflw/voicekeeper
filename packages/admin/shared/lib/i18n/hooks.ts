/**
 * Client-side i18n hooks
 */

'use client';

import { useState, useEffect } from 'react';
import { getLocale } from './client';

type Messages = Record<string, any>;

let messagesCache: Record<string, Messages> = {};

async function loadMessages(locale: string): Promise<Messages> {
  if (messagesCache[locale]) {
    return messagesCache[locale];
  }
  
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    messagesCache[locale] = messages.default;
    return messages.default;
  } catch {
    // Fallback to Russian
    if (locale !== 'ru') {
      const messages = await import(`../../../messages/ru.json`);
      messagesCache['ru'] = messages.default;
      return messages.default;
    }
    return {};
  }
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

function formatMessage(template: string, values?: Record<string, any>): string {
  if (!values) return template;
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

export function useTranslations(namespace?: string) {
  const [locale, setLocaleState] = useState<string>('ru');
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const currentLocale = getLocale();
    setLocaleState(currentLocale);
    
    loadMessages(currentLocale).then(msgs => {
      setMessages(msgs);
    });
  }, []);

  const t = (key: string, values?: Record<string, any>): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getNestedValue(messages, fullKey);
    
    if (typeof message === 'string') {
      return formatMessage(message, values);
    }
    
    // Fallback to key if translation not found
    return fullKey;
  };

  return t;
}

