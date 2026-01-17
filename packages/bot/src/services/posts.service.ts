import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../core/errors';
import { publish } from '../queues/publish.queue';
import { PostsRepository } from '../repositories/posts.repo';

export class PostsService extends BaseService {
  private readonly repo = new PostsRepository();

  async get(postId: string) {
    const post = await this.repo.findById(postId);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }

  async create(input: any) {
    const created = await this.repo.create(input);
    
    // Enqueue publish job if status is 'published'
    if (created.status === 'published' && created._id && created.botId) {
      console.log(`📝 Post created with status='published', enqueueing job...`);
      const job = await publish.queue.add('publish-post', {
        botId: created.botId.toString(),
        postId: created._id.toString(),
      });
      console.log(`📤 Publish job enqueued: jobId=${job.id}, postId=${created._id}, botId=${created.botId}`);
    } else {
      console.log(`ℹ️ Post created with status='${created.status}', no job enqueued`);
    }
    
    return created;
  }

  async update(postId: string, patch: any) {
    const oldPost = await this.repo.findById(postId);
    if (!oldPost) throw new NotFoundError('Post not found');
    
    const updated = await this.repo.update(postId, patch);
    if (!updated) throw new NotFoundError('Post not found');
    
    // If status changed to 'published', enqueue publish job
    if (patch.status === 'published' && oldPost.status !== 'published' && updated._id && updated.botId) {
      const job = await publish.queue.add('publish-post', {
        botId: updated.botId.toString(),
        postId: updated._id.toString(),
      });
      console.log(`📤 Publish job enqueued: jobId=${job.id}, postId=${updated._id}, botId=${updated.botId}`);
    }
    
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


