import { z } from "zod";

export const perfilEnum = z.enum(["Usuário", "Saúde", "Admin"]);
export const statusEnum = z.enum(["Ativo", "Bloqueado"]);

export const userSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  perfil: perfilEnum,
  status: statusEnum,
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;
export type Perfil = z.infer<typeof perfilEnum>;
export type Status = z.infer<typeof statusEnum>;
