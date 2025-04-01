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

  // Login with username and password
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      
      // Create a user object from the response
      const loggedInUser: User = {
        id: userData.id,
        username: userData.username,
        password: '', // We don't store the actual password
        email: userData.email || `${username}@example.com`, // Fallback for users created without email
        displayName: userData.displayName || username,
        avatar: userData.avatar || null,
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      };
      
      setUser(loggedInUser);
      
      return loggedInUser;
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

  // Register new user
  const register = async (userData: any): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the register API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          email: userData.email,
          displayName: userData.displayName || userData.username,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const registeredUserData = await response.json();
      
      // Create a user object from the response
      const registeredUser: User = {
        id: registeredUserData.id,
        username: registeredUserData.username,
        password: '', // We don't store the actual password
        email: registeredUserData.email,
        displayName: registeredUserData.displayName || registeredUserData.username,
        avatar: registeredUserData.avatar || null,
        createdAt: registeredUserData.createdAt ? new Date(registeredUserData.createdAt) : new Date(),
      };
      
      setUser(registeredUser);
      
      return registeredUser;
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
