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
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300"></i>
          <input 
            type="text" 
            placeholder="Search for prompts, styles, or models..." 
            className="w-full bg-primary-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
          />
        </div>
      </div>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 relative group">
          <i className="ri-notification-3-line group-hover:animate-pulse"></i>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
        </button>
        
        <button className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
          <i className="ri-question-line hover:animate-bounce"></i>
        </button>
        
        {isMobile && user && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden hover:shadow-[0_0_12px_rgba(219,39,119,0.7)] transition-all duration-300 cursor-pointer">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
        
        {!user && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-[1px] rounded-md overflow-hidden hover:p-[2px] transition-all duration-300 group cursor-pointer" 
               onClick={() => window.location.href = "/login"}>
            <div className="bg-background/90 text-white py-1 px-3 rounded-[3px] text-sm group-hover:bg-transparent transition-all duration-300">
              Login
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
