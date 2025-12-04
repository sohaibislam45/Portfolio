import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import Testimonial from '../../models/Testimonial.js';
import { upload } from '../../utils/upload.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get all testimonials
router.get(
  '/',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }
);

// Get single testimonial
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json(testimonial);
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      res.status(500).json({ error: 'Failed to fetch testimonial' });
    }
  }
);

// Create testimonial
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.single('avatar'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, role, company, content, rating, featured, order } = req.body;

      const testimonialData: any = {
        name,
        role,
        content,
        featured: featured === 'true' || featured === true,
        order: order ? parseInt(order) : 0,
      };

      if (company) testimonialData.company = company;
      if (rating) testimonialData.rating = parseInt(rating);
      if (req.file) {
        testimonialData.avatar = `/uploads/${req.file.filename}`;
      }

      const testimonial = new Testimonial(testimonialData);
      await testimonial.save();

      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }
);

// Update testimonial
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.single('avatar'),
  [
    body('name').optional().trim().notEmpty(),
    body('role').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      const { name, role, company, content, rating, featured, order } = req.body;

      if (name) testimonial.name = name;
      if (role) testimonial.role = role;
      if (company !== undefined) testimonial.company = company;
      if (content) testimonial.content = content;
      if (rating !== undefined) testimonial.rating = parseInt(rating);
      if (featured !== undefined) testimonial.featured = featured === 'true' || featured === true;
      if (order !== undefined) testimonial.order = parseInt(order);

      if (req.file) {
        testimonial.avatar = `/uploads/${req.file.filename}`;
      }

      await testimonial.save();

      res.json(testimonial);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ error: 'Failed to update testimonial' });
    }
  }
);

// Delete testimonial
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  }
);

export default router;

