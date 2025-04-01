import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <p className="text-xl mb-4">Please login to view your profile</p>
        <Link to="/login" className="text-purple-500 hover:text-purple-600">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        User Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <div className="bg-background/40 backdrop-blur-md rounded-xl border border-white/10 p-6 sticky top-20">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 relative overflow-hidden hover:shadow-[0_0_25px_rgba(219,39,119,0.4)] transition-all duration-500 mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl font-semibold text-white">
                    {(user.displayName || user.username || "User").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-1">{user.displayName || user.username}</h2>
              <p className="text-sm text-gray-400 mb-4">{user.email}</p>
              
              <button className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 mb-2 transition-colors duration-300">
                Change Avatar
              </button>
            </div>
            
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors duration-300">
                  <i className="ri-settings-3-line text-purple-400"></i>
                  <span>Account Settings</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors duration-300">
                  <i className="ri-palette-line text-blue-400"></i>
                  <span>Appearance</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors duration-300">
                  <i className="ri-shield-line text-green-400"></i>
                  <span>Privacy & Security</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Profile Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-2 space-y-6"
        >
          {/* Stats Overview */}
          <div className="bg-background/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Stats Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-white/5">
                <p className="text-sm text-gray-400">Total Images</p>
                <p className="text-2xl font-semibold mt-1">124</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-white/5">
                <p className="text-sm text-gray-400">Custom Models</p>
                <p className="text-2xl font-semibold mt-1">7</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-white/5">
                <p className="text-sm text-gray-400">Saved Prompts</p>
                <p className="text-2xl font-semibold mt-1">32</p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-background/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <i className="ri-image-line text-purple-400"></i>
                  </div>
                  <div>
                    <p className="font-medium">Generated a new image</p>
                    <p className="text-sm text-gray-400">Used the text prompt "Cyberpunk city with neon lights"</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    <i className="ri-user-smile-line text-pink-400"></i>
                  </div>
                  <div>
                    <p className="font-medium">Created avatar from face</p>
                    <p className="text-sm text-gray-400">Used the face cloning feature with style "Anime"</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                    <i className="ri-settings-line text-green-400"></i>
                  </div>
                  <div>
                    <p className="font-medium">Tuned custom model</p>
                    <p className="text-sm text-gray-400">Adjusted parameters for "Portrait Photography" model</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm text-purple-400 hover:text-purple-300">View all activity</button>
            </div>
          </div>
          
          {/* Favorite Prompts/Models */}
          <div className="bg-background/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Favorite Prompts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <div>
                    <p className="font-medium">Fantasy Landscape</p>
                    <p className="text-sm text-gray-400 truncate">A magical world with floating islands...</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <div>
                    <p className="font-medium">Cyberpunk Portrait</p>
                    <p className="text-sm text-gray-400 truncate">Futuristic character with cybernetic...</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <div>
                    <p className="font-medium">Abstract Art</p>
                    <p className="text-sm text-gray-400 truncate">Vibrant colors and organic shapes...</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <div>
                    <p className="font-medium">Sci-Fi Environment</p>
                    <p className="text-sm text-gray-400 truncate">Alien world with strange vegetation...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}