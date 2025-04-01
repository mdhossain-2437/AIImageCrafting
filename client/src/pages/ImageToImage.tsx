import React, { useState } from "react";
import ImageToImageForm from "@/components/ui/image-generation/ImageToImageForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ImageToImage() {
  const { toast } = useToast();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Form */}
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-6">Image to Image Transformation</h1>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-4">
                Upload an existing image and transform it using AI. Describe how you want to modify the image.
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-blue-500 text-sm font-medium flex items-center mb-2">
                  <i className="ri-lightbulb-line mr-2"></i>
                  Tips for better transformations
                </h3>
                <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                  <li>Use clear, high-quality source images</li>
                  <li>Specify what should change and what should remain the same</li>
                  <li>Adjust the transformation strength based on how much change you want</li>
                  <li>Be specific about style changes (e.g., "turn into watercolor painting")</li>
                </ul>
              </div>
            </div>
            
            <ImageToImageForm 
              onGenerate={handleGenerate} 
              setIsGenerating={setIsGenerating} 
            />
          </motion.div>
        </div>
        
        {/* Right column - Preview/Result */}
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            {isGenerating ? (
              <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6 h-96 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">Transforming your image...</p>
                <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
              </Card>
            ) : generatedImageUrl ? (
              <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={generatedImageUrl} 
                    alt="Transformed image" 
                    className="w-full h-[400px] object-contain bg-black/20"
                  />
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background to-transparent p-4">
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background/70 backdrop-blur-md"
                        onClick={() => setGeneratedImageUrl(null)}
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        New Transformation
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImageUrl;
                            link.download = 'artifice-ai-transformed.png';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <i className="ri-download-line mr-2"></i>
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6 h-96 flex flex-col items-center justify-center">
                <i className="ri-image-edit-line text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400">Your transformed image will appear here</p>
                <p className="text-xs text-gray-500 mt-2">Upload an image and describe the transformation</p>
              </Card>
            )}
            
            {/* Examples Section */}
            {!isGenerating && !generatedImageUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Example Transformations</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-400 mb-2">Original → Oil Painting</div>
                      <div className="h-32 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Example Image</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        "Transform into a detailed oil painting with brush strokes, warm colors"
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-400 mb-2">Original → Cyberpunk</div>
                      <div className="h-32 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Example Image</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        "Convert to cyberpunk style with neon lights, futuristic elements"
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
