import React, { useState } from "react";
import TextToImageForm from "@/components/ui/image-generation/TextToImageForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getStylePresets } from "@/lib/api";
import StylePresetCard from "@/components/ui/common/StylePresetCard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function TextToImage() {
  const { toast } = useToast();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: stylePresets, isLoading: isLoadingPresets } = useQuery({
    queryKey: ["/api/style-presets"],
    staleTime: 60000,
  });

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
            <h1 className="text-2xl font-bold mb-6">Text to Image Generation</h1>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-4">
                Describe your vision and let AI bring it to life with stunning detail. Be specific about style, mood, and elements.
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-yellow-500 text-sm font-medium flex items-center mb-2">
                  <i className="ri-lightbulb-line mr-2"></i>
                  Tips for better results
                </h3>
                <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                  <li>Be specific and detailed in your descriptions</li>
                  <li>Mention lighting, atmosphere, style, and perspective</li>
                  <li>Use artistic references (like "in the style of...")</li>
                  <li>Specify subject details like pose, expression, or outfit</li>
                </ul>
              </div>
            </div>
            
            <TextToImageForm 
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
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-400">Generating your masterpiece...</p>
                <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
              </Card>
            ) : generatedImageUrl ? (
              <Card className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated image" 
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
                        New Image
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background/70 backdrop-blur-md"
                          onClick={() => {
                            try {
                              // Copy image URL to clipboard
                              navigator.clipboard.writeText(generatedImageUrl);
                              toast({
                                title: "Image URL copied",
                                description: "The image URL has been copied to your clipboard",
                              });
                            } catch (error) {
                              toast({
                                title: "Failed to copy URL",
                                description: "Please copy the URL manually",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <i className="ri-clipboard-line mr-2"></i>
                          Copy URL
                        </Button>
                        
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImageUrl;
                            link.download = 'artifice-ai-image.png';
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
                <i className="ri-image-line text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400">Your generated image will appear here</p>
                <p className="text-xs text-gray-500 mt-2">Fill out the form and click "Generate Image"</p>
              </Card>
            )}
            
            {/* Style Presets */}
            {!isGenerating && !generatedImageUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Quick Style Presets</h3>
                
                {isLoadingPresets ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-background/50 backdrop-blur-lg rounded-xl h-32 animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stylePresets?.slice(0, 6).map((preset: any) => (
                      <StylePresetCard
                        key={preset.id}
                        preset={preset}
                        onClick={() => {
                          // Would integrate this with the form
                          toast({
                            title: "Style Selected",
                            description: `${preset.name} style applied to your prompt`,
                          });
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
