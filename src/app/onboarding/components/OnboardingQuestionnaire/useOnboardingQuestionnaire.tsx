"use client";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICIQAnswers, iciqSchema } from "./schema/questionnaire";
import { QuestionProps } from "../QuestionSection/QuestionSection";
import { Question } from "@/app/types/question";
import useOnboardingQueries from "../../services/onboardingQueryFactory";

const useOnboardingQuestionnaire = () => {
  const { getQuestions } = useOnboardingQueries(["onboarding", "questions"]);
  const {
    data: questionList = [],
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = getQuestions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    trigger,
    setValue,
    formState: { isValid },
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
    questionList.forEach((q: Question) => {
      const field = q.id as keyof ICIQAnswers;
      const current = (getValues() as ICIQAnswers)[field];
      if (current === undefined) {
        setValue(field, getDefaultValueForQuestion(q));
      }
    });
  }, [questionList, getValues, setValue]);

  useEffect(() => {
    if (questionsError) {
      setErrorMessage("Erro ao carregar perguntas. Tente novamente.");
    }
  }, [questionsError]);

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

  const onSubmitAnswer = useCallback(() => {
    handleSubmit(
      (data) => {
        console.log("Dados validados:", data);
        console.log("Formulário válido:", isValid);
        router.push("/");
      },
      (errors) => {
        console.error("Erros de validação:", errors);
        setErrorMessage("Existem erros no formulário");
      }
    )();
  }, [handleSubmit, isValid, router, setErrorMessage]);

  const onContinue = useCallback(
    async (field: keyof ICIQAnswers) => {
      try {
        const isFieldValid = await trigger(field);

        if (isFieldValid) {
          setCurrentQuestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < questionList.length) {
              const nextQuestion = questionList[nextIndex];
              const nextField = nextQuestion.id as keyof ICIQAnswers;
              const defaultValue = getDefaultValueForQuestion(nextQuestion);
              setValue(nextField, defaultValue);
              return nextIndex;
            } else {
              onSubmitAnswer();
              return prevIndex;
            }
          });

          if (errorMessage) setErrorMessage("");
        } else {
          const { error } = getFieldState(field);
          setErrorMessage(error?.message ?? "Campo obrigatório");
        }
      } catch (e) {
        console.error("Erro na validação:", e);
        setErrorMessage("Erro na validação do campo");
      }
    },
    [
      trigger,
      getFieldState,
      setValue,
      questionList,
      onSubmitAnswer,
      errorMessage,
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

  const isLoading = isQuestionsLoading;

  const questionInputs: QuestionProps[] = questionList.map((question) => ({
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
    navigateBack,
    clearError,
    router,
  };
};

export default useOnboardingQuestionnaire;
