import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W).{12,}$/,
    {message: "Password must be at least 12 characters and contain at least one uppercase, one lowercase, one digit and one special character"}
  ),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
