import React, { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getStylePresets, getAiModels } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";

// Define the search result type
interface SearchResult {
  id: number;
  name: string;
  description: string;
  type: 'style' | 'model' | 'prompt';
  path?: string;
}

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch style presets and AI models for search
  const { data: stylePresets = [] } = useQuery({
    queryKey: ["/api/style-presets"],
    staleTime: 60000,
  });
  
  const { data: aiModels = [] } = useQuery({
    queryKey: ["/api/ai-models"],
    staleTime: 60000,
  });
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term || term.length < 2) {
        setSearchResults([]);
        return;
      }
      
      const lowerTerm = term.toLowerCase();
      
      // Search in style presets
      const styleResults = (stylePresets as any[])
        .filter(style => 
          style.name.toLowerCase().includes(lowerTerm) || 
          (style.description && style.description.toLowerCase().includes(lowerTerm))
        )
        .map(style => ({
          id: style.id,
          name: style.name,
          description: style.description || "Style preset",
          type: 'style' as const,
          path: "/text-to-image"
        }));
      
      // Search in AI models
      const modelResults = (aiModels as any[])
        .filter(model => 
          model.name.toLowerCase().includes(lowerTerm) || 
          (model.description && model.description.toLowerCase().includes(lowerTerm))
        )
        .map(model => ({
          id: model.id,
          name: model.name,
          description: model.description || "AI model",
          type: 'model' as const,
          path: "/text-to-image"
        }));
      
      // Sample prompts (in a real app, these would come from a database)
      const promptResults: SearchResult[] = [
        { id: 1, name: "Cyberpunk City", description: "A futuristic city with neon lights", type: 'prompt', path: "/text-to-image" },
        { id: 2, name: "Fantasy Landscape", description: "A magical fantasy world", type: 'prompt', path: "/text-to-image" },
        { id: 3, name: "Portrait Photography", description: "Professional portrait style", type: 'prompt', path: "/text-to-image" }
      ].filter(prompt => 
        prompt.name.toLowerCase().includes(lowerTerm) || 
        prompt.description.toLowerCase().includes(lowerTerm)
      );
      
      // Combine and limit results
      const allResults = [...styleResults, ...modelResults, ...promptResults].slice(0, 8);
      setSearchResults(allResults);
    }, 300),
    [stylePresets, aiModels]
  );
  
  // Handle search input
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Handle clicking on a search result
  const handleSearchResultClick = (result: SearchResult) => {
    setSearchTerm("");
    setSearchResults([]);
    
    if (result.path) {
      navigate(result.path);
      
      // If it's a style preset or a prompt, we'd store it for the target page
      // In a real app, we'd use a context or state management for this
      if (result.type === 'style' || result.type === 'prompt') {
        toast({
          title: `${result.type === 'style' ? 'Style' : 'Prompt'} selected`,
          description: `${result.name} is ready to use`,
        });
      }
    }
  };

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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300 z-10"></i>
          <input 
            type="text" 
            placeholder="Search for prompts, styles, or models..." 
            className="w-full pl-10 rounded-lg bg-background/50 border-white/10"
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {/* Animated typing cursor */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-purple-500/50 opacity-0 group-hover:opacity-100 animate-pulse z-10"></span>
          
          {/* Search Results */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md rounded-lg border border-white/10 shadow-lg z-20 max-h-[350px] overflow-y-auto">
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 hover:bg-purple-500/10 cursor-pointer border-b border-white/5 last:border-0 flex items-center gap-3"
                  onClick={() => handleSearchResultClick(result)}
                >
                  {result.type === 'style' && <i className="ri-palette-line text-purple-400"></i>}
                  {result.type === 'model' && <i className="ri-cpu-line text-blue-400"></i>}
                  {result.type === 'prompt' && <i className="ri-chat-1-line text-green-400"></i>}
                  <div>
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-gray-400">{result.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2.5 text-gray-400 relative group">
          <i className="ri-notification-3-line group-hover:text-white transition-colors duration-300"></i>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse-glow"></span>
          
          {/* Notification tooltip */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-background/95 backdrop-blur-md rounded-lg border border-white/10 shadow-lg z-40 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-3 border-b border-white/10">
              <p className="text-xs font-medium">New notifications</p>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto">
              <div className="p-2 hover:bg-purple-500/10 rounded-md cursor-pointer">
                <p className="text-xs font-medium">Your image generation is complete</p>
                <p className="text-xs text-gray-400">Cyberpunk city rendered successfully</p>
                <p className="text-[10px] text-gray-500 mt-1">Just now</p>
              </div>
              <div className="p-2 hover:bg-purple-500/10 rounded-md cursor-pointer">
                <p className="text-xs font-medium">New feature added</p>
                <p className="text-xs text-gray-400">Try the new face cloning technology</p>
                <p className="text-[10px] text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </button>
        
        <button className="p-2.5 text-gray-400 relative group">
          <i className="ri-question-line group-hover:text-white transition-colors duration-300"></i>
          
          {/* Help tooltip */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-background/95 backdrop-blur-md rounded-lg border border-white/10 shadow-lg z-40 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-3">
              <p className="text-xs font-medium">Quick Help</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <i className="ri-magic-line text-purple-400"></i>
                  <p className="text-xs">Use text-to-image for creating from scratch</p>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-image-edit-line text-blue-400"></i>
                  <p className="text-xs">Try image-to-image for modifications</p>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-user-smile-line text-green-400"></i>
                  <p className="text-xs">Face cloning for personalized avatars</p>
                </div>
              </div>
            </div>
          </div>
        </button>
        
        {user && (
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-br from-pink-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 animate-pulse-glow transition-opacity duration-300"></span>
              {user.avatar ? (
                <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm animate-gradient bg-size-200">
                  {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* User dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-md rounded-lg border border-white/10 shadow-lg z-40 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-medium">{user.displayName || user.username}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="p-2">
                <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-500/10 cursor-pointer">
                  <i className="ri-user-line text-purple-400"></i>
                  <span className="text-sm">Profile</span>
                </Link>
                <Link to="/gallery" className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-500/10 cursor-pointer">
                  <i className="ri-gallery-line text-blue-400"></i>
                  <span className="text-sm">My Gallery</span>
                </Link>
                <Link to="/model-tuning" className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-500/10 cursor-pointer">
                  <i className="ri-settings-line text-green-400"></i>
                  <span className="text-sm">Model Tuning</span>
                </Link>
                <div className="border-t border-white/10 mt-2 pt-2">
                  <button 
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-500/10 text-red-400 cursor-pointer w-full text-left"
                  >
                    <i className="ri-logout-box-line"></i>
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!user && (
          <Link to="/login" className="relative z-0 group">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300"
            >
              <span className="relative z-10">Login</span>
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
