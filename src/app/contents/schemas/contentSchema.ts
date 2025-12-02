import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/mov",
];

export const contentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  subtitle: z.string().optional(),
  subcontent: z.string().optional(),
  images: z
    .array(z.instanceof(File))
    .min(1, "No mínimo 1 imagem é obrigatória")
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Cada imagem deve ter no máximo 50MB"
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Apenas imagens JPEG, PNG ou WebP são aceitas"
    ),
  video: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "O vídeo deve ter no máximo 50MB"
    )
    .refine(
      (file) => !file || ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Apenas vídeos MP4, WebM ou OGG são aceitos"
    ),
  categories: z
    .array(z.string())
    .min(1, "Pelo menos uma categoria é obrigatória"),
});

export type ContentFormData = z.infer<typeof contentSchema>;
