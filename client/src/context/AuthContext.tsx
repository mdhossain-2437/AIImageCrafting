import React, { createContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  auth, 
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  handleRedirectResult,
  saveUserToFirestore
} from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Firebase user to app User mapper
function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: parseInt(firebaseUser.uid.substring(0, 8), 16) || 1, // Convert part of UID to a number
    username: firebaseUser.email?.split('@')[0] || firebaseUser.displayName || "user",
    password: "", // We don't store passwords
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
    avatar: firebaseUser.photoURL,
    createdAt: new Date(),
  };
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => ({ 
    id: 0, 
    username: '', 
    password: '', 
    email: '', 
    displayName: '', 
    avatar: null, 
    createdAt: new Date() 
  }),
  register: async () => ({ 
    id: 0, 
    username: '', 
    password: '', 
    email: '', 
    displayName: '', 
    avatar: null, 
    createdAt: new Date() 
  }),
  loginWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // Effect to listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          // Map Firebase user to our app's User format
          const mappedUser = mapFirebaseUserToUser(firebaseUser);
          setUser(mappedUser);
          
          // Check for redirect result on page load (for Google sign-in)
          const redirectUser = await handleRedirectResult();
          if (redirectUser) {
            toast({
              title: "Login Successful",
              description: `Welcome ${redirectUser.displayName || 'back'}!`,
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err instanceof Error ? err.message : "Authentication error");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  // Login with username and password (NOT IMPLEMENTED WITH FIREBASE)
  // This is kept for compatibility but redirects to Google sign-in
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      // For this application, we'll only use Google sign-in
      // Redirect to Google sign-in instead
      await firebaseSignInWithGoogle();
      
      // This won't actually execute due to the redirect
      throw new Error("This should not execute - redirect should happen");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new user (NOT IMPLEMENTED WITH FIREBASE)
  // This is kept for compatibility but redirects to Google sign-in
  const register = async (userData: any): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      // For this application, we'll only use Google sign-in
      // Redirect to Google sign-in instead
      await firebaseSignInWithGoogle();
      
      // This won't actually execute due to the redirect
      throw new Error("This should not execute - redirect should happen");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google - actual implementation
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // This will redirect to Google sign-in page
      await firebaseSignInWithGoogle();
      
      // Code after this won't execute due to redirect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google login failed";
      setError(errorMessage);
      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out - actual implementation
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await firebaseSignOut();
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      toast({
        title: "Logout Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
