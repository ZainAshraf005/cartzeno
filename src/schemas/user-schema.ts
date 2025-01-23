// src/schemas/userSchema.ts
import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const productSchema = z.object({
  title: z.string().min(2, "title must of 3 letters"),
  price: z.number().min(1, "price must be at least 1 usd"),
  description: z
    .string()
    .min(10, "description must be atleast 10 letters long."),
  stock: z.number().min(10, "stock must be atleast of 10 items"),
  categoryId: z.string().min(1, "categoryId is required"),
});

// Export the type for TypeScript inference
export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
