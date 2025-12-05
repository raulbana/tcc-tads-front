import { z } from "zod";
import { mediaSchema } from "./complaintsSchema";

export const exerciseAttributeSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  type: z.number(),
});

export const exerciseSchema = z.object({
  id: z.number().nullable().optional(),
  title: z.string(),
  instructions: z.string(),
  category: z.string(),
  media: z.array(mediaSchema).default([]),
  benefits: z.array(exerciseAttributeSchema).default([]),
  repetitions: z.number(),
  sets: z.number(),
  restTime: z.number(),
  duration: z.number(),
});

export const exerciseCreatorSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  categoryId: z
    .number({
      required_error: "Selecione uma categoria",
      invalid_type_error: "Selecione uma categoria",
    })
    .refine((val) => val > 0, { message: "Selecione uma categoria" }),
  media: z.array(mediaSchema.partial()).default([]),
  attributes: z.array(z.number()).default([]),
  repetitions: z.number().refine((val) => val > 0, {
    message: "Repetições deve ser maior que zero",
  }),
  sets: z
    .number()
    .refine((val) => val > 0, { message: "Séries deve ser maior que zero" }),
  restTime: z.number().refine((val) => val > 0, {
    message: "Tempo de descanso deve ser maior que zero",
  }),
  duration: z
    .number()
    .refine((val) => val > 0, { message: "Duração deve ser maior que zero" }),
});

export type ExerciseAttribute = z.infer<typeof exerciseAttributeSchema>;
export type ExerciseAdmin = z.infer<typeof exerciseSchema>;
export type ExerciseCreator = z.infer<typeof exerciseCreatorSchema>;
