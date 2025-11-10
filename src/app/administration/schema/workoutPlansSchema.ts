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
  name: z.string().min(1),
  description: z.string().optional().default(""),
  workoutIds: z.record(z.string(), z.number()),
  daysPerWeek: z.number().min(1).max(7),
  totalWeeks: z.number().min(1),
  iciqScoreMin: z.number().min(1),
  iciqScoreMax: z.number().min(1),
  ageMin: z.number().min(1),
  ageMax: z.number().min(1),
});

export type WorkoutPlanAdmin = z.infer<typeof workoutPlanSchema>;
export type WorkoutPlanEntry = WorkoutPlanAdmin["workouts"][number];
