import type { Request, Response } from 'express';
import { PostsService } from '../services/posts.service';

const service = new PostsService();

export async function getPost(req: Request, res: Response) {
  const { postId } = req.params as { postId: string };
  const data = await service.get(postId);
  res.json({ data, error: null });
}

export async function createPost(req: Request, res: Response) {
  const data = await service.create(req.body);
  res.status(201).json({ data, error: null });
}

export async function updatePost(req: Request, res: Response) {
  const { postId } = req.params as { postId: string };
  const data = await service.update(postId, req.body);
  res.json({ data, error: null });
}

export async function deletePost(req: Request, res: Response) {
  const { postId } = req.params as { postId: string };
  const data = await service.remove(postId);
  res.json({ data, error: null });
}

export async function listPosts(req: Request, res: Response) {
  const { botId, status, page, limit } = req.query as any;
  const data = await service.list({ botId, status, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  res.json({ data, error: null });
}


