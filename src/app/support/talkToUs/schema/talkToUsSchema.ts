import { z } from "zod";

export const talkToUsSchema = z.object({
  email: z.string().email("E-mail inválido").nonempty("Email obrigatório"),
  subject: z.string().nonempty("Assunto obrigatório"),
  message: z.string().nonempty("Mensagem obrigatória"),
});

export type TalkToUsFormData = z.infer<typeof talkToUsSchema>;
