import { useState } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { 
  generateTextToImage, 
  generateImageToImage, 
  generateFaceCloning,
  type GenerateImageResponse
} from "@/lib/api";

interface UseImageGenerationResult {
  isGenerating: boolean;
  imageUrl: string | null;
  generate: (params: any) => Promise<void>;
  reset: () => void;
}

export function useImageGeneration(): UseImageGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleResponse = (response: GenerateImageResponse) => {
    if (response.success && response.imageUrl) {
      setImageUrl(response.imageUrl);
    } else {
      throw new Error("Failed to generate image");
    }
  };

  const generate = async (params: any) => {
    try {
      setIsGenerating(true);
      
      let response: GenerateImageResponse;
      
      // Add user ID to the params if user is logged in
      const paramsWithUser = user ? { ...params, userId: user.id } : params;
      
      if (params.type === "text-to-image") {
        const { prompt, model, width, height } = params;
        response = await generateTextToImage({ 
          prompt, 
          model, 
          width: width || 1024, 
          height: height || 1024,
          userId: user?.id 
        });
      } else if (params.type === "image-to-image") {
        const { image, prompt, model, strength } = params;
        response = await generateImageToImage({ 
          image, 
          prompt, 
          model, 
          strength: strength || 0.7,
          userId: user?.id
        });
      } else if (params.type === "face-cloning") {
        const { face, prompt, model } = params;
        response = await generateFaceCloning({ 
          face, 
          prompt, 
          model,
          userId: user?.id
        });
      } else {
        throw new Error("Invalid generation type");
      }
      
      handleResponse(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during image generation";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setImageUrl(null);
  };

  return {
    isGenerating,
    imageUrl,
    generate,
    reset
  };
}
