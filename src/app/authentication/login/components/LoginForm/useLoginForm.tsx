import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../../schema/loginSchema";

const useLoginForm = () => {
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

  const onSubmit = () => {};

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    remember,
    watch,
  };
};

export default useLoginForm;
