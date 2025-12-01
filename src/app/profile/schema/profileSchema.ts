import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  email: z
    .string()
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Gênero é obrigatório",
    invalid_type_error: "Selecione um gênero válido",
  }),

  profilePictureUrl: z
    .string()
    .url("URL da imagem inválida")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;


