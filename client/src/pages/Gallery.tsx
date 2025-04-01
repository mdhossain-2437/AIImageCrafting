import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserImages } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageCard from "@/components/ui/common/ImageCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function Gallery() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const limit = 12;
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/images", user?.id, limit, (page - 1) * limit],
    queryFn: () => getUserImages(user?.id, limit, (page - 1) * limit),
    enabled: !!user,
  });
  
  const images = data || [];
  const totalPages = Math.ceil((data?.length || 0) / limit) || 1;
  
  // Apply filters
  const filteredImages = images.filter((image: any) => {
    // Search term filter
    const matchesSearch = searchTerm.trim() === "" || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Model filter
    const matchesFilter = selectedFilter === "all" || image.model === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsImageDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Gallery</h1>
            <p className="text-gray-400 mt-1">View, search, and organize your AI-generated images</p>
          </div>
          
          <div className="flex gap-2 self-end">
            <Button variant="outline" className="border-white/10">
              <i className="ri-folders-line mr-2"></i>
              Create Folder
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <i className="ri-add-line mr-2"></i>
              New Image
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-background/50 backdrop-blur-lg rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <Input
                type="text"
                placeholder="Search by title or prompt..."
                className="bg-background/50 border-white/10 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Filter by model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="dalle">DALL-E 3</SelectItem>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select defaultValue="newest">
                <SelectTrigger className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Image Grid */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Images</TabsTrigger>
              <TabsTrigger value="favorite">Favorites</TabsTrigger>
              <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
              <TabsTrigger value="image-to-image">Image to Image</TabsTrigger>
              <TabsTrigger value="face-cloning">Face Cloning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-background/50 backdrop-blur-lg rounded-xl h-64 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredImages.map((image: any) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-background/50 backdrop-blur-lg rounded-xl p-8 text-center">
                  <div className="flex flex-col items-center">
                    <i className="ri-image-line text-4xl text-gray-500 mb-4"></i>
                    <h3 className="text-lg font-medium mb-2">No images found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm || selectedFilter !== "all" 
                        ? "Try changing your filters or search term" 
                        : "Start creating amazing AI-generated images!"}
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedFilter("all");
                      }}
                    >
                      {searchTerm || selectedFilter !== "all" 
                        ? "Clear Filters" 
                        : "Create Your First Image"}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Other tabs would have similar content structure */}
            <TabsContent value="favorite">
              <div className="bg-background/50 backdrop-blur-lg rounded-xl p-8 text-center">
                <div className="flex flex-col items-center">
                  <i className="ri-heart-line text-4xl text-gray-500 mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-gray-400 mb-4">
                    Mark images as favorites to find them quickly here
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="text-to-image">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages
                  .filter((image: any) => !image.metadata?.originalImage && !image.metadata?.faceCloning)
                  .map((image: any) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="image-to-image">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages
                  .filter((image: any) => image.metadata?.originalImage)
                  .map((image: any) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="face-cloning">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages
                  .filter((image: any) => image.metadata?.faceCloning)
                  .map((image: any) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Pagination */}
        {filteredImages.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <Button 
                variant="outline" 
                className="border-white/10"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center mx-4">
                Page {page} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                className="border-white/10"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </Pagination>
          </div>
        )}
      </motion.div>
      
      {/* Image Details Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="bg-background/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-2">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="w-full h-auto max-h-[500px] object-contain bg-black/20 rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Prompt</h3>
                  <p className="text-sm mt-1">{selectedImage.prompt}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-400">Model</p>
                      <p className="text-sm">{selectedImage.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Dimensions</p>
                      <p className="text-sm">{selectedImage.width} x {selectedImage.height}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="text-sm">{new Date(selectedImage.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 pt-4">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-full">
                    <i className="ri-download-line mr-2"></i>
                    Download Image
                  </Button>
                  <Button variant="outline" className="border-white/10 w-full">
                    <i className="ri-share-line mr-2"></i>
                    Share Image
                  </Button>
                  <Button variant="outline" className="border-white/10 w-full">
                    <i className="ri-edit-line mr-2"></i>
                    Use as Base Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
