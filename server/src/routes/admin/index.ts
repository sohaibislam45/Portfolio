import { Router } from 'express';
import dashboardRoutes from './dashboard.js';
import projectsRoutes from './projects.js';
import blogRoutes from './blog.js';
import messagesRoutes from './messages.js';
import testimonialsRoutes from './testimonials.js';
import usersRoutes from './users.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/projects', projectsRoutes);
router.use('/blog', blogRoutes);
router.use('/messages', messagesRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/users', usersRoutes);

export default router;

