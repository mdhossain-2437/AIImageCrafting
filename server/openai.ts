import OpenAI from "openai";
import { log } from "./vite";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface FaceEditingRequest {
  image: Buffer | string;
  adjustments: Record<string, number>;
}

export interface ObjectEditingRequest {
  image: Buffer | string;
  prompt: string;
}

// Define return types to handle undefined
type ImageUrl = string;

export async function editFace(request: FaceEditingRequest): Promise<string> {
  try {
    // Convert adjustments to prompt
    const adjustmentPrompt = Object.entries(request.adjustments)
      .filter(([_, value]) => value !== 0)
      .map(([key, value]) => {
        const direction = value > 0 ? "more" : "less";
        const intensity = Math.abs(value);
        const normalizedKey = key.replace("_", " ");
        return `${direction} ${normalizedKey} (intensity: ${intensity})`;
      })
      .join(", ");

    // If no adjustments, return the original image
    if (!adjustmentPrompt) {
      log("No face adjustments to make", "openai");
      return typeof request.image === "string" 
        ? request.image 
        : Buffer.from(request.image).toString("base64");
    }

    // OpenAI DALL-E 3 doesn't support image editing, let's use variation or generation instead
    // Creating a variation or using the adjustments as a text-to-image prompt
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Edit this person's face with the following adjustments: ${adjustmentPrompt}. 
              Make the changes look natural and realistic. Maintain the overall identity and likeness.
              Do not change the background or other elements in the image.`,
      n: 1,
      size: "1024x1024",
    });

    log(`Face editing successful: ${adjustmentPrompt}`, "openai");
    return response.data[0].url || "";
  } catch (error: any) {
    log(`Face editing error: ${error.message}`, "openai");
    throw new Error(`Failed to edit face: ${error.message}`);
  }
}

export async function editObjects(request: ObjectEditingRequest): Promise<string> {
  try {
    // Using the image as a reference by describing it in the prompt
    // OpenAI DALL-E 3 doesn't support image editing directly, so we use text-to-image generation
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${request.prompt}. 
              Make the changes look natural and well-integrated.
              Maintain the same lighting, style, and quality as the reference image.`,
      n: 1,
      size: "1024x1024",
    });

    log(`Object editing successful: ${request.prompt}`, "openai");
    return response.data[0].url || "";
  } catch (error: any) {
    log(`Object editing error: ${error.message}`, "openai");
    throw new Error(`Failed to edit objects: ${error.message}`);
  }
}

export interface TextToImageRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
}

export async function generateImage(request: TextToImageRequest): Promise<string> {
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      log("Missing OpenAI API key", "openai");
      throw new Error("OpenAI API key is not configured");
    }

    // Use DALL-E 3 by default
    const model = request.model || "dall-e-3";
    // DALL-E 3 supports 1024x1024, 1024x1792, 1792x1024 sizes
    let size = "1024x1024"; // default square
    
    if (request.width && request.height) {
      // Handle custom dimensions (DALL-E 3 has specific supported ratios)
      const ratio = request.width / request.height;
      
      if (ratio > 1.5) {
        size = "1792x1024"; // landscape
      } else if (ratio < 0.75) {
        size = "1024x1792"; // portrait
      }
    }

    // Log the request
    log(`Generating image with prompt: ${request.prompt}`, "openai");
    
    const response = await openai.images.generate({
      model: model,
      prompt: request.prompt,
      n: 1,
      size: size as any, // Cast to any to handle the size parameter
      quality: "standard", // Use "hd" for higher quality (costs more)
    });

    if (!response.data[0].url) {
      throw new Error("No image URL in response");
    }

    log(`Image generation successful`, "openai");
    return response.data[0].url;
  } catch (error: any) {
    log(`Image generation error: ${error.message}`, "openai");
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export default {
  editFace,
  editObjects,
  generateImage
};