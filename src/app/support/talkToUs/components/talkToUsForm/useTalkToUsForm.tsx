import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { TalkToUsFormData, talkToUsSchema } from "../../schema/talkToUsSchema";
import useConfigQueries from "@/app/services/configQueryFactory";
import { ContactRequest } from "@/app/types/config";

const useTalkToUsForm = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const configQueries = useConfigQueries(['config']);
  const sendContactEmailMutation = configQueries.useSendContactEmail();

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
      setSuccessMessage("");

      const contactRequest: ContactRequest = {
        userEmail: data.email,
        subject: data.subject,
        text: data.message,
      };

      await sendContactEmailMutation.mutateAsync(contactRequest);

      setSuccessMessage("Mensagem enviada com sucesso!");
      reset();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      throw error;
    }
  };

  const clearMessages = () => {
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
    isSubmitting: sendContactEmailMutation.isPending,
    errorMessage: sendContactEmailMutation.error?.message || "",
    successMessage,
    clearMessages,
  };
};

export default useTalkToUsForm;
