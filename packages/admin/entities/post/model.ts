/**
 * Post entity model
 * Re-exports MongoDB model and types
 */

export { PostModel } from '@/lib/db/models/Post';

// Post types from API
export type {
  Post,
  PostsListResponse,
} from '../../shared/api/types';

