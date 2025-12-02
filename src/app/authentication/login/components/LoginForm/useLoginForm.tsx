import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      if (error instanceof Error) {
        setErrorMessage(error.message || "Email ou senha inválidos. Tente novamente.");
      } else {
        setErrorMessage("Email ou senha inválidos. Tente novamente.");
      }
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
