import { z } from "zod";

export const commentSchema = z.object({
  comment: z.string().min(1, "Comentário não pode estar vazio").trim(),
});

export type CommentFormData = z.infer<typeof commentSchema>;