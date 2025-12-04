import { Router, Request, Response } from 'express';
import BlogPost from '../models/BlogPost.js';

const router = Router();

// GET /api/blog - Get all blog posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blog/:slug - Get single blog post by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

export default router;

