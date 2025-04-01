import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground relative">
      {/* Dynamic background with advanced gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.2),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.15),transparent_60%)]"></div>
      
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
