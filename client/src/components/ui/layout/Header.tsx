import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <header className="h-16 bg-background/50 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center">
        {isMobile && (
          <button 
            className="text-gray-400 hover:text-white p-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/40 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        )}
        
        {isMobile && (
          <div className="flex items-center space-x-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center hover:shadow-[0_0_12px_rgba(139,92,246,0.7)] transition-all duration-300">
              <i className="ri-image-edit-line text-white"></i>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">ArtificeAI</h1>
          </div>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 mx-4 lg:mx-8">
        <div className="relative w-full max-w-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300 z-10"></i>
          <input 
            type="text" 
            placeholder="Search for prompts, styles, or models..." 
            className="w-full bg-background/80 border border-purple-500/20 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:animate-pulse-glow relative z-10 transition-all duration-300 hover:border-purple-500/40 focus:border-purple-500/60"
          />
          {/* Animated typing cursor */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-purple-500/50 opacity-0 group-hover:opacity-100 animate-pulse z-10"></span>
        </div>
      </div>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="bg-background/80 backdrop-blur-lg p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 relative group overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <i className="ri-notification-3-line group-hover:animate-pulse relative z-10"></i>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse-glow"></span>
        </button>
        
        <button className="bg-background/80 backdrop-blur-lg p-2.5 rounded-lg text-gray-400 hover:text-white transition-all duration-300 relative group overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <i className="ri-question-line relative z-10 group-hover:animate-float"></i>
        </button>
        
        {isMobile && user && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 cursor-pointer group">
            <span className="absolute inset-0 bg-gradient-to-br from-pink-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 animate-pulse-glow transition-opacity duration-300"></span>
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm animate-gradient bg-size-200">
                {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
        
        {!user && (
          <div className="relative group cursor-pointer" onClick={() => window.location.href = "/login"}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 animate-pulse-glow"></div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-[2px] rounded-md overflow-hidden hover:p-[3px] transition-all duration-300 relative">
              <div className="relative bg-background/90 text-white py-1.5 px-4 rounded-[3px] text-sm font-medium group-hover:bg-transparent transition-all duration-300 overflow-hidden">
                Login
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
