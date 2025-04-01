import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  model: text("model").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata"),
});

export const stylePresets = pgTable("style_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  prompt: text("prompt").notNull(),
  category: text("category"),
  isPublic: boolean("is_public").default(true),
});

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  provider: text("provider").notNull(),
  isActive: boolean("is_active").default(true),
  capabilities: jsonb("capabilities"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

export const insertStylePresetSchema = createInsertSchema(stylePresets).omit({
  id: true,
});

export const insertAiModelSchema = createInsertSchema(aiModels).omit({
  id: true,
});

// Types for insert and select
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

export type InsertStylePreset = z.infer<typeof insertStylePresetSchema>;
export type StylePreset = typeof stylePresets.$inferSelect;

export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
export type AiModel = typeof aiModels.$inferSelect;
