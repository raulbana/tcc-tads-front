import { z } from "zod";

export const mediaSchema = z.object({
  id: z.number().nullable().optional(),
  url: z.string().url(),
  contentType: z.string(),
  contentSize: z.number(),
  altText: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const authorSchema = z.object({
  id: z.number(),
  name: z.string(),
  profilePicture: z.string().nullable().optional(),
});

export const contentReportSchema = z.object({
  id: z.number(),
  reason: z.string(),
  createdAt: z.string(),
});

export const contentAdminSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  subtitle: z.string().nullable().optional(),
  subcontent: z.string().nullable().optional(),
  categories: z.array(z.string()),
  author: authorSchema,
  media: z.array(mediaSchema),
  reports: z.array(contentReportSchema),
});

export const reportToggleSchema = z.object({
  contentId: z.number(),
  reportId: z.number(),
  valid: z.boolean(),
});

export type Media = z.infer<typeof mediaSchema>;
export type Author = z.infer<typeof authorSchema>;
export type ContentReport = z.infer<typeof contentReportSchema>;
export type ContentAdmin = z.infer<typeof contentAdminSchema>;
export type ReportToggle = z.infer<typeof reportToggleSchema>;
