import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import { LoginFormData, loginSchema } from "../../schema/loginSchema";
import { useAuth } from "@/app/contexts/AuthContext";

const useLoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onSubmit",
  });

  const remember = watch("remember");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await login({
        email: data.email,
        password: data.password,
      });

      router.push("/");
    } catch (error) {
      let errorMsg = "Ocorreu um erro inesperado. Tente novamente.";

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 401) {
          errorMsg = "Email ou senha inválidos. Tente novamente.";
        } else if (status === 429) {
          errorMsg =
            "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
        } else if (status === 403) {
          errorMsg = "Acesso negado. Verifique suas credenciais.";
        } else if (status === 500) {
          errorMsg = "Erro no servidor. Tente novamente mais tarde.";
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
      } else if (error instanceof Error) {
        errorMsg =
          error.message || "Email ou senha inválidos. Tente novamente.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setErrorMessage("");

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    remember,
    watch,
    isSubmitting,
    errorMessage,
    clearError,
  };
};

export default useLoginForm;
