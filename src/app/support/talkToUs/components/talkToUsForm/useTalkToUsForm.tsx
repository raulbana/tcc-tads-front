import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { TalkToUsFormData, talkToUsSchema } from "../../schema/talkToUsSchema";
import { apiRoutes } from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";

const useTalkToUsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
    reset,
  } = useForm<TalkToUsFormData>({
    resolver: zodResolver(talkToUsSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: TalkToUsFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${API_BASE_URL}${apiRoutes.contact}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: data.email,
          subject: data.subject,
          text: data.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setSuccessMessage("Mensagem enviada com sucesso!");
      reset();
    } catch (error: unknown) {
      console.error("Erro ao enviar mensagem:", error);
      setErrorMessage((error as Error).message || "Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return {
    isValid,
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    watch,
    isSubmitting,
    errorMessage,
    successMessage,
    clearMessages,
  };
};

export default useTalkToUsForm;
