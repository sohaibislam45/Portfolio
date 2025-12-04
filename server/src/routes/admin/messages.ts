import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import Message from '../../models/Message.js';

const router = Router();

// Get all messages (with pagination)
router.get(
  '/',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const read = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined;

      const query: any = {};
      if (read !== undefined) {
        query.read = read;
      }

      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Message.countDocuments(query);
      const unreadCount = await Message.countDocuments({ read: false });

      res.json({
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        unreadCount,
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
);

// Get single message
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(message);
    } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ error: 'Failed to fetch message' });
    }
  }
);

// Mark message as read/unread
router.patch(
  '/:id/read',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { read } = req.body;
      const message = await Message.findByIdAndUpdate(
        req.params.id,
        { read: read === true },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.json(message);
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ error: 'Failed to update message' });
    }
  }
);

// Delete message
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
);

export default router;

