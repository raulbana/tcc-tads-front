import { z } from "zod";

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type ForgotPasswordRequestFormData = z.infer<
  typeof forgotPasswordRequestSchema
>;

export const forgotPasswordValidationSchema = z
  .object({
    email: z.string().email("E-mail inválido").optional(),
    otp: z.string().min(6, "Código de verificação inválido"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .refine((val) => /[A-Z]/.test(val), {
        message: "A senha deve ter pelo menos 1 letra maiúscula",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "A senha deve ter pelo menos 1 letra minúscula",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "A senha deve ter pelo menos 1 número",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "A senha deve ter pelo menos 1 caractere especial",
      }),
    confirmPassword: z.string().min(8, "Confirme sua senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ForgotPasswordValidationFormData = z.infer<
  typeof forgotPasswordValidationSchema
>;





