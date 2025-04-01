import React, { createContext, useState, useEffect } from "react";
import { auth, signInWithGoogle, signOut as firebaseSignOut } from "@/lib/firebase";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in (simplified for demo)
  useEffect(() => {
    // For demo purposes, there's no existing auth state
    setLoading(false);
  }, []);

  // Login with username and password
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      
      // Demo login - create a mock user
      const mockUser: User = {
        id: 1,
        username,
        password: "", // Password should not be exposed in the client
        email: `${username}@example.com`,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        avatar: null,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      
      toast({
        title: "Login Successful",
        description: "You are now logged in to the demo mode",
      });
      
      return mockUser;
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
      
      // Demo registration - create a mock user
      const mockUser: User = {
        id: 1,
        username: userData.username,
        password: "", // Password should not be exposed in the client
        email: userData.email,
        displayName: userData.displayName || userData.username,
        avatar: null,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      
      toast({
        title: "Registration Successful",
        description: "Account created in demo mode",
      });
      
      return mockUser;
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
      
      // Demo Google login
      const mockUser: User = {
        id: 1,
        username: "demouser",
        password: "", // Password should not be exposed in the client
        email: "demo@example.com",
        displayName: "Demo User",
        avatar: null,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      
      toast({
        title: "Google Login",
        description: "Logged in with Google in demo mode",
      });
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
