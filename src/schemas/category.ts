import {z} from "zod";

// Category schema for read operations
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  goalCount: z.number().optional(),
});

export type Category = z.infer<typeof categorySchema>;

// Schema for creating category
export const categoryCreateSchema = z.object({
  name: z.string().min(2, {message: "Name must be at least 2 characters"}).max(50, {message: "Name cannot exceed 50 characters"}),
});

export type CategoryCreateFields = z.infer<typeof categoryCreateSchema>;

// Schema for updating category (same as create)
export const categoryUpdateSchema = categoryCreateSchema;

export type CategoryUpdateFields = z.infer<typeof categoryUpdateSchema>;
