/**
 * User entity model
 * Re-exports MongoDB model and types
 */

export { UserModel } from '@/lib/db/models/User';

// User type based on API response
import type { UserResponse } from '@/shared/api/types';

// Extended User type for internal use (combines API response with DB model)
export interface User extends UserResponse {
  // Additional fields from DB model if needed
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Re-export UserResponse for convenience
export type { UserResponse };

