import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  Exercise,
  Workout,
  WorkoutPlan,
  UserWorkoutPlanDTO,
  ExerciseFeedbackCreatorDTO,
  WorkoutCompletionDTO,
} from "@/app/types/exercise";

const api = apiFactory(API_BASE_URL ?? "");

const getStoredUserId = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem("dailyiu_user");
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return parsed?.id ? String(parsed.id) : undefined;
  } catch (error) {
    console.warn("Não foi possível recuperar o usuário armazenado", error);
    return undefined;
  }
};

function mapExerciseDTO(raw: any): Exercise {
  const description = raw.description || raw.instructions || "";
  const mediaArray: any[] = Array.isArray(raw.media) ? raw.media : [];
  const videos = mediaArray
    .filter(
      (m) =>
        typeof m?.url === "string" && (m?.contentType || "").startsWith("video")
    )
    .map((m) => m.url);
  const images = mediaArray
    .filter(
      (m) =>
        typeof m?.url === "string" && (m?.contentType || "").startsWith("image")
    )
    .map((m) => m.url);

  return {
    id: String(raw.id),
    title: raw.title || raw.name || "",
    description,
    status: (raw.status as Exercise["status"]) || "PENDING",
    createdAt: new Date(raw.createdAt || Date.now()),
    updatedAt: new Date(raw.updatedAt || Date.now()),
    duration:
      typeof raw.duration === "number"
        ? `${raw.duration}s`
        : raw.duration || "",
    repetitions: raw.repetitions ?? 0,
    sets: raw.sets ?? 0,
    dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
    category: raw.category || "",
    completedAt: raw.completedAt ? new Date(raw.completedAt) : undefined,
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits.map((b: any) => ({
          id: String(b.id),
          title: b.title || b.name || "",
          description: b.description || "",
        }))
      : [],
    media: { videos, images },
  };
}

function mapWorkoutDTO(raw: any): Workout {
  const exercisesSource = raw.exercises;
  const exercisesArray: any[] = Array.isArray(exercisesSource)
    ? exercisesSource
    : exercisesSource && typeof exercisesSource === "object"
    ? Object.values(exercisesSource)
    : [];

  const difficultyLevel = raw.difficultyLevel || raw.difficulty;
  const difficulty: Workout["difficulty"] =
    difficultyLevel === "BEGINNER"
      ? "EASY"
      : difficultyLevel === "MODERATE"
      ? "MODERATE"
      : difficultyLevel === "HARD"
      ? "HARD"
      : "EASY";

  const totalDuration = raw.totalDuration;
  const duration =
    typeof totalDuration === "number"
      ? `${totalDuration}s`
      : raw.duration || "";

  return {
    id: String(raw.id),
    name: raw.name || raw.title || "",
    exercises: exercisesArray.map(mapExerciseDTO),
    createdAt: new Date(raw.createdAt || Date.now()),
    updatedAt: new Date(raw.updatedAt || Date.now()),
    scheduledDate: raw.scheduledDate ? new Date(raw.scheduledDate) : undefined,
    evaluatedAt: raw.evaluatedAt ? new Date(raw.evaluatedAt) : undefined,
    notes: raw.notes || "",
    status: (raw.status as Workout["status"]) || "IN_PROGRESS",
    difficulty,
    evaluation: raw.evaluation,
    duration,
    description: raw.description || "",
    category: raw.category || "",
  };
}

export const exerciseServices = {
  listExercises: async (): Promise<Exercise[]> => {
    const res = await api.get(apiRoutes.exercises.listExercises);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map(mapExerciseDTO);
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    const res = await api.get(apiRoutes.exercises.getExerciseById(id));
    return mapExerciseDTO(res.data);
  },

  listWorkouts: async (): Promise<Workout[]> => {
    const res = await api.get(apiRoutes.exercises.listWorkouts);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map(mapWorkoutDTO);
  },

  listWorkoutPlans: async (): Promise<WorkoutPlan[]> => {
    const res = await api.get(apiRoutes.exercises.listWorkoutPlans);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map((raw: any): WorkoutPlan => {
      const workoutsSource = raw.workouts;
      const workoutsArray: any[] = Array.isArray(workoutsSource)
        ? workoutsSource
        : workoutsSource && typeof workoutsSource === "object"
        ? Object.values(workoutsSource)
        : [];

      const difficultyLevel = raw.difficultyLevel || raw.difficulty;
      const difficulty: WorkoutPlan["difficulty"] =
        difficultyLevel === "BEGINNER"
          ? "EASY"
          : difficultyLevel === "MODERATE"
          ? "MODERATE"
          : difficultyLevel === "HARD"
          ? "HARD"
          : "EASY";

      return {
        id: String(raw.id),
        name: raw.name || raw.title || "",
        description: raw.description || "",
        difficulty,
        workouts: workoutsArray.map(mapWorkoutDTO),
        createdAt: new Date(raw.createdAt || Date.now()),
        updatedAt: new Date(raw.updatedAt || Date.now()),
      };
    });
  },

  getWorkoutPlanById: async (id: string): Promise<WorkoutPlan> => {
    const res = await api.get(apiRoutes.exercises.getWorkoutPlanById(id));
    const raw = res.data;
    const workoutsSource = raw.workouts;
    const workoutsArray: any[] = Array.isArray(workoutsSource)
      ? workoutsSource
      : workoutsSource && typeof workoutsSource === "object"
      ? Object.values(workoutsSource)
      : [];

    const difficultyLevel = raw.difficultyLevel || raw.difficulty;
    const difficulty: WorkoutPlan["difficulty"] =
      difficultyLevel === "BEGINNER"
        ? "EASY"
        : difficultyLevel === "MODERATE"
        ? "MODERATE"
        : difficultyLevel === "HARD"
        ? "HARD"
        : "EASY";

    return {
      id: String(raw.id),
      name: raw.name || raw.title || "",
      description: raw.description || "",
      difficulty,
      workouts: workoutsArray.map(mapWorkoutDTO),
      createdAt: new Date(raw.createdAt || Date.now()),
      updatedAt: new Date(raw.updatedAt || Date.now()),
    };
  },

  submitWorkoutFeedback: async (
    payload: ExerciseFeedbackCreatorDTO[]
  ): Promise<void> => {
    await api.post(apiRoutes.exercises.submitWorkoutFeedback, payload);
  },

  submitWorkoutCompletion: async (
    payload: WorkoutCompletionDTO[]
  ): Promise<void> => {
    await api.post(apiRoutes.exercises.submitWorkoutCompletion, payload);
  },

  getUserWorkoutPlan: async (): Promise<UserWorkoutPlanDTO | null> => {
    try {
      const userId = getStoredUserId();
      const headers = userId ? { "X-User-Id": userId } : undefined;

      const res = await api.get(apiRoutes.exercises.getUserWorkoutPlan, {
        headers,
      });
      if (res.status === 204) {
        return null;
      }
      const raw = res.data;
      const workoutsSource = raw.plan?.workouts;
      const workoutsArray: any[] = Array.isArray(workoutsSource)
        ? workoutsSource
        : workoutsSource && typeof workoutsSource === "object"
        ? Object.values(workoutsSource)
        : [];

      const difficultyLevel = raw.plan.difficultyLevel || raw.plan.difficulty;
      const difficulty: WorkoutPlan["difficulty"] =
        difficultyLevel === "BEGINNER"
          ? "EASY"
          : difficultyLevel === "MODERATE"
          ? "MODERATE"
          : difficultyLevel === "HARD"
          ? "HARD"
          : "EASY";

      const mappedPlan: WorkoutPlan = {
        id: String(raw.plan.id),
        name: raw.plan.name || raw.plan.title || "",
        description: raw.plan.description || "",
        difficulty,
        workouts: workoutsArray.map(mapWorkoutDTO),
        createdAt: new Date(raw.plan.createdAt || Date.now()),
        updatedAt: new Date(raw.plan.updatedAt || Date.now()),
      };

      return {
        id: raw.id,
        plan: mappedPlan,
        startDate: raw.startDate,
        endDate: raw.endDate,
        totalProgress: raw.totalProgress,
        weekProgress: raw.weekProgress,
        currentWeek: raw.currentWeek,
        nextWorkout: raw.nextWorkout,
        lastWorkoutDate: raw.lastWorkoutDate,
        completed: raw.completed,
      };
    } catch (error: any) {
      if (error.response?.status === 204 || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
