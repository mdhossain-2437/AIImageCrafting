import React from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Simplified App component to help with debugging
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          ArtificeAI
        </h1>
        <div className="max-w-md text-center mb-8">
          <p className="mb-4">
            Advanced AI Image Generation Platform
          </p>
          <p className="text-gray-400 text-sm">
            This is a simplified version to verify the basic app structure is working.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          <div 
            className="bg-background/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
                <i className="ri-text-spacing text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Text to Image</h3>
              <p className="text-gray-400 text-sm text-center">
                Generate images from text descriptions using AI
              </p>
            </div>
          </div>
          
          <div 
            className="bg-background/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
                <i className="ri-image-edit-fill text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Image to Image</h3>
              <p className="text-gray-400 text-sm text-center">
                Transform existing images using AI
              </p>
            </div>
          </div>
          
          <div 
            className="bg-background/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mb-4">
                <i className="ri-user-face-line text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Cloning</h3>
              <p className="text-gray-400 text-sm text-center">
                Create AI avatars from face photos
              </p>
            </div>
          </div>
          
          <div 
            className="bg-background/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                <i className="ri-gallery-line text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gallery</h3>
              <p className="text-gray-400 text-sm text-center">
                View and manage your AI-generated images
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
