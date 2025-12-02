"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordRequestFormData,
  forgotPasswordRequestSchema,
} from "../../schema/forgotPasswordSchema";
import { authService } from "@/app/services/authServices";
import {
  forgotPasswordRequestRequest,
  forgotPasswordRequestResponse,
} from "@/app/types/auth";

const useForgotPasswordRequestForm = (
  onSuccess: (email: string) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ForgotPasswordRequestFormData>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (values: ForgotPasswordRequestFormData) => {
      try {
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload: forgotPasswordRequestRequest = {
          email: values.email,
        };

        const res: forgotPasswordRequestResponse =
          await authService.forgotPasswordRequest(payload);

        if (res.status === "success") {
          setSuccessMessage(
            res.message || "Código de verificação enviado com sucesso."
          );
          onSuccess(values.email);
          reset({ email: values.email });
        } else {
          setErrorMessage(
            res.message || "Não foi possível enviar o código. Tente novamente."
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(
            error.message ||
              "Não foi possível enviar o código. Tente novamente."
          );
        } else {
          setErrorMessage(
            "Não foi possível enviar o código. Tente novamente."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, reset]
  );

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    onSubmit,
    isSubmitting,
    errorMessage,
    successMessage,
    clearMessages,
  };
};

export default useForgotPasswordRequestForm;





