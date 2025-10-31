import { connectMongo } from '../infra/mongo';
import { getRedis } from '../infra/redis';
import { PostsRepository } from '../repositories/posts.repo';
import { PostsService } from '../services/posts.service';

export type Container = ReturnType<typeof buildContainer>;

export function buildContainer() {
  // infra singletons
  const mongoPromise = connectMongo();
  const redis = getRedis();

  // repositories
  const postsRepository = new PostsRepository();

  // services
  const postsService = new PostsService();

  return {
    mongoPromise,
    redis,
    repositories: { postsRepository },
    services: { postsService },
  };
}


