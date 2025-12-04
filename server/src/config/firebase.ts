import admin from 'firebase-admin';

let firebaseInitialized = false;

export const initializeFirebase = (): void => {
  if (firebaseInitialized || admin.apps.length > 0) {
    return;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials are missing. Admin features will not work.');
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    firebaseInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
};

export default admin;

