import { Exercise, Workout, WorkoutEvaluation } from "@/app/types/exercise";

export interface SerializedExercise {
  id: string;
  title: string;
  description: string;
  status: Exercise["status"];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  duration: string;
  repetitions: number;
  sets: number;
  dueDate?: string | Date;
  category: string;
  completedAt?: string | Date;
  benefits?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  media?: {
    videos?: string[];
    images?: string[];
  };
}

export interface SerializedWorkout {
  id: string;
  name: string;
  exercises: SerializedExercise[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  scheduledDate?: string | Date;
  evaluatedAt?: string | Date;
  notes?: string;
  status: Workout["status"];
  difficulty: Workout["difficulty"];
  evaluation?: {
    rating: WorkoutEvaluation | string;
    difficultyFeedback: string;
    comments?: string;
  };
  duration: string;
  description: string;
  category: string;
}

export const FALLBACK_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

const ensureDate = (value?: string | Date): Date | undefined => {
  if (!value) return undefined;
  const dateValue = value instanceof Date ? value : new Date(value);
  return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
};

export const deserializeWorkout = (serialized: SerializedWorkout): Workout => {
  const evaluation = serialized.evaluation
    ? {
        ...serialized.evaluation,
        rating:
          typeof serialized.evaluation.rating === "string"
            ? (serialized.evaluation.rating as WorkoutEvaluation)
            : serialized.evaluation.rating,
      }
    : undefined;

  return {
    ...serialized,
    createdAt: ensureDate(serialized.createdAt) ?? new Date(),
    updatedAt: ensureDate(serialized.updatedAt) ?? new Date(),
    scheduledDate: ensureDate(serialized.scheduledDate),
    evaluatedAt: ensureDate(serialized.evaluatedAt),
    evaluation,
    exercises: (serialized.exercises || []).map((exercise) => ({
      ...exercise,
      createdAt: ensureDate(exercise.createdAt) ?? new Date(),
      updatedAt: ensureDate(exercise.updatedAt) ?? new Date(),
      dueDate: ensureDate(exercise.dueDate),
      completedAt: ensureDate(exercise.completedAt),
      media: {
        videos:
          exercise.media?.videos && exercise.media.videos.length > 0
            ? exercise.media.videos
            : [FALLBACK_VIDEO_URL],
        images: exercise.media?.images ?? [],
      },
    })),
  };
};

export const loadWorkoutFromSession = (workoutId: string): Workout | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(`workout_${workoutId}`);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SerializedWorkout;
    return deserializeWorkout(parsed);
  } catch (error) {
    return null;
  }
};

export const saveWorkoutToSession = (workout: Workout): void => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(
      `workout_${workout.id}`,
      JSON.stringify(workout)
    );
  } catch (error) {
  }
};
