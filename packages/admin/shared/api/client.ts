/**
 * Base API Client
 * Handles HTTP requests to Next.js API routes
 */

// Use Next.js API routes for admin operations (relative path)
export const API_BASE = '/api';

// Bot API base for operations that still need bot API
export function getBotApiBase(): string {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.trim() !== '') {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  
  // Always use Docker service name in production (Next.js standalone mode)
  // This is safe because this function is only called from server-side API routes
  if (process.env.NODE_ENV === 'production') {
    return 'http://bot:4000/api';
  }
  
  // In development, use localhost
  return 'http://bot:4000/api';
}

// Get the base URL for server-side requests
function getServerBaseUrl(): string {
  // In server context, we need a full URL
  if (typeof window === 'undefined') {
    // Use NEXT_PUBLIC_APP_URL if available, otherwise construct from NEXTAUTH_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001';
    return appUrl;
  }
  // In client context, relative paths work fine
  return '';
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    // Gracefully handle missing API_BASE
    if (!this.baseUrl || this.baseUrl === 'undefined' || this.baseUrl.trim() === '') {
      throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_BASE environment variable.');
    }

    // Build the full URL
    // On server, we need absolute URL; on client, relative paths work
    const isServer = typeof window === 'undefined';
    const serverBase = isServer ? getServerBaseUrl() : '';
    const fullUrl = isServer 
      ? `${serverBase}${this.baseUrl}${path}`
      : `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }).catch((fetchError) => {
        // Handle fetch errors (network, CORS, etc.)
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error(`Network error: Unable to reach API server at ${this.baseUrl}. Please ensure the backend is running.`);
        }
        throw fetchError;
      });

      // Handle network errors
      if (!res.ok && res.status === 0) {
        throw new Error('Network error: Unable to reach API server');
      }

      let json: any;
      try {
        json = await res.json();
      } catch (parseError) {
        throw new Error(`Invalid response from API: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        const msg = json.error || json.message || `API error ${res.status}`;
        throw new Error(msg);
      }

      // Return full response for endpoints that don't wrap in { data: ... }
      return json as T;
    } catch (error) {
      // Re-throw if it's already our Error
      if (error instanceof Error) {
        throw error;
      }
      // Handle other errors (network, timeout, etc.)
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

// Default API client instance
export const api = new ApiClient(API_BASE);

