import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;