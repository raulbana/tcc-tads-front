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

  gender: z
    .enum(["male", "female", "other"], {
      required_error: "Gênero é obrigatório",
      invalid_type_error: "Selecione um gênero válido",
    })
    .optional(),

  profilePictureUrl: z
    .string()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        // Aceitar data URLs (preview de nova foto) ou URLs HTTP/HTTPS válidas
        if (val.startsWith("data:")) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL da imagem inválida" }
    )
    .default(""),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
