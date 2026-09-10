import { z } from "zod";

export const signInWithPasswordSchema = z.object({
  email: z.email(),
  next: z.string().optional(),
  password: z.string().min(1),
});

export type SignInWithPasswordInput = z.infer<typeof signInWithPasswordSchema>;
