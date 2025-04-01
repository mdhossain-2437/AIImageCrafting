import { 
  User, InsertUser, 
  Image, InsertImage, 
  StylePreset, InsertStylePreset, 
  AiModel, InsertAiModel 
} from "@shared/schema";

// Extend storage interface with all needed methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Image methods
  getImage(id: number): Promise<Image | undefined>;
  getImages(userId?: number, limit?: number, offset?: number): Promise<Image[]>;
  createImage(image: InsertImage): Promise<Image>;
  
  // Style presets methods
  getStylePreset(id: number): Promise<StylePreset | undefined>;
  getStylePresets(): Promise<StylePreset[]>;
  createStylePreset(preset: InsertStylePreset): Promise<StylePreset>;
  
  // AI models methods
  getAiModel(id: number): Promise<AiModel | undefined>;
  getAiModels(): Promise<AiModel[]>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private images: Map<number, Image>;
  private stylePresets: Map<number, StylePreset>;
  private aiModels: Map<number, AiModel>;
  
  private currentUserId: number;
  private currentImageId: number;
  private currentPresetId: number;
  private currentModelId: number;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.stylePresets = new Map();
    this.aiModels = new Map();
    
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.currentPresetId = 1;
    this.currentModelId = 1;
    
    // Initialize with default style presets
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add some default style presets
    const defaultPresets: InsertStylePreset[] = [
      {
        name: "Cyberpunk",
        description: "Neon-lit urban dystopia with high tech and low life aesthetics",
        thumbnailUrl: "https://images.unsplash.com/photo-1508695666381-69deeaa78ccb?q=80&w=424",
        prompt: "cyberpunk style, neon lights, dystopian future, high technology, urban night scene",
        category: "Sci-Fi",
        isPublic: true
      },
      {
        name: "Oil Painting",
        description: "Classic oil painting style with rich textures and colors",
        thumbnailUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=424",
        prompt: "oil painting style, textured canvas, rich colors, painterly strokes, artistic",
        category: "Art",
        isPublic: true
      },
      {
        name: "Anime",
        description: "Japanese anime style illustration with vibrant colors",
        thumbnailUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=424",
        prompt: "anime style, vibrant colors, clean lines, Japanese animation, stylized characters",
        category: "Illustration",
        isPublic: true
      },
      {
        name: "Fantasy",
        description: "Epic fantasy worlds with magical elements and landscapes",
        thumbnailUrl: "https://images.unsplash.com/photo-1535263531122-04b6c6f3a7ca?q=80&w=424",
        prompt: "fantasy style, magical world, epic landscape, mythical creatures, fairy tale atmosphere",
        category: "Fantasy",
        isPublic: true
      },
      {
        name: "Photorealistic",
        description: "Ultra-realistic images that look like real photographs",
        thumbnailUrl: "https://images.unsplash.com/photo-1482501157762-56897a411e05?q=80&w=424",
        prompt: "photorealistic, ultra detailed, high resolution, professional photography, hyper realistic",
        category: "Photography",
        isPublic: true
      },
      {
        name: "Neon",
        description: "Vibrant neon aesthetic with glowing elements and dark backgrounds",
        thumbnailUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=424",
        prompt: "neon style, vibrant glowing lights, dark background, high contrast, synthwave aesthetic",
        category: "Modern",
        isPublic: true
      }
    ];
    
    for (const preset of defaultPresets) {
      this.createStylePreset(preset);
    }
    
    // Add default AI models
    const defaultModels: InsertAiModel[] = [
      {
        name: "DALL-E 3",
        description: "OpenAI's most advanced text-to-image model with exceptional photorealism and prompt following.",
        provider: "OpenAI",
        isActive: true,
        capabilities: {
          tags: ["Photorealistic", "Artistic", "High Detail"],
          maxResolution: "1024x1024"
        }
      },
      {
        name: "Stable Diffusion",
        description: "Versatile open-source model with excellent style transfer and artistic capabilities.",
        provider: "Stability AI",
        isActive: true,
        capabilities: {
          tags: ["Stylized", "Open Source", "Fast"],
          maxResolution: "1024x1024"
        }
      },
      {
        name: "Gemini Vision",
        description: "Google's multimodal AI with excellent image understanding and generation capabilities.",
        provider: "Google",
        isActive: false,
        capabilities: {
          tags: ["Multimodal", "Versatile", "Advanced"],
          maxResolution: "1024x1024"
        }
      }
    ];
    
    for (const model of defaultModels) {
      this.createAiModel(model);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Image methods
  async getImage(id: number): Promise<Image | undefined> {
    return this.images.get(id);
  }
  
  async getImages(userId?: number, limit: number = 20, offset: number = 0): Promise<Image[]> {
    let result = Array.from(this.images.values());
    
    if (userId) {
      result = result.filter(image => image.userId === userId);
    }
    
    // Sort by creation date, newest first
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return result.slice(offset, offset + limit);
  }
  
  async createImage(insertImage: InsertImage): Promise<Image> {
    const id = this.currentImageId++;
    const createdAt = new Date();
    const image: Image = { ...insertImage, id, createdAt };
    this.images.set(id, image);
    return image;
  }
  
  // Style presets methods
  async getStylePreset(id: number): Promise<StylePreset | undefined> {
    return this.stylePresets.get(id);
  }
  
  async getStylePresets(): Promise<StylePreset[]> {
    return Array.from(this.stylePresets.values());
  }
  
  async createStylePreset(insertPreset: InsertStylePreset): Promise<StylePreset> {
    const id = this.currentPresetId++;
    const preset: StylePreset = { ...insertPreset, id };
    this.stylePresets.set(id, preset);
    return preset;
  }
  
  // AI models methods
  async getAiModel(id: number): Promise<AiModel | undefined> {
    return this.aiModels.get(id);
  }
  
  async getAiModels(): Promise<AiModel[]> {
    return Array.from(this.aiModels.values());
  }
  
  async createAiModel(insertModel: InsertAiModel): Promise<AiModel> {
    const id = this.currentModelId++;
    const model: AiModel = { ...insertModel, id };
    this.aiModels.set(id, model);
    return model;
  }
}

export const storage = new MemStorage();
