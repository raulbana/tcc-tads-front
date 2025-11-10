import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  workoutPlanSchema,
  workoutPlanCreatorSchema,
  type WorkoutPlanAdmin,
} from "../schema/workoutPlansSchema";

const api = apiFactory(API_BASE_URL ?? "");

export const workoutPlansService = {
  async listPlans(): Promise<WorkoutPlanAdmin[]> {
    const response = await api.get(apiRoutes.exercises.listWorkoutPlans);
    return workoutPlanSchema.array().parse(response.data);
  },

  async createPlan(payload: {
    name: string;
    description: string;
    workoutIds: Record<string, number>;
    daysPerWeek: number;
    totalWeeks: number;
    iciqScoreMin: number;
    iciqScoreMax: number;
    ageMin: number;
    ageMax: number;
  }): Promise<WorkoutPlanAdmin> {
    const body = workoutPlanCreatorSchema.parse(payload);
    const response = await api.post(apiRoutes.exercises.listWorkoutPlans, body);
    return workoutPlanSchema.parse(response.data);
  },

  async updatePlan(
    id: number,
    payload: {
      name: string;
      description: string;
      workoutIds: Record<string, number>;
      daysPerWeek: number;
      totalWeeks: number;
      iciqScoreMin: number;
      iciqScoreMax: number;
      ageMin: number;
      ageMax: number;
    }
  ): Promise<WorkoutPlanAdmin> {
    const body = workoutPlanCreatorSchema.parse(payload);
    const response = await api.put(
      apiRoutes.exercises.getWorkoutPlanById(String(id)),
      body
    );
    return workoutPlanSchema.parse(response.data);
  },

  async deletePlan(id: number): Promise<void> {
    await api.delete(apiRoutes.exercises.getWorkoutPlanById(String(id)));
  },
};

export default workoutPlansService;

