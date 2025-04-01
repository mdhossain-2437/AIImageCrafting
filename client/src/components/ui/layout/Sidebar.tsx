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
      <div className="relative">
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r animate-pulse" />
        )}
        <div 
          onClick={() => window.location.href = href}
          className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer",
            "transform hover:translate-x-1",
            isActive 
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white font-medium" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <i className={cn(icon, "transition-transform duration-300", isActive ? "scale-110" : "")}></i>
          <span>{children}</span>
          
          {isActive && (
            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <i className="ri-image-edit-line text-white"></i>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">ArtificeAI</h1>
          </div>
          
          {isMobile && (
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="ri-close-line text-xl"></i>
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
          </ul>
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                    {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.displayName || user.username}</p>
                <p className="text-xs text-gray-400 truncate">Free Plan</p>
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={signOut}
              >
                <i className="ri-logout-box-r-line"></i>
              </button>
            </div>
          </div>
        )}
      </aside>
      
      {/* Mobile toggle button - rendered in Header */}
    </>
  );
}
