import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const getIdTokenAsync = async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      return await getIdToken(currentUser);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    logout,
    getIdToken: getIdTokenAsync,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

