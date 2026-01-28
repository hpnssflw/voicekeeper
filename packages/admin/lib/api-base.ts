/**
 * Get the base URL for the bot API
 * In Docker, use service name 'bot', otherwise use localhost
 */
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

