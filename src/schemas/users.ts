import {z} from "zod";

// User signup schema (matches UserSignupDto)
export const userSignupSchema = z.object({
  username: z.string().min(2, {message: "Username must be between 2 and 50 characters"}).max(50),
  email: z.string().email({message: "Invalid email address"}).max(100),
  password: z.string().regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W).{8,}$/,
    {message: "Password must contain at least one uppercase, one lowercase, one digit, and one special character"}
  ),
  firstname: z.string().min(2, {message: "Firstname must be between 2 and 50 characters"}).max(50),
  lastname: z.string().min(2, {message: "Lastname must be between 2 and 50 characters"}).max(50),
});

export type UserSignupFields = z.infer<typeof userSignupSchema>;

// User readonly schema (matches UserReadOnlyDto)
export const userReadOnlySchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  userRole: z.string(),
});

export type UserReadOnly = z.infer<typeof userReadOnlySchema>;

// User roles enum (matches backend UserRole enum)
export const UserRole = {
  SuperAdmin: "SuperAdmin",
  Admin: "Admin",
  User: "User",
} as const;

export type UserRole = keyof typeof UserRole;


// User update schema (matches UserUpdateDto)
export const userUpdateSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  email: z.string().email().max(100).optional(),
  firstname: z.string().min(2).max(50).optional(),
  lastname: z.string().min(2).max(50).optional(),
  userRole: z.enum(["SuperAdmin", "Admin", "User"]).optional(),
});

export type UserUpdateFields = z.infer<typeof userUpdateSchema>;

// Paginated result type
export type PaginatedResult<T> = {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
};
