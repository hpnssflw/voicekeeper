import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../core/errors';
import { PostsRepository } from '../repositories/posts.repo';

export class PostsService extends BaseService {
  private readonly repo = new PostsRepository();

  async get(postId: string) {
    const post = await this.repo.findById(postId);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }

  async create(input: any) {
    return this.repo.create(input);
  }

  async update(postId: string, patch: any) {
    const updated = await this.repo.update(postId, patch);
    if (!updated) throw new NotFoundError('Post not found');
    return updated;
  }

  async remove(postId: string) {
    const deleted = await this.repo.softDelete(postId);
    if (!deleted) throw new NotFoundError('Post not found');
    return deleted;
  }

  async list(params: { botId: string; status?: string; page?: number; limit?: number }) {
    const { botId, status } = params;
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const filter: any = { botId };
    if (status) filter.status = status;
    return this.repo.list(filter, page, limit);
  }
}


