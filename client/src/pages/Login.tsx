import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Login() {
  const { loginWithGoogle, loading, user } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Will redirect to Google sign-in page
      // After successful sign-in, the AuthContext's onAuthStateChanged will redirect to "/"
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all duration-300">
            <i className="ri-image-edit-line text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient ml-4">ArtificeAI</h1>
        </div>

        <Card className="backdrop-blur-md bg-black/30 border border-white/10 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to ArtificeAI</CardTitle>
            <CardDescription className="text-center">
              Sign in to access advanced AI image generation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-8 pt-4">
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-400">
                ArtificeAI uses Google authentication to provide a secure and seamless experience. 
                Your account details are protected and never shared with third parties.
              </p>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-gray-400 mt-4">Authenticating...</p>
              </div>
            ) : (
              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white text-gray-800 hover:bg-gray-100 font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-xs">Fast and secure login with your Google account</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-xs">Access to all AI image generation features</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-xs">Save and share your AI-generated masterpieces</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
