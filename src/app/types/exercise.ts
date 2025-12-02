export type ExerciseStatus = "COMPLETED" | "PENDING" | "IN_PROGRESS";
export type WorkoutStatus = "PAUSED" | "COMPLETED" | "MISSED" | "IN_PROGRESS";
export type WorkoutDifficulty = "EASY" | "MODERATE" | "HARD";
export type WorkoutEvaluation = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

export const ExerciseStatusLabels: Record<ExerciseStatus, string> = {
  COMPLETED: "Completo",
  PENDING: "Pendente",
  IN_PROGRESS: "Em Progresso",
};

export const WorkoutStatusLabels: Record<WorkoutStatus, string> = {
  PAUSED: "Pausado",
  COMPLETED: "Completo",
  IN_PROGRESS: "Em Progresso",
  MISSED: "Perdido",
};

export const WorkoutDifficultyLabels: Record<WorkoutDifficulty, string> = {
  EASY: "Fácil",
  MODERATE: "Moderado",
  HARD: "Difícil",
};

export const WorkoutEvaluationLabels: Record<WorkoutEvaluation, string> = {
  EXCELLENT: "Excelente",
  GOOD: "Bom",
  FAIR: "Razoável",
  POOR: "Ruim",
};

export interface ExerciseBenefit {
  id: string;
  title: string;
  description: string;
}

export interface ExerciseMedia {
  videos?: string[];
  images?: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  status: ExerciseStatus;
  createdAt: Date;
  updatedAt: Date;
  duration: string;
  repetitions: number;
  sets: number;
  dueDate?: Date;
  category: string;
  completedAt?: Date;
  benefits?: ExerciseBenefit[];
  media?: ExerciseMedia;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  evaluatedAt?: Date;
  notes?: string;
  status: WorkoutStatus;
  difficulty: WorkoutDifficulty;
  evaluation?: {
    rating: WorkoutEvaluation;
    difficultyFeedback: string;
    comments?: string;
  };
  duration: string;
  description: string;
  category: string;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseAttribute {
  id: string;
  name: string;
  valueType?: "NUMBER" | "TEXT" | "BOOLEAN";
  unit?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty?: WorkoutDifficulty;
  workouts: Workout[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseFeedbackCreatorDTO {
  exerciseId: number;
  workoutId: number;
  rating: number;
  evaluation: string;
  comments?: string;
  completedAt?: string;
}

export interface WorkoutCompletionDTO {
  workoutId: number;
  completedAt: string;
}

export interface UserWorkoutFeedbackDTO {
  userId: number;
  workoutId: number;
  rating: WorkoutEvaluation;
  difficultyFeedback: string;
  comments?: string;
}

export interface UserWorkoutCompletionDTO {
  userId: number;
  workoutId: number;
  completedAt: string;
  duration?: string;
}

export interface UserWorkoutPlanDTO {
  id: number;
  plan: WorkoutPlan;
  workouts: Workout[];
  startDate: string;
  endDate?: string;
  totalProgress: number;
  weekProgress: number;
  currentWeek: number;
  nextWorkout?: number;
  lastWorkoutDate?: string;
  completed: boolean;
}
