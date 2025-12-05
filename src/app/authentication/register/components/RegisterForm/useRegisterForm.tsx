import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RegisterFormData, registerSchema } from "../../schema/registerSchema";
import { useAuth } from "@/app/contexts/AuthContext";

const useRegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register: registerUser,
    hasOnboardingData,
    isAuthenticated,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !hasOnboardingData()) {
      router.push("/onboarding");
    }
  }, [hasOnboardingData, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors, isSubmitted },
    setValue,
    watch,
    trigger,
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
    reValidateMode: "onChange",
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!hasOnboardingData()) {
        setErrorMessage(
          "Por favor, complete o onboarding antes de se registrar."
        );
        router.push("/onboarding");
        return;
      }

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Erro ao criar conta. Tente novamente."
        );
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
    control,
    errors,
    setValue,
    onSubmit,
    acceptTerms,
    watch,
    isSubmitting,
    errorMessage,
    clearError,
    isSubmitted,
    trigger,
  };
};

export default useRegisterForm;
