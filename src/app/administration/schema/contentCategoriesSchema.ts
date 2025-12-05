import { z } from "zod";

export const contentCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  auditable: z.boolean().optional(),
  createdAt: z.string().optional().nullable(),
});

export const contentCategoryCreatorSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(255),
  auditable: z.boolean(),
});

export type ContentCategory = z.infer<typeof contentCategorySchema>;
export type ContentCategoryCreator = z.infer<
  typeof contentCategoryCreatorSchema
>;
