import {PatientProfileDTO} from './auth';

export interface OnboardSubmitDTO {
  userId?: number;
  answers: Record<string, string>;
}

export interface UserWorkoutPlanDTO {
  id: number;
  plan: WorkoutPlanDTO;
  startDate: string;
  endDate: string;
  totalProgress: number;
  weekProgress: number;
  currentWeek: number;
  nextWorkout: number;
  lastWorkoutDate?: string;
  completed: boolean;
}

export interface WorkoutPlanDTO {
  id: number;
  name: string;
  description?: string;
  duration: number;
  difficulty: string;
}

export interface OnboardCompleteDTO {
  profile: PatientProfileDTO;
  workoutPlan?: UserWorkoutPlanDTO;
}
