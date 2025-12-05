import { z } from "zod";
import { workoutSchema } from "./workoutsSchema";

export const workoutPlanSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  workouts: z.record(z.string(), workoutSchema).transform((record) =>
    Object.entries(record)
      .map(([order, workout]) => ({
        order: Number(order),
        workout,
      }))
      .sort((a, b) => a.order - b.order)
  ),
  daysPerWeek: z.number(),
  totalWeeks: z.number(),
  iciqScoreMin: z.number(),
  iciqScoreMax: z.number(),
  ageMin: z.number(),
  ageMax: z.number(),
});

export const workoutPlanCreatorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().default(""),
  workoutIds: z.record(z.string(), z.number()),
  daysPerWeek: z.number().refine((val) => val >= 1 && val <= 7, {
    message: "Dias por semana deve estar entre 1 e 7",
  }),
  totalWeeks: z.number().refine((val) => val > 0, {
    message: "Total de semanas deve ser maior que zero",
  }),
  iciqScoreMin: z.number().refine((val) => val > 0, {
    message: "ICIQ mínimo deve ser maior que zero",
  }),
  iciqScoreMax: z.number().refine((val) => val > 0, {
    message: "ICIQ máximo deve ser maior que zero",
  }),
  ageMin: z.number().refine((val) => val > 0, {
    message: "Idade mínima deve ser maior que zero",
  }),
  ageMax: z.number().refine((val) => val > 0, {
    message: "Idade máxima deve ser maior que zero",
  }),
});

export const workoutPlanFormSchema = workoutPlanCreatorSchema.omit({
  workoutIds: true,
});

export type WorkoutPlanAdmin = z.infer<typeof workoutPlanSchema>;
export type WorkoutPlanEntry = WorkoutPlanAdmin["workouts"][number];
