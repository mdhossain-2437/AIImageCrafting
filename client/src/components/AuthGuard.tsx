import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";

// This component protects routes that require authentication
interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // Skip auth check for login page
    if (location === "/login") return;
    
    // If authentication is required but user is not logged in, redirect to login
    if (requireAuth && !loading && !user) {
      navigate("/login");
    }
    
    // If user is logged in and trying to access login page, redirect to dashboard
    if (!requireAuth && !loading && user) {
      navigate("/");
    }
  }, [user, loading, location, navigate, requireAuth]);
  
  // While checking authentication state, show loading screen
  if (loading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }
  
  // For login page (requireAuth=false): render if user is NOT logged in
  // For protected pages (requireAuth=true): render if user IS logged in
  if (
    (requireAuth && user) || 
    (!requireAuth && !user) || 
    location === "/login"
  ) {
    return <>{children}</>;
  }
  
  // Rendering null while redirecting
  return <LoadingScreen message="Redirecting..." />;
}