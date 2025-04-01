import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getStylePresets, getUserImages, getAiModels } from "@/lib/api";
import QuickActionCard from "@/components/ui/common/QuickActionCard";
import StylePresetCard from "@/components/ui/common/StylePresetCard";
import AIModelCard from "@/components/ui/common/AIModelCard";
import ImageCard from "@/components/ui/common/ImageCard";
import CreateImageModal from "@/components/ui/modals/CreateImageModal";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Use staleTime to cache API results and prevent unnecessary requests
  const { data: stylePresets = [], isLoading: isLoadingPresets } = useQuery({
    queryKey: ["/api/style-presets"],
    staleTime: 60000, // Cache for 1 minute
  });
  
  const { data: recentImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ["/api/images", user?.id, 4, 0],
    queryFn: () => getUserImages(user?.id, 4, 0),
    staleTime: 30000, // Cache for 30 seconds
    enabled: !!user,
  });
  
  const { data: aiModels = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ["/api/ai-models"],
    staleTime: 60000, // Cache for 1 minute
  });
  
  // Use a regular array since we had issues with the useMemo implementation
  const quickActions = [
    {
      title: "Text to Image",
      description: "Generate stunning images from your text descriptions",
      icon: "ri-text-spacing",
      gradientFrom: "purple-500",
      gradientTo: "blue-500",
      path: "/text-to-image"
    },
    {
      title: "Image to Image",
      description: "Transform your existing images with AI modifications",
      icon: "ri-image-edit-fill",
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
      path: "/image-to-image"
    },
    {
      title: "Face Cloning",
      description: "Create AI avatars by cloning real faces with precision",
      icon: "ri-user-face-line",
      gradientFrom: "cyan-500",
      gradientTo: "blue-500",
      path: "/face-cloning"
    },
    {
      title: "Style Transfer",
      description: "Apply artistic styles to your photos with one click",
      icon: "ri-artboard-line",
      gradientFrom: "purple-500",
      gradientTo: "pink-500",
      path: "/text-to-image"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section 
        className="bg-background/50 backdrop-blur-lg rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-64 overflow-hidden rounded-2xl">
          {/* Background Image/Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633059363120-13b51ccceb72?q=80&w=1920')] bg-cover bg-center opacity-40"></div>
          
          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to ArtificeAI</h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mb-6">
              Create stunning AI-generated art, clone faces, enhance images, and more with our advanced image generation platform.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-6 rounded-full w-fit flex items-center space-x-2 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all"
            >
              <i className="ri-magic-line"></i>
              <span>Create New Image</span>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            gradientFrom={action.gradientFrom}
            gradientTo={action.gradientTo}
            path={action.path}
          />
        ))}
      </motion.section>

      {/* Featured Presets */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Style Presets</h2>
          <Link href="/presets" className="text-sm text-purple-500 hover:underline flex items-center">
            <span>View All</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </Link>
        </div>
        
        {isLoadingPresets ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-background/50 backdrop-blur-lg rounded-xl h-32 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stylePresets.slice(0, 6).map((preset: any) => (
              <StylePresetCard
                key={preset.id}
                preset={preset}
                onClick={() => {
                  setIsCreateModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Recent Creations (if user is logged in) */}
      {user && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Recent Creations</h2>
            <Link href="/gallery" className="text-sm text-purple-500 hover:underline flex items-center">
              <span>View All</span>
              <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
          
          {isLoadingImages ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-background/50 backdrop-blur-lg rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : recentImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentImages.map((image: any) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onClick={() => {
                    // View image details
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-background/50 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="flex flex-col items-center">
                <i className="ri-image-line text-4xl text-gray-500 mb-2"></i>
                <h3 className="text-lg font-medium mb-2">No images yet</h3>
                <p className="text-gray-400 mb-4">Start creating amazing AI-generated images!</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  Create Your First Image
                </Button>
              </div>
            </div>
          )}
        </motion.section>
      )}

      {/* AI Models */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Available AI Models</h2>
          <Link href="/models" className="text-sm text-purple-500 hover:underline flex items-center">
            <span>Compare Models</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </Link>
        </div>
        
        {isLoadingModels ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-background/50 backdrop-blur-lg rounded-xl h-60 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiModels.map((model: any) => (
              <AIModelCard
                key={model.id}
                model={model}
                onSelect={() => {
                  setIsCreateModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </motion.section>
      
      {/* Create Image Modal */}
      <CreateImageModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
