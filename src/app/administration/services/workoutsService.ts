import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  workoutSchema,
  workoutCreatorSchema,
  type WorkoutAdmin,
} from "../schema/workoutsSchema";

const api = apiFactory(API_BASE_URL ?? "");

export const workoutsService = {
  async listWorkouts(): Promise<WorkoutAdmin[]> {
    const response = await api.get(apiRoutes.exercises.listWorkouts);
    return workoutSchema.array().parse(response.data);
  },

  async createWorkout(payload: {
    name: string;
    description: string;
    totalDuration: number;
    difficultyLevel: string;
    exerciseIds: Record<string, number>;
  }): Promise<WorkoutAdmin> {
    const body = workoutCreatorSchema.parse(payload);
    const response = await api.post(apiRoutes.exercises.listWorkouts, body);
    return workoutSchema.parse(response.data);
  },

  async updateWorkout(
    id: number,
    payload: {
      name: string;
      description: string;
      totalDuration: number;
      difficultyLevel: string;
      exerciseIds: Record<string, number>;
    }
  ): Promise<WorkoutAdmin> {
    const body = workoutCreatorSchema.parse(payload);
    const response = await api.put(
      apiRoutes.exercises.getWorkoutById(String(id)),
      body
    );
    return workoutSchema.parse(response.data);
  },

  async deleteWorkout(id: number): Promise<void> {
    await api.delete(apiRoutes.exercises.getWorkoutById(String(id)));
  },
};

export default workoutsService;
