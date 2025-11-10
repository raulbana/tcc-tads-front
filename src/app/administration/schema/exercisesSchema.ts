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
  title: z.string().min(1),
  instructions: z.string().min(1),
  categoryId: z.number(),
  media: z.array(mediaSchema.partial()).default([]),
  attributes: z.array(z.number()).default([]),
  repetitions: z.number().min(0),
  sets: z.number().min(0),
  restTime: z.number().min(0),
  duration: z.number().min(0),
});

export type ExerciseAttribute = z.infer<typeof exerciseAttributeSchema>;
export type ExerciseAdmin = z.infer<typeof exerciseSchema>;
export type ExerciseCreator = z.infer<typeof exerciseCreatorSchema>;
