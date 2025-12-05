import { z } from "zod";
import { exerciseSchema } from "./exercisesSchema";

const workoutExerciseEntrySchema = z.tuple([z.string(), exerciseSchema]);

export const workoutSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  totalDuration: z.number(),
  difficultyLevel: z.string(),
  exercises: z.record(z.string(), exerciseSchema).transform((record) =>
    Object.entries(record)
      .map(([order, exercise]) => ({
        order: Number(order),
        exercise,
      }))
      .sort((a, b) => a.order - b.order)
  ),
  createdAt: z.string(),
});

export const workoutCreatorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().default(""),
  totalDuration: z.number().refine((val) => val > 0, {
    message: "Duração total deve ser maior que zero",
  }),
  difficultyLevel: z.string().min(1, "Selecione uma dificuldade"),
  exerciseIds: z.record(z.string(), z.number()),
});

export const workoutFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().default(""),
  totalDuration: z.number().refine((val) => val > 0, {
    message: "Duração total deve ser maior que zero",
  }),
  difficultyLevel: z.string().min(1, "Selecione uma dificuldade"),
});

export type WorkoutAdmin = z.infer<typeof workoutSchema>;
export type WorkoutExerciseEntry = WorkoutAdmin["exercises"][number];
