import OpenAI from "openai";
import { log } from "./vite";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-dev" 
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

    // Prepare the request
    const response = await openai.images.edit({
      model: "dall-e-3",
      image: typeof request.image === "string" 
        ? fs.createReadStream(request.image) as unknown as File
        : new File([request.image], "image.png") as unknown as File,
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
    // Prepare the request
    const response = await openai.images.edit({
      model: "dall-e-3",
      image: typeof request.image === "string" 
        ? fs.createReadStream(request.image) as unknown as File
        : new File([request.image], "image.png") as unknown as File,
      prompt: `${request.prompt}. 
              Make the changes look natural and well-integrated with the original image.
              Maintain the same lighting, style, and quality as the original image.`,
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

export default {
  editFace,
  editObjects
};