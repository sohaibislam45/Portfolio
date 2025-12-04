import { Router } from 'express';
import projectRoutes from './projects.js';
import blogRoutes from './blog.js';
import contactRoutes from './contact.js';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);

export default router;

