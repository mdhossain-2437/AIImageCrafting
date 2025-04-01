import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <header className="h-16 bg-background/50 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center">
        {isMobile && (
          <button 
            className="text-gray-400 hover:text-white p-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        )}
        
        {isMobile && (
          <div className="flex items-center space-x-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <i className="ri-image-edit-line text-white"></i>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">ArtificeAI</h1>
          </div>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 mx-4 lg:mx-8">
        <div className="relative w-full max-w-lg">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search for prompts, styles, or models..." 
            className="w-full bg-primary-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-gray-400 hover:text-white">
          <i className="ri-notification-3-line"></i>
        </button>
        <button className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-gray-400 hover:text-white">
          <i className="ri-question-line"></i>
        </button>
        
        {isMobile && user && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden">
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
          <Link href="/login">
            <a className="bg-purple-500 text-white py-1 px-3 rounded-md text-sm hover:bg-purple-600 transition-colors">
              Login
            </a>
          </Link>
        )}
      </div>
    </header>
  );
}
