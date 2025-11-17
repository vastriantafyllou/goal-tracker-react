import {z} from "zod";

// GoalStatus enum matching backend
export const goalStatusEnum = z.enum(["InProgress", "Completed", "Cancelled"]);
export type GoalStatus = z.infer<typeof goalStatusEnum>;

// Schema for creating a new goal (matches GoalCreateDto)
export const goalCreateSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters"}).max(100, {message: "Title must not exceed 100 characters"}),
  description: z.string().max(500, {message: "Description cannot exceed 500 characters"}).optional(),
  dueDate: z.string().optional(), // ISO date string
  goalCategoryId: z.number().optional(),
});

export type GoalCreateFields = z.infer<typeof goalCreateSchema>;

// Schema for updating a goal (matches GoalUpdateDto)
export const goalUpdateSchema = z.object({
  title: z.string().min(3, {message: "Title must be at least 3 characters"}).max(100, {message: "Title must not exceed 100 characters"}),
  description: z.string().max(500, {message: "Description cannot exceed 500 characters"}).optional(),
  dueDate: z.string().optional(),
  status: goalStatusEnum,
  goalCategoryId: z.number().optional(),
});

export type GoalUpdateFields = z.infer<typeof goalUpdateSchema>;

// ReadOnly Goal (matches GoalReadOnlyDto)
export const goalSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional().nullable(),
  status: z.string(), // Backend sends as string
  dueDate: z.string().optional().nullable(),
  createdDate: z.string(),
  goalCategoryId: z.number().optional().nullable(),
  categoryName: z.string().optional().nullable(),
});

export type Goal = z.infer<typeof goalSchema>;
