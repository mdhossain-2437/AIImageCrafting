import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();
  
  React.useEffect(() => {
    if (!loading && !user && location !== "/login") {
      navigate("/login");
    }
  }, [user, loading, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground relative">
      {/* Dynamic background with advanced gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.2),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.15),transparent_60%)]"></div>
      
      {/* Animated floating elements */}
      <div className="absolute w-full h-full overflow-hidden opacity-40 pointer-events-none">
        {/* Top right glow */}
        <div className="absolute top-0 right-[10%] w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }}></div>
        
        {/* Bottom left glow */}
        <div className="absolute bottom-0 left-[10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        
        {/* Center glow */}
        <div className="absolute top-1/3 left-1/3 w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        
        {/* Small particle effects */}
        <div className="absolute top-[15%] left-[30%] w-6 h-6 bg-purple-500/20 rounded-full blur-md animate-float" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-[45%] right-[25%] w-8 h-8 bg-blue-500/20 rounded-full blur-md animate-float" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute bottom-[20%] left-[40%] w-5 h-5 bg-indigo-500/20 rounded-full blur-md animate-float" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-[65%] right-[35%] w-10 h-10 bg-violet-500/20 rounded-full blur-md animate-float" style={{ animationDelay: "3s" }}></div>
      </div>
      
      {/* Subtle grid pattern without shiny effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,30,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,30,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>
      
      {/* Main content */}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        <div className="flex-1 overflow-auto scrollbar-thin p-4 lg:p-8 animate-fade-in relative">
          {/* Content wrapper with subtle glass effect */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
