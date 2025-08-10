import { z } from 'zod';

export const iciqSchema = z.object({
  birthdate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  gender: z.string().min(1, 'Selecione ao menos uma opção'),
  q3_frequency: z.number().min(0).max(5),
  q4_amount: z.number().min(0).max(6),
  q5_interference: z.number().min(0).max(10),
  q6_when: z.array(z.string()).min(1, 'Selecione pelo menos uma opção'),
});

export type ICIQAnswers = z.infer<typeof iciqSchema>;