import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AccessibilityFormData,
  accessibilitySchema,
} from "../../schema/accessibilitySchema";

const useAccessibilityForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
  } = useForm<AccessibilityFormData>({
    resolver: zodResolver(accessibilitySchema),
    defaultValues: {
      isBigFont: false,
      isHighContrast: false,
    },
    mode: "onSubmit",
  });

  const onSubmit = () => {};

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    watch,
  };
};

export default useAccessibilityForm;
