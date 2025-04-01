import React from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  // Close sidebar on mobile when location changes
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const NavLink = ({ href, icon, children }: { href: string, icon: string, children: React.ReactNode }) => {
    const isActive = location === href;
    
    return (
      <div className="relative group">
        {/* Active indicator - left side */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-purple-600 via-blue-500 to-purple-600 rounded-r animate-pulse-glow" />
        )}
        
        {/* Hover background glow effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-sm"></div>
        </div>
        
        <div 
          onClick={() => window.location.href = href}
          className={cn(
            "flex items-center space-x-3 px-4 py-3.5 rounded-lg transition-all duration-500 cursor-pointer relative z-10",
            "transform hover:translate-x-1 group-hover:shadow-[0_0_8px_rgba(139,92,246,0.3)]",
            isActive 
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white font-medium" 
              : "text-gray-400 hover:text-white hover:bg-background/80"
          )}
        >
          {/* Icon with animations */}
          <div className={cn(
            "relative flex items-center justify-center",
            "w-7 h-7 rounded-md",
            isActive ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20" : "group-hover:bg-background/50",
            "transition-all duration-300"
          )}>
            <i className={cn(
              icon, 
              "transition-all duration-300 z-10",
              isActive ? "text-purple-400 scale-110" : "group-hover:text-purple-400",
              "group-hover:animate-float"
            )}></i>
          </div>
          
          {/* Label with hover effects */}
          <span className={cn(
            "transition-all duration-300",
            isActive ? "text-white" : "group-hover:text-white group-hover:translate-x-1"
          )}>{children}</span>
          
          {/* Active indicator - right dot */}
          {isActive && (
            <div className="absolute right-3 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse-glow" />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-background/50 backdrop-blur-lg border-r border-white/5 fixed md:static z-50 h-full",
          "transition-all duration-300 w-64 lg:w-72 flex flex-col",
          isMobile && !isSidebarOpen && "-translate-x-full",
          isMobile && "absolute"
        )}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-70 blur-[5px] group-hover:blur-[8px] transition-all duration-700"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center relative shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 animate-float z-10">
                <i className="ri-vip-diamond-fill text-white text-lg group-hover:animate-slow-spin"></i>
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 bg-clip-text text-transparent animate-gradient bg-size-200 group-hover:scale-105 transition-transform duration-300">
              ArtificeAI
            </h1>
          </div>
          
          {isMobile && (
            <button 
              className="text-gray-400 hover:text-white relative overflow-hidden group"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="absolute inset-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
              <i className="ri-close-line text-xl relative z-10"></i>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1 px-3">
            <li className="text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Main</li>
            <li>
              <NavLink href="/" icon="ri-dashboard-line text-lg">Dashboard</NavLink>
            </li>
            <li>
              <NavLink href="/gallery" icon="ri-gallery-line text-lg">My Gallery</NavLink>
            </li>
            
            <li className="text-xs font-semibold text-gray-400 px-4 py-2 mt-6 uppercase tracking-wider">Create</li>
            <li>
              <NavLink href="/text-to-image" icon="ri-text-spacing text-lg">Text to Image</NavLink>
            </li>
            <li>
              <NavLink href="/image-to-image" icon="ri-image-edit-fill text-lg">Image to Image</NavLink>
            </li>
            <li>
              <NavLink href="/face-cloning" icon="ri-user-face-line text-lg">Face Cloning</NavLink>
            </li>
            <li>
              <NavLink href="/face-editor" icon="ri-edit-2-line text-lg">Face & Object Editor</NavLink>
            </li>
            
            <li className="text-xs font-semibold text-gray-400 px-4 py-2 mt-6 uppercase tracking-wider">Advanced</li>
            <li>
              <NavLink href="/model-tuning" icon="ri-settings-3-line text-lg">AI Model Tuning</NavLink>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-5 border-t border-white/10 mt-auto relative group">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center space-x-3 relative">
              <div className="relative">
                {/* Glow effect around avatar */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 blur-[5px] group-hover:opacity-70 group-hover:blur-[8px] transition-all duration-700"></div>
                
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 z-10 group-hover:scale-105">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm bg-gradient-to-br from-pink-500 to-purple-500 animate-gradient bg-size-200">
                      {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
                    </span>
                  )}
                  
                  {/* Status indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">
                  {user.displayName || user.username}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                  <p className="text-xs text-gray-400 truncate">Premium Plan</p>
                </div>
              </div>
              
              <button 
                className="relative p-2 text-gray-400 hover:text-white rounded-full overflow-hidden group"
                onClick={signOut}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <i className="ri-logout-box-r-line relative z-10 group-hover:rotate-12 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
        )}
      </aside>
      
      {/* Mobile toggle button - rendered in Header */}
    </>
  );
}
