import { z as zod } from "zod";

export const registerSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = zod.object({
  email: zod.email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

export const googleLoginSchema = zod.object({
  idToken: zod.string().nonempty("idToken is required"),
});

export type RegisterInput = zod.infer<typeof registerSchema>;
export type LoginInput = zod.infer<typeof loginSchema>;
export type GoogleLoginInput = zod.infer<typeof googleLoginSchema>;
