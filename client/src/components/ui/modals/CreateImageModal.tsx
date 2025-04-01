import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TextToImageForm from "../image-generation/TextToImageForm";
import ImageToImageForm from "../image-generation/ImageToImageForm";
import FaceCloningForm from "../image-generation/FaceCloningForm";
import { motion, AnimatePresence } from "framer-motion";

interface CreateImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export default function CreateImageModal({ 
  isOpen, 
  onClose, 
  initialTab = "text-to-image" 
}: CreateImageModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (url: string) => {
    setGeneratedImageUrl(url);
    setIsGenerating(false);
  };

  const handleClose = () => {
    setGeneratedImageUrl(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-4xl w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Image</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose an AI model and enter your prompt to generate an image
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="text-to-image" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-500 data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
                <i className="ri-text-spacing mr-2"></i>
                Text to Image
              </TabsTrigger>
              <TabsTrigger value="image-to-image" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                <i className="ri-image-edit-fill mr-2"></i>
                Image to Image
              </TabsTrigger>
              <TabsTrigger value="face-cloning" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-500 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500">
                <i className="ri-user-face-line mr-2"></i>
                Face Cloning
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="text-to-image" className="mt-0">
                  <TextToImageForm 
                    onGenerate={handleGenerate} 
                    setIsGenerating={setIsGenerating} 
                  />
                </TabsContent>

                <TabsContent value="image-to-image" className="mt-0">
                  <ImageToImageForm 
                    onGenerate={handleGenerate} 
                    setIsGenerating={setIsGenerating} 
                  />
                </TabsContent>

                <TabsContent value="face-cloning" className="mt-0">
                  <FaceCloningForm 
                    onGenerate={handleGenerate} 
                    setIsGenerating={setIsGenerating} 
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        {generatedImageUrl && (
          <div className="mt-6">
            <Label className="block text-sm font-medium mb-2">Generated Image</Label>
            <div className="rounded-lg overflow-hidden border border-white/10 mb-4">
              <img 
                src={generatedImageUrl} 
                alt="Generated image" 
                className="w-full max-h-[400px] object-contain bg-black/20"
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setGeneratedImageUrl(null)}
              >
                <i className="ri-refresh-line mr-2"></i>
                Create Another
              </Button>
              <Button
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
                Download Image
              </Button>
            </div>
          </div>
        )}

        {!generatedImageUrl && (
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
