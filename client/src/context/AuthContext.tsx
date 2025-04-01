import React, { createContext, useState, useEffect } from "react";
import { auth, signInWithGoogle, signOut as firebaseSignOut } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => ({ id: 0 } as User),
  register: async () => ({ id: 0 } as User),
  loginWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in our database, otherwise create one
          // In a real app, this would be a proper API call
          const userResponse = await apiRequest("POST", "/api/auth/firebase-login", {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            avatar: firebaseUser.photoURL,
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            // Fallback to using a simple version of the user data
            setUser({
              id: 1, // Mock ID since we don't have a real one from backend
              username: firebaseUser.email?.split('@')[0] || 'user',
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              avatar: firebaseUser.photoURL || '',
              createdAt: new Date(),
            } as User);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with username and password
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await response.json();
      setUser(userData);
      return userData;
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
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const newUser = await response.json();
      setUser(newUser);
      return newUser;
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

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // User state will be updated by the onAuthStateChanged listener
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

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignOut();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
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
