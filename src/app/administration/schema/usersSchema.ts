import { z } from "zod";

export const role = z.object({
  description: z.string(), 
  permissionLevel: z.number(),
  reason: z.string(),
  hasDocument: z.boolean(),
  documentType: z.string().nullable().optional(),
  documentValue: z.string().nullable().optional(),
});
export const statusEnum = z.enum(["Ativo", "Bloqueado"]);

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: role,
  status: statusEnum,
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;
export type Role = z.infer<typeof role>;
export type Status = z.infer<typeof statusEnum>;
