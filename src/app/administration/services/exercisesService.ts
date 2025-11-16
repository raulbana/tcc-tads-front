import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  exerciseSchema,
  exerciseCreatorSchema,
  type ExerciseAdmin,
  type ExerciseCreator,
} from "../schema/exercisesSchema";
import { z } from "zod";

const api = apiFactory(API_BASE_URL ?? "");

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

const attributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: z.number(),
});

const categoryPayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
});

const attributePayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.number().min(1),
});

export type ExerciseCategory = z.infer<typeof categorySchema>;
export type ExerciseAttribute = z.infer<typeof attributeSchema>;

const toPayload = (exercise: ExerciseCreator) => {
  const parsed = exerciseCreatorSchema.parse(exercise);

  return {
    ...parsed,
    media: parsed.media?.map((item) => ({
      id: item.id,
      url: item.url,
      contentType: item.contentType,
      contentSize: item.contentSize ?? 0,
      altText: item.altText,
      createdAt: item.createdAt,
    })),
  };
};

export const exercisesService = {
  async listExercises(): Promise<ExerciseAdmin[]> {
    const response = await api.get(apiRoutes.exercises.listExercises);
    return exerciseSchema.array().parse(response.data);
  },

  async createExercise(exercise: ExerciseCreator): Promise<ExerciseAdmin> {
    const payload = toPayload(exercise);
    const response = await api.post(apiRoutes.exercises.listExercises, payload);
    return exerciseSchema.parse(response.data);
  },

  async updateExercise(
    id: number,
    exercise: ExerciseCreator
  ): Promise<ExerciseAdmin> {
    const payload = toPayload(exercise);
    const response = await api.put(
      apiRoutes.exercises.getExerciseById(String(id)),
      payload
    );
    return exerciseSchema.parse(response.data);
  },

  async deleteExercise(id: number): Promise<void> {
    await api.delete(apiRoutes.exercises.getExerciseById(String(id)));
  },

  async listCategories(): Promise<ExerciseCategory[]> {
    const response = await api.get(apiRoutes.exercises.categories.list);
    return categorySchema.array().parse(response.data);
  },

  async createCategory(payload: {
    name: string;
    description?: string | null;
  }): Promise<ExerciseCategory> {
    const body = categoryPayloadSchema.parse(payload);
    const response = await api.post(apiRoutes.exercises.categories.list, body);
    return categorySchema.parse(response.data);
  },

  async updateCategory(
    id: number,
    payload: { name: string; description?: string | null }
  ): Promise<ExerciseCategory> {
    const body = categoryPayloadSchema.parse(payload);
    const response = await api.put(
      apiRoutes.exercises.categories.byId(String(id)),
      body
    );
    return categorySchema.parse(response.data);
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(apiRoutes.exercises.categories.byId(String(id)));
  },

  async listAttributes(): Promise<ExerciseAttribute[]> {
    const response = await api.get(apiRoutes.exercises.attributes.list);
    return attributeSchema.array().parse(response.data);
  },

  async createAttribute(payload: {
    name: string;
    description: string;
    type: number;
  }): Promise<ExerciseAttribute> {
    const body = attributePayloadSchema.parse(payload);
    const response = await api.post(apiRoutes.exercises.attributes.list, body);
    return attributeSchema.parse(response.data);
  },

  async updateAttribute(
    id: number,
    payload: { name: string; description: string; type: number }
  ): Promise<ExerciseAttribute> {
    const body = attributePayloadSchema.parse(payload);
    const response = await api.put(
      apiRoutes.exercises.attributes.byId(String(id)),
      body
    );
    return attributeSchema.parse(response.data);
  },

  async deleteAttribute(id: number): Promise<void> {
    await api.delete(apiRoutes.exercises.attributes.byId(String(id)));
  },
};

export default exercisesService;
