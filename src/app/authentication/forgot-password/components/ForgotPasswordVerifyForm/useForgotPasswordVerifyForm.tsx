"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordValidationFormData,
  forgotPasswordValidationSchema,
} from "../../schema/forgotPasswordSchema";
import { authService } from "@/app/services/authServices";
import {
  forgotPasswordValidateRequest,
  forgotPasswordValidateResponse,
} from "@/app/types/auth";

const useForgotPasswordVerifyForm = (
  email: string,
  onSuccess: () => void
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
  } = useForm<ForgotPasswordValidationFormData>({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = useCallback(
    async (values: ForgotPasswordValidationFormData) => {
      try {
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload: forgotPasswordValidateRequest = {
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        };

        const res: forgotPasswordValidateResponse =
          await authService.forgotPasswordReset(payload);

        if (res.status === "success") {
          setSuccessMessage(res.message || "Senha redefinida com sucesso!");
          reset({
            email,
            otp: "",
            newPassword: "",
            confirmPassword: "",
          });
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrorMessage(
            res.message ||
              "Não foi possível redefinir a senha. Verifique o código e tente novamente."
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(
            error.message ||
              "Não foi possível redefinir a senha. Verifique o código e tente novamente."
          );
        } else {
          setErrorMessage(
            "Não foi possível redefinir a senha. Verifique o código e tente novamente."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, onSuccess, reset]
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

export default useForgotPasswordVerifyForm;





