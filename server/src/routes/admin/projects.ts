import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import Project from '../../models/Project.js';
import { upload } from '../../utils/upload.js';
import { body, param, validationResult } from 'express-validator';

const router = Router();

// Get all projects (with pagination)
router.get(
  '/',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const projects = await Project.find()
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Project.countDocuments();

      res.json({
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }
);

// Get single project
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }
);

// Create project
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.single('thumbnail'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('techStack').isArray().withMessage('Tech stack must be an array'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, techStack, liveUrl, repoUrl, category, order } = req.body;

      const projectData: any = {
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : JSON.parse(techStack || '[]'),
        category,
        order: order ? parseInt(order) : 0,
      };

      if (liveUrl) projectData.liveUrl = liveUrl;
      if (repoUrl) projectData.repoUrl = repoUrl;
      if (req.file) {
        projectData.thumbnail = `/uploads/${req.file.filename}`;
      }

      const project = new Project(projectData);
      await project.save();

      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);

// Update project
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.single('thumbnail'),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('techStack').optional().isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const { title, description, techStack, liveUrl, repoUrl, category, order } = req.body;

      if (title) project.title = title;
      if (description) project.description = description;
      if (techStack) {
        project.techStack = Array.isArray(techStack) ? techStack : JSON.parse(techStack);
      }
      if (liveUrl !== undefined) project.liveUrl = liveUrl;
      if (repoUrl !== undefined) project.repoUrl = repoUrl;
      if (category) project.category = category;
      if (order !== undefined) project.order = parseInt(order);

      if (req.file) {
        project.thumbnail = `/uploads/${req.file.filename}`;
      }

      await project.save();

      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
);

// Delete project
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
);

// Reorder projects
router.post(
  '/reorder',
  verifyToken,
  requireAdmin,
  [
    body('projects').isArray().withMessage('Projects must be an array'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projects } = req.body;

      await Promise.all(
        projects.map((p: { id: string; order: number }) =>
          Project.findByIdAndUpdate(p.id, { order: p.order })
        )
      );

      res.json({ message: 'Projects reordered successfully' });
    } catch (error) {
      console.error('Error reordering projects:', error);
      res.status(500).json({ error: 'Failed to reorder projects' });
    }
  }
);

export default router;

