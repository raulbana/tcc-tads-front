import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "../../schema/registerSchema";

const useRegisterForm = () => {
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

  const onSubmit = () => {};

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    acceptTerms,
    watch,
  };
};

export default useRegisterForm;
