import React, { useState } from "react";
import FaceCloningForm from "@/components/ui/image-generation/FaceCloningForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function FaceCloning() {
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
            <h1 className="text-2xl font-bold mb-6">Face Cloning</h1>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-4">
                Upload a face photo and create stunning AI avatars with different styles, expressions, and environments.
              </p>
              
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-cyan-500 text-sm font-medium flex items-center mb-2">
                  <i className="ri-lightbulb-line mr-2"></i>
                  Tips for better face cloning
                </h3>
                <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                  <li>Use clear, front-facing portrait photos</li>
                  <li>Ensure good lighting on the face</li>
                  <li>Choose photos without strong expressions for more neutral results</li>
                  <li>Specify the style and environment in your description</li>
                </ul>
              </div>
            </div>
            
            <FaceCloningForm 
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
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mb-4"></div>
                <p className="text-gray-400">Creating AI avatar...</p>
                <p className="text-xs text-gray-500 mt-2">This may take longer than other generations</p>
              </Card>
            ) : generatedImageUrl ? (
              <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={generatedImageUrl} 
                    alt="AI Avatar" 
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
                        New Avatar
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImageUrl;
                            link.download = 'artifice-ai-avatar.png';
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
                <i className="ri-user-face-line text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400">Your AI avatar will appear here</p>
                <p className="text-xs text-gray-500 mt-2">Upload a face photo and describe the avatar style</p>
              </Card>
            )}
            
            {/* Style Examples */}
            {!isGenerating && !generatedImageUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Avatar Style Examples</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-400 mb-2">Realistic Style</div>
                      <div className="h-32 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Example Avatar</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        "Professional portrait, business attire, neutral background, studio lighting"
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-400 mb-2">Anime Style</div>
                      <div className="h-32 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Example Avatar</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        "Anime character style, vibrant colors, detailed background, expressive"
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
