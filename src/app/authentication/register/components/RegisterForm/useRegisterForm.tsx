import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterFormData, registerSchema } from "../../schema/registerSchema";
import { useAuth } from "@/app/contexts/AuthContext";

const useRegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onSubmit",
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/onboarding");
    } catch (error) {
      console.error("Erro no registro:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.");
      } else {
        setErrorMessage("Erro ao criar conta. Tente novamente.");
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
    acceptTerms,
    watch,
    isSubmitting,
    errorMessage,
    clearError,
  };
};

export default useRegisterForm;
