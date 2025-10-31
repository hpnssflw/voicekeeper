import { Router } from 'express';
import { createPost, deletePost, getPost, listPosts, updatePost } from '../controllers/posts.controller';
import { validate } from '../middlewares/validate';
import { createPostSchema, listPostsQuerySchema, updatePostSchema } from '../validators/posts.schema';

export const postsRouter = Router();

postsRouter.get('/', validate(listPostsQuerySchema, 'query'), listPosts);
postsRouter.get('/:postId', getPost);
postsRouter.post('/', validate(createPostSchema, 'body'), createPost);
postsRouter.put('/:postId', validate(updatePostSchema, 'body'), updatePost);
postsRouter.delete('/:postId', deletePost);


