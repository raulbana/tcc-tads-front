import { z } from "zod";

export const volumeOptions = [
  { label: 'Baixo (Até 100ml)', value: 'LOW' },
  { label: 'Médio (100-300ml)', value: 'MEDIUM' },
  { label: 'Alto (Acima de 300ml)', value: 'HIGH' },
] as const;

export const yesNoOptions = [
  { label: 'Sim', value: 'YES' },
  { label: 'Não', value: 'NO' },
] as const;

export const dayDataFormSchema = z.object({
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido'),
  amount: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Selecione o volume',
  }),
  urgency: z.enum(['YES', 'NO'], {
    required_error: 'Selecione urgência',
  }),
  leakage: z.enum(['YES', 'NO'], {
    required_error: 'Selecione perda',
  }),
  reason: z
    .string()
    .max(200, 'Máx. 200 caracteres')
    .optional()
    .or(z.literal('')),
});

export type DayDataRawForm = z.infer<typeof dayDataFormSchema>;