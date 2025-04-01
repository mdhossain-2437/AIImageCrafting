import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fetch from "node-fetch";
import sharp from "sharp";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { insertImageSchema, insertUserSchema } from "@shared/schema";
import openai from "./openai";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Ensure uploads directory exists
const tempUploadDir = path.join(process.cwd(), "temp_uploads");
async function ensureUploadsDirExists() {
  try {
    await fs.mkdir(tempUploadDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create uploads directory:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureUploadsDirExists();

  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we'd use proper password hashing and JWT
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Image generation routes
  app.post("/api/images/text-to-image", async (req: Request, res: Response) => {
    try {
      const { prompt, model, width = 1024, height = 1024, userId } = req.body;
      
      if (!prompt || !model) {
        return res.status(400).json({ message: "Prompt and model are required" });
      }
      
      // Call different AI models based on the selection
      let imageUrl;
      
      if (model === "dalle") {
        // Call DALL-E API
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY || ""}`
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: `${width}x${height}`,
            model: "dall-e-3"
          })
        });
        
        const data = await response.json();
        imageUrl = data.data?.[0]?.url;
      } else if (model === "stable-diffusion") {
        // Call Stable Diffusion API
        // Implementation depends on the specific API
        imageUrl = "https://placeholder-for-stable-diffusion-generated-image.com/image.jpg";
      }
      
      if (!imageUrl) {
        return res.status(500).json({ message: "Failed to generate image" });
      }
      
      // Store the generated image if userId is provided
      let savedImage = null;
      if (userId) {
        savedImage = await storage.createImage({
          userId: parseInt(userId),
          title: prompt.slice(0, 50),
          prompt,
          imageUrl,
          width,
          height,
          model,
          metadata: { fullPrompt: prompt }
        });
      }
      
      res.status(200).json({ 
        success: true,
        imageUrl,
        image: savedImage
      });
    } catch (error) {
      console.error("Text-to-image generation error:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  app.post("/api/images/image-to-image", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const { prompt, model, strength = 0.8, userId } = req.body;
      const imageFile = req.file;
      
      if (!imageFile || !prompt || !model) {
        return res.status(400).json({ message: "Image, prompt, and model are required" });
      }
      
      // Process the uploaded image
      const processedImageBuffer = await sharp(imageFile.buffer)
        .resize(1024, 1024, { fit: "inside" })
        .toBuffer();
      
      // Save temporarily to disk
      const tempFilename = `${randomUUID()}.png`;
      const tempFilePath = path.join(tempUploadDir, tempFilename);
      await fs.writeFile(tempFilePath, processedImageBuffer);
      
      // Call the appropriate API (this is a placeholder)
      let responseImageUrl = "https://placeholder-for-image-to-image-result.com/image.jpg";
      
      // In a real implementation, we would call the appropriate API here
      // For example, OpenAI doesn't currently support image-to-image directly
      // So you might use Stable Diffusion API instead
      
      // Clean up temp file
      await fs.unlink(tempFilePath);
      
      // Store the generated image if userId is provided
      let savedImage = null;
      if (userId) {
        savedImage = await storage.createImage({
          userId: parseInt(userId),
          title: prompt.slice(0, 50),
          prompt,
          imageUrl: responseImageUrl,
          width: 1024,
          height: 1024,
          model,
          metadata: { originalImage: true, strength }
        });
      }
      
      res.status(200).json({
        success: true,
        imageUrl: responseImageUrl,
        image: savedImage
      });
    } catch (error) {
      console.error("Image-to-image generation error:", error);
      res.status(500).json({ message: "Failed to process image-to-image transformation" });
    }
  });

  app.post("/api/images/face-cloning", upload.single("face"), async (req: Request, res: Response) => {
    try {
      const { prompt, model, userId } = req.body;
      const faceImage = req.file;
      
      if (!faceImage || !prompt || !model) {
        return res.status(400).json({ message: "Face image, prompt, and model are required" });
      }
      
      // Process the uploaded face image
      const processedFaceBuffer = await sharp(faceImage.buffer)
        .resize(512, 512, { fit: "cover" })
        .toBuffer();
      
      // Save temporarily to disk
      const tempFilename = `${randomUUID()}.png`;
      const tempFilePath = path.join(tempUploadDir, tempFilename);
      await fs.writeFile(tempFilePath, processedFaceBuffer);
      
      // In a real implementation, we would call the appropriate face cloning API here
      // This is a placeholder
      const responseImageUrl = "https://placeholder-for-face-cloning-result.com/image.jpg";
      
      // Clean up temp file
      await fs.unlink(tempFilePath);
      
      // Store the generated image if userId is provided
      let savedImage = null;
      if (userId) {
        savedImage = await storage.createImage({
          userId: parseInt(userId),
          title: "Face Clone: " + prompt.slice(0, 40),
          prompt,
          imageUrl: responseImageUrl,
          width: 1024,
          height: 1024,
          model,
          metadata: { faceCloning: true }
        });
      }
      
      res.status(200).json({
        success: true,
        imageUrl: responseImageUrl,
        image: savedImage
      });
    } catch (error) {
      console.error("Face cloning error:", error);
      res.status(500).json({ message: "Failed to process face cloning" });
    }
  });

  // Image gallery routes
  app.get("/api/images", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const images = await storage.getImages(userId, limit, offset);
      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.get("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.id);
      const image = await storage.getImage(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  // Style presets routes
  app.get("/api/style-presets", async (req: Request, res: Response) => {
    try {
      const presets = await storage.getStylePresets();
      res.status(200).json(presets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch style presets" });
    }
  });

  // Face & Object Editing routes
  app.post("/api/images/edit-face", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const { adjustments, userId } = req.body;
      const imageFile = req.file;
      
      if (!imageFile || !adjustments) {
        return res.status(400).json({ message: "Image and adjustments are required" });
      }
      
      // Process the uploaded image
      const processedImageBuffer = await sharp(imageFile.buffer)
        .resize(1024, 1024, { fit: "contain" })
        .toBuffer();
      
      // Parse adjustments from JSON string if needed
      const parsedAdjustments = typeof adjustments === "string" 
        ? JSON.parse(adjustments) 
        : adjustments;
      
      // Call OpenAI for face editing
      const imageUrl = await openai.editFace({
        image: processedImageBuffer,
        adjustments: parsedAdjustments,
      });
      
      // Store the generated image if userId is provided
      let savedImage = null;
      if (userId) {
        savedImage = await storage.createImage({
          userId: parseInt(userId),
          title: "Face Edit",
          prompt: "Face editing with adjustments: " + JSON.stringify(parsedAdjustments),
          imageUrl,
          width: 1024,
          height: 1024,
          model: "dalle",
          metadata: { faceEditing: true, adjustments: parsedAdjustments }
        });
      }
      
      res.status(200).json({
        success: true,
        imageUrl,
        image: savedImage
      });
    } catch (error) {
      console.error("Face editing error:", error);
      res.status(500).json({ message: "Failed to edit face" });
    }
  });
  
  app.post("/api/images/edit-objects", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const { prompt, userId } = req.body;
      const imageFile = req.file;
      
      if (!imageFile || !prompt) {
        return res.status(400).json({ message: "Image and prompt are required" });
      }
      
      // Process the uploaded image
      const processedImageBuffer = await sharp(imageFile.buffer)
        .resize(1024, 1024, { fit: "contain" })
        .toBuffer();
      
      // Call OpenAI for object editing
      const imageUrl = await openai.editObjects({
        image: processedImageBuffer,
        prompt,
      });
      
      // Store the generated image if userId is provided
      let savedImage = null;
      if (userId) {
        savedImage = await storage.createImage({
          userId: parseInt(userId),
          title: prompt.slice(0, 50),
          prompt,
          imageUrl,
          width: 1024,
          height: 1024,
          model: "dalle",
          metadata: { objectEditing: true }
        });
      }
      
      res.status(200).json({
        success: true,
        imageUrl,
        image: savedImage
      });
    } catch (error) {
      console.error("Object editing error:", error);
      res.status(500).json({ message: "Failed to edit objects" });
    }
  });

  // AI Models routes
  app.get("/api/ai-models", async (req: Request, res: Response) => {
    try {
      const models = await storage.getAiModels();
      res.status(200).json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  // Model Tuning routes
  app.get("/api/model-tunings", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const tunings = await storage.getModelTunings(userId);
      
      // Enhance response with model names for easier display
      const enhanced = await Promise.all(tunings.map(async (tuning) => {
        const model = await storage.getAiModel(tuning.modelId);
        return {
          ...tuning,
          modelName: model?.name || 'Unknown model'
        };
      }));
      
      res.status(200).json(enhanced);
    } catch (error) {
      console.error("Error fetching model tunings:", error);
      res.status(500).json({ message: "Failed to fetch model tunings" });
    }
  });

  app.get("/api/model-tunings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tuning = await storage.getModelTuning(id);
      
      if (!tuning) {
        return res.status(404).json({ message: "Model tuning not found" });
      }
      
      // Enhance with model name
      const model = await storage.getAiModel(tuning.modelId);
      const enhanced = {
        ...tuning,
        modelName: model?.name || 'Unknown model'
      };
      
      res.status(200).json(enhanced);
    } catch (error) {
      console.error("Error fetching model tuning:", error);
      res.status(500).json({ message: "Failed to fetch model tuning" });
    }
  });

  app.post("/api/model-tunings", async (req: Request, res: Response) => {
    try {
      // Parse and validate the request body
      const { name, description, modelId, parameters, userId } = req.body;
      
      if (!name || !modelId || !parameters) {
        return res.status(400).json({ 
          message: "Required fields missing", 
          required: ['name', 'modelId', 'parameters'] 
        });
      }
      
      // Create model tuning
      const tuning = await storage.createModelTuning({
        name,
        description,
        modelId: parseInt(modelId),
        userId: userId ? parseInt(userId) : null,
        parameters
      });
      
      res.status(201).json(tuning);
    } catch (error) {
      console.error("Error creating model tuning:", error);
      res.status(500).json({ message: "Failed to create model tuning" });
    }
  });

  app.patch("/api/model-tunings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tuning = await storage.getModelTuning(id);
      
      if (!tuning) {
        return res.status(404).json({ message: "Model tuning not found" });
      }
      
      // Update model tuning
      const updated = await storage.updateModelTuning(id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating model tuning:", error);
      res.status(500).json({ message: "Failed to update model tuning" });
    }
  });

  app.delete("/api/model-tunings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteModelTuning(id);
      
      if (!success) {
        return res.status(404).json({ message: "Model tuning not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting model tuning:", error);
      res.status(500).json({ message: "Failed to delete model tuning" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
