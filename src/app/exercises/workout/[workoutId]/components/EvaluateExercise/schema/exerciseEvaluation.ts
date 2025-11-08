import { z } from 'zod';

export const workoutEvaluationSchema = z.object({
  difficulty: z.enum(['EASY', 'MODERATE', 'HARD'], {
    required_error: 'Selecione uma opção de dificuldade',
  }),
});

export const exerciseSpecificEvaluationSchema = z.object({
  completion: z.enum(['EASILY', 'WITH_DIFFICULTY', 'COULD_NOT_COMPLETE'], {
    required_error: 'Selecione uma opção de conclusão',
  }),
});

export const completeExerciseEvaluationSchema = workoutEvaluationSchema.merge(
  exerciseSpecificEvaluationSchema,
);

export type WorkoutEvaluationAnswers = z.infer<typeof workoutEvaluationSchema>;
export type ExerciseSpecificEvaluationAnswers = z.infer<
  typeof exerciseSpecificEvaluationSchema
>;
export type ExerciseEvaluationAnswers = z.infer<
  typeof completeExerciseEvaluationSchema
>;

