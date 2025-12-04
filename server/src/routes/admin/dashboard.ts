import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import Project from '../../models/Project.js';
import BlogPost from '../../models/BlogPost.js';
import Message from '../../models/Message.js';
import Testimonial from '../../models/Testimonial.js';
import User from '../../models/User.js';

const router = Router();

// Get dashboard statistics
router.get(
  '/stats',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const [projects, blogPosts, messages, testimonials, users] = await Promise.all([
        Project.countDocuments(),
        BlogPost.countDocuments(),
        Message.countDocuments(),
        Testimonial.countDocuments(),
        User.countDocuments(),
      ]);

      const unreadMessages = await Message.countDocuments({ read: false });

      res.json({
        projects,
        blogPosts,
        messages,
        unreadMessages,
        testimonials,
        users,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  }
);

export default router;

