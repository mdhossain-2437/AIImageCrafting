import React, { createContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
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

// Create a default user for the demo app
const defaultUser: User = {
  id: 1,
  username: "demouser",
  password: "",
  email: "demo@example.com",
  displayName: "Demo User",
  avatar: null,
  createdAt: new Date(),
};

export const AuthContext = createContext<AuthContextType>({
  user: defaultUser, // Initialize with default user
  loading: false,
  error: null,
  login: async () => defaultUser,
  register: async () => defaultUser,
  loginWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the default user - no loading state needed
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Login with username and password (simplified)
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      // Demo login
      const loginUser = {
        ...defaultUser,
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
      };
      setUser(loginUser);
      
      toast({
        title: "Login Successful",
        description: "You are now logged in to the demo mode",
      });
      
      return loginUser;
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

  // Register new user (simplified)
  const register = async (userData: any): Promise<User> => {
    try {
      setLoading(true);
      
      const registerUser = {
        ...defaultUser,
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName || userData.username,
      };
      
      setUser(registerUser);
      
      toast({
        title: "Registration Successful",
        description: "Account created in demo mode",
      });
      
      return registerUser;
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

  // Login with Google (simplified)
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Just use the default user
      setUser(defaultUser);
      
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

  // Sign out (simplified)
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      // For demo, we don't actually sign out - just show the message
      toast({
        title: "Logged Out",
        description: "You would be logged out in a real app",
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
