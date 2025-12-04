import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials are missing. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

// Middleware to verify Firebase ID token
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user',
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user has admin role in Firebase custom claims
    const userRecord = await admin.auth().getUser(req.user.uid);
    const isAdmin = userRecord.customClaims?.role === 'admin';

    if (!isAdmin) {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    req.user.role = 'admin';
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};

