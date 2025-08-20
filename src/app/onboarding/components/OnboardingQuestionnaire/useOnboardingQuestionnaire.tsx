"use client";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICIQAnswers, iciqSchema } from "./schema/questionnaire";
import { QuestionProps } from "../QuestionSection/QuestionSection";

import { Question } from "@/app/types/question";

const mockQuestions: Question[] = [
  {
    id: "birthdate",
    text: "Qual é a sua data de nascimento?",
    type: "date",
    required: true,
  },
  {
    id: "gender",
    text: "Qual é o seu gênero?",
    type: "radio",
    required: true,
    options: [
      { label: "Masculino", value: "male" },
      { label: "Feminino", value: "female" },
      { label: "Outro", value: "other" },
    ],
  },
  {
    id: "q3_frequency",
    text: "Com que frequência você perde urina?",
    type: "slider",
    required: true,
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: "q4_amount",
    text: "Qual a quantidade de urina que você perde?",
    type: "slider",
    required: true,
    min: 0,
    max: 6,
    step: 1,
  },
  {
    id: "q5_interference",
    text: "O quanto perder urina interfere na sua vida diária?",
    type: "slider",
    required: true,
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: "q6_when",
    text: "Quando você perde urina?",
    type: "checkbox",
    required: true,
    options: [
      { label: "Nunca", value: "never" },
      { label: "Antes de chegar ao banheiro", value: "before_bathroom" },
      { label: "Quando tusso ou espirro", value: "cough_sneeze" },
      { label: "Quando estou dormindo", value: "sleeping" },
      { label: "Quando faço atividade física", value: "exercise" },
      {
        label: "Quando termino de urinar e estou me vestindo",
        value: "after_urinating",
      },
      { label: "Sem razão óbvia", value: "no_reason" },
      { label: "O tempo todo", value: "all_time" },
    ],
  },
];

const useOnboardingQuestionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm<ICIQAnswers>({
    resolver: zodResolver(iciqSchema),
    mode: "onChange",
    defaultValues: {
      birthdate: new Date().toISOString(),
      gender: "",
      q3_frequency: 0,
      q4_amount: 0,
      q5_interference: 0,
      q6_when: [],
    },
  });

  const getDefaultValueForQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
        return "";
      case "date":
        return new Date().toISOString();
      case "slider":
        return question.min || 0;
      case "radio":
        return "";
      case "checkbox":
        return [];
      default:
        return "";
    }
  };

  const onContinue = useCallback(
    async (field: keyof ICIQAnswers) => {
      try {
        // Usar trigger para validar o campo específico
        const isFieldValid = await trigger(field);

        if (isFieldValid) {
          setCurrentQuestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < mockQuestions.length) {
              // Limpar o campo da próxima questão para evitar valores residuais
              const nextQuestion = mockQuestions[nextIndex];
              const nextField = nextQuestion.id as keyof ICIQAnswers;
              const defaultValue = getDefaultValueForQuestion(nextQuestion);
              setValue(nextField, defaultValue);

              return nextIndex;
            } else {
              onSubmitAnswer();
              return prevIndex;
            }
          });

          // Limpar mensagem de erro se existir
          if (errorMessage) {
            setErrorMessage("");
          }
        } else {
          // Obter o erro específico do campo
          const { error } = getFieldState(field);
          setErrorMessage(error?.message ?? "Campo obrigatório");
        }
      } catch (error) {
        console.error("Erro na validação:", error);
        setErrorMessage("Erro na validação do campo");
      }
    },
    [trigger, getFieldState, setValue, errorMessage]
  );

  const clearError = () => {
    setErrorMessage("");
  };

  const onSubmitAnswer = useCallback(() => {
    console.log("Respostas finais:", getValues());

    handleSubmit(
      (data) => {
        console.log("Dados validados:", data);
        console.log("Formulário válido:", isValid);

        // Aqui você pode enviar os dados para a API
        // await submitAnswers(data);

        router.push("/");
      },
      (errors) => {
        console.error("Erros de validação:", errors);
        setErrorMessage("Existem erros no formulário");
      }
    )();
  }, [getValues, handleSubmit, isValid, router]);

  const navigateBack = () => {
    if (currentQuestionIndex === 0) {
      router.push("/onboarding");
    } else {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const questionInputs: QuestionProps[] = mockQuestions.map((question) => ({
    question,
    control: control,
    onContinue: () => onContinue(question.id as keyof ICIQAnswers),
    setValue: setValue,
  }));

  return {
    questionInputs,
    currentQuestionIndex,
    errorMessage,
    isLoading,
    navigateBack,
    clearError,
  };
};

export default useOnboardingQuestionnaire;
