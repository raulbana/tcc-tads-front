import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  contentCategorySchema,
  type ContentCategory,
  type ContentCategoryCreator,
} from "../schema/contentCategoriesSchema";
import { z } from "zod";

const api = apiFactory(API_BASE_URL ?? "");

const categoryPayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(255),
  auditable: z.boolean(),
});

export const contentCategoriesService = {
  async listCategories(): Promise<ContentCategory[]> {
    const response = await api.get(apiRoutes.content.categories);
    return contentCategorySchema.array().parse(response.data);
  },

  async createCategory(
    payload: ContentCategoryCreator
  ): Promise<ContentCategory> {
    const body = categoryPayloadSchema.parse(payload);
    const response = await api.post(apiRoutes.content.categories, body);
    return contentCategorySchema.parse(response.data);
  },

  async updateCategory(
    id: number,
    payload: ContentCategoryCreator
  ): Promise<ContentCategory> {
    const body = categoryPayloadSchema.parse(payload);
    const response = await api.put(
      apiRoutes.content.categoryById(String(id)),
      body
    );
    return contentCategorySchema.parse(response.data);
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(apiRoutes.content.categoryById(String(id)));
  },
};

export default contentCategoriesService;
