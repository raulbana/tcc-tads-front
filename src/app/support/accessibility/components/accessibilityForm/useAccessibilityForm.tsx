import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AccessibilityFormData,
  accessibilitySchema,
} from "../../schema/accessibilitySchema";
import { useAccessibility } from "@/app/contexts/AccessibilityContext";
import { AccessibilityPreferences } from "@/app/types/config";

const useAccessibilityForm = () => {
  const { highContrast, darkMode, saveAccessibilityPreferences, isLoading } =
    useAccessibility();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
    reset,
  } = useForm<AccessibilityFormData>({
    resolver: zodResolver(accessibilitySchema),
    defaultValues: {
      isHighContrast: highContrast,
      isDarkMode: darkMode,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({
      isHighContrast: highContrast,
      isDarkMode: darkMode,
    });
  }, [highContrast, darkMode, reset]);

  const onSubmit = async (data: AccessibilityFormData) => {
    const preferences: AccessibilityPreferences = {
      isBigFont: false, // Sempre false, opção removida do formulário
      isHighContrast: data.isHighContrast,
      isDarkMode: data.isDarkMode,
    };

    await saveAccessibilityPreferences(preferences);
  };

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    watch,
    isLoading,
  };
};

export default useAccessibilityForm;
