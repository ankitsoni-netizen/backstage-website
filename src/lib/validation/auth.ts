import { z } from "zod";

export const signInWithPasswordSchema = z.object({
  email: z.email(),
  next: z.string().optional(),
  password: z.string().min(1),
});

export const requestPasswordResetSchema = z.object({
  email: z.email(),
});

export const updatePasswordSchema = z
  .object({
    confirmPassword: z.string().min(8),
    password: z.string().min(8),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignInWithPasswordInput = z.infer<typeof signInWithPasswordSchema>;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
