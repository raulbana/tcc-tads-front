"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICIQAnswers, iciqSchema } from "./schema/questionnaire";
import { QuestionProps } from "../QuestionSection/QuestionSection";
import { Question } from "@/app/types/question";
import useOnboardingQueries from "../../services/onboardingQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";

const useOnboardingQuestionnaire = () => {
  const { getQuestions, submitAnswers } = useOnboardingQueries(["onboarding", "questions"]);
  const {
    data: questionList = [],
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = getQuestions;

  const limitedQuestionList = useMemo(() => {
    return questionList.slice(0, 6);
  }, [questionList]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const { saveOnboardingData, user } = useAuth();

  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    trigger,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    limitedQuestionList.forEach((q: Question) => {
      const field = q.id as keyof ICIQAnswers;
      const current = (getValues() as ICIQAnswers)[field];
      if (current === undefined) {
        setValue(field, getDefaultValueForQuestion(q));
      }
    });
  }, [limitedQuestionList, getValues, setValue]);

  useEffect(() => {
    if (questionsError) {
      setErrorMessage("Erro ao carregar perguntas. Tente novamente.");
    }
  }, [questionsError]);

  const isNumericField = (fieldId: string): boolean => {
    return ['q3_frequency', 'q4_amount', 'q5_interference'].includes(fieldId);
  };

  const getDefaultValueForQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
        return "";
      case "date":
        return new Date().toISOString();
      case "slider":
        return question.min || 0;
      case "radio":
        return isNumericField(question.id) ? 0 : "";
      case "checkbox":
        return [];
      default:
        return "";
    }
  };

  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatAnswersForAPI = (answers: ICIQAnswers): Record<string, string> => {
    const apiAnswers: Record<string, string> = {
      birthdate: formatDateForAPI(answers.birthdate),
      gender: answers.gender,
      q3_frequency: String(answers.q3_frequency),
      q4_amount: String(answers.q4_amount),
      q5_interference: String(answers.q5_interference),
    };

    if (Array.isArray(answers.q6_when) && answers.q6_when.length > 0) {
      apiAnswers.q6_when = answers.q6_when.join(',');
    }

    return apiAnswers;
  };

  const onSubmitAnswer = useCallback(async () => {
    handleSubmit(
      async (data) => {
        try {
          setIsSubmitting(true);
          setErrorMessage("");

          const submitData = {
            userId: user?.id,
            answers: formatAnswersForAPI(data),
          };

          const result = await submitAnswers.mutateAsync(submitData);

          saveOnboardingData(result.profile, result.workoutPlan);

          if (!user) {
            router.push("/authentication/register");
          } else {
            router.push("/");
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Erro ao enviar respostas. Tente novamente.";
          setErrorMessage(errorMsg);
        } finally {
          setIsSubmitting(false);
        }
      },
      (errors) => {
        setErrorMessage("Existem erros no formulário");
      }
    )();
  }, [handleSubmit, submitAnswers, saveOnboardingData, router, user]);

  const onContinue = useCallback(
    async (field: keyof ICIQAnswers) => {
      try {
        const isFieldValid = await trigger(field);

        if (isFieldValid) {
          const nextIndex = currentQuestionIndex + 1;

          if (nextIndex < limitedQuestionList.length) {
            const nextQuestion = limitedQuestionList[nextIndex];
            const nextField = nextQuestion.id as keyof ICIQAnswers;
            const defaultValue = getDefaultValueForQuestion(nextQuestion);
            setValue(nextField, defaultValue);
            setCurrentQuestionIndex(nextIndex);

            if (errorMessage) {
              setErrorMessage("");
            }
          } else {
            const isFormValid = await trigger();
            if (isFormValid) {
              await onSubmitAnswer();
            } else {
              const allErrors = Object.keys(errors);
              if (allErrors.length > 0) {
                const firstErrorField = allErrors[0] as keyof ICIQAnswers;
                const { error } = getFieldState(firstErrorField);
                setErrorMessage(
                  error?.message ?? "Por favor, preencha todos os campos corretamente"
                );
              }
            }
          }
        } else {
          const { error } = getFieldState(field);
          setErrorMessage(error?.message ?? "Campo inválido");
        }
      } catch (e) {
        setErrorMessage("Erro na validação do campo");
      }
    },
    [
      trigger,
      currentQuestionIndex,
      limitedQuestionList,
      getFieldState,
      setValue,
      errorMessage,
      errors,
      onSubmitAnswer,
    ]
  );

  const navigateBack = () => {
    if (currentQuestionIndex === 0) {
      router.push("/onboarding");
    } else {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const clearError = () => setErrorMessage("");

  const isLoading = isQuestionsLoading || isSubmitting;

  const questionInputs: QuestionProps[] = limitedQuestionList.map((question) => ({
    question,
    control,
    onContinue: () => onContinue(question.id as keyof ICIQAnswers),
    setValue: (
      name: keyof ICIQAnswers,
      value: ICIQAnswers[keyof ICIQAnswers]
    ) => setValue(name, value),
  }));

  return {
    questionInputs,
    currentQuestionIndex,
    errorMessage,
    isLoading,
    isSubmitting,
    navigateBack,
    clearError,
    router,
  };
};

export default useOnboardingQuestionnaire;
