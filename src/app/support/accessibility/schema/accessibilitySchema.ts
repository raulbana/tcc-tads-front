import { z } from "zod";

export const accessibilitySchema = z.object({
  isBigFont: z.boolean(),
  isHighContrast: z.boolean(),
});

export type AccessibilityFormData = z.infer<typeof accessibilitySchema>;
