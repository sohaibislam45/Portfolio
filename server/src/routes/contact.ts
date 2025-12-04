import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';

const router = Router();

// POST /api/contact - Submit contact form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, message } = req.body;

      const newMessage = new Message({
        name,
        email,
        message,
      });

      await newMessage.save();

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: newMessage,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

export default router;

