import { Types } from 'mongoose';
import { BaseRepository } from '../core/BaseRepository';
import { PostModel } from '../models/Post';

export class PostsRepository extends BaseRepository<typeof PostModel> {
  constructor() {
    super('posts');
  }

  async findById(id: string) {
    return PostModel.findById(id).lean();
  }

  async create(doc: any) {
    const clean: any = { ...doc };
    if (doc.botId && typeof doc.botId === 'string') clean.botId = new Types.ObjectId(doc.botId);
    if (doc.authorId && typeof doc.authorId === 'string') clean.authorId = new Types.ObjectId(doc.authorId);
    const created = await PostModel.create(clean);
    return created.toObject();
  }

  async update(id: string, patch: any) {
    return PostModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }

  async softDelete(id: string) {
    return PostModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).lean();
  }

  async list(filter: any, page = 1, limit = 20) {
    const q = { deletedAt: { $exists: false }, ...filter };
    const items = await PostModel.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await PostModel.countDocuments(q);
    return { items, total, page, limit };
  }
}


