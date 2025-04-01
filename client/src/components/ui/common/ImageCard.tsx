import React from "react";
import { Card } from "@/components/ui/card";
import { Image } from "@shared/schema";
import { motion } from "framer-motion";

interface ImageCardProps {
  image: Image;
  onClick?: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden group relative cursor-pointer" onClick={onClick}>
      <div className="h-64 overflow-hidden">
        <img 
          src={image.imageUrl} 
          alt={image.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium truncate">{image.title}</h3>
          <span className="text-xs text-gray-400">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate">Created with {image.model}</p>
      </div>
      
      {/* Overlay actions */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex space-x-2 mb-16">
          <button 
            className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]"
            onClick={(e) => {
              e.stopPropagation();
              // Create a temporary link to download the image
              const link = document.createElement('a');
              link.href = image.imageUrl;
              link.download = `${image.title || 'artifice-ai-image'}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <i className="ri-download-line"></i>
          </button>
          <button 
            className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]"
            onClick={(e) => {
              e.stopPropagation();
              // Open edit modal or page
            }}
          >
            <i className="ri-edit-line"></i>
          </button>
          <button 
            className="bg-background/50 backdrop-blur-lg p-2 rounded-lg text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: image.title,
                  text: `Check out this AI-generated image: ${image.title}`,
                  url: image.imageUrl,
                });
              } else {
                // Fallback - copy URL to clipboard
                navigator.clipboard.writeText(image.imageUrl);
                alert('Image URL copied to clipboard!');
              }
            }}
          >
            <i className="ri-share-line"></i>
          </button>
        </div>
      </motion.div>
    </Card>
  );
}
