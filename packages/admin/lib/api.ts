// Safe API_BASE with fallback for local development
// On Vercel, this should be set via environment variables
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle network errors
      if (!res.ok && res.status === 0) {
        throw new Error('Network error: Unable to reach API server');
      }

      let json: ApiResponse<T>;
      try {
        json = await res.json();
      } catch (parseError) {
        throw new Error(`Invalid response from API: ${res.status} ${res.statusText}`);
      }

      if (!res.ok || json.error) {
        const msg = json.error?.message || `API error ${res.status}`;
        throw new Error(msg);
      }

      return json.data as T;
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

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export const api = new ApiClient(API_BASE);

