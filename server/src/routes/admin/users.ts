import { Router, Response } from 'express';
import { AuthRequest, verifyToken, requireAdmin } from '../../middleware/auth.js';
import User from '../../models/User.js';
import admin from '../../config/firebase.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get all users
router.get(
  '/',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

// Get single user
router.get(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
);

// Promote/demote user (update role)
router.patch(
  '/:id/role',
  verifyToken,
  requireAdmin,
  [
    body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { role } = req.body;

      // Update role in database
      user.role = role;
      await user.save();

      // Update Firebase custom claims
      try {
        await admin.auth().setCustomUserClaims(user.uid, { role });
      } catch (firebaseError) {
        console.error('Error updating Firebase claims:', firebaseError);
        // Continue even if Firebase update fails
      }

      res.json(user);
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }
);

// Delete user
router.delete(
  '/:id',
  verifyToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete from Firebase (optional - you may want to keep this)
      try {
        await admin.auth().deleteUser(user.uid);
      } catch (firebaseError) {
        console.error('Error deleting Firebase user:', firebaseError);
      }

      // Delete from database
      await User.findByIdAndDelete(req.params.id);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;

