import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBYoRPiThNUu_DxeeSsBCu9bvmExmINHS8",
  authDomain: "portfolio-4c640.firebaseapp.com",
  projectId: "portfolio-4c640",
  storageBucket: "portfolio-4c640.firebasestorage.app",
  messagingSenderId: "794409869902",
  appId: "1:794409869902:web:717eb2ae29202f9d09591f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

