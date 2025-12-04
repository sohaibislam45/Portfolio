import dotenv from 'dotenv';
import admin from '../config/firebase.js';
import { initializeFirebase } from '../config/firebase.js';

dotenv.config();

// Initialize Firebase
initializeFirebase();

async function setAdminClaim() {
  try {
    const uid = process.argv[2];

    if (!uid) {
      console.error('Usage: npm run set-admin-claim <firebase-uid>');
      console.error('Example: npm run set-admin-claim abc123xyz456');
      process.exit(1);
    }

    // Set custom claim for admin role
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });

    // Verify the user exists
    const user = await admin.auth().getUser(uid);
    console.log(`Successfully set admin claim for user: ${user.email} (${uid})`);
    console.log('Custom claims:', user.customClaims);

    process.exit(0);
  } catch (error: any) {
    console.error('Error setting admin claim:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('User not found. Make sure the UID is correct.');
    }
    process.exit(1);
  }
}

setAdminClaim();

