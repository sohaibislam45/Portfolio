import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import BlogPost from '../../models/BlogPost.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get all blog posts (with pagination)
router.get(
  '/',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search as string;

      const query: any = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const blogPosts = await BlogPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await BlogPost.countDocuments(query);

      res.json({
        blogPosts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  }
);

// Get single blog post
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  }
);

// Create blog post
router.post(
  '/',
  verifyToken,
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, slug, content, excerpt, tags } = req.body;

      const blogPost = new BlogPost({
        title,
        slug: slug.toLowerCase().trim(),
        content,
        excerpt,
        tags: Array.isArray(tags) ? tags : JSON.parse(tags || '[]'),
      });

      await blogPost.save();

      res.status(201).json(blogPost);
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  }
);

// Update blog post
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  [
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('slug').optional().trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const { title, slug, content, excerpt, tags } = req.body;

      if (title) blogPost.title = title;
      if (slug) blogPost.slug = slug.toLowerCase().trim();
      if (content) blogPost.content = content;
      if (excerpt !== undefined) blogPost.excerpt = excerpt;
      if (tags) {
        blogPost.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
      }

      await blogPost.save();

      res.json(blogPost);
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  }
);

// Delete blog post
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }
);

export default router;

