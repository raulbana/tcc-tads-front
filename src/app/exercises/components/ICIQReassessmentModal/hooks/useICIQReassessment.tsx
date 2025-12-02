"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ICIQReassessmentAnswers,
  iciqReassessmentSchema,
} from "../schema/iciqReassessmentSchema";
import { QuestionProps } from "@/app/onboarding/components/QuestionSection/QuestionSection";
import { Question } from "@/app/types/question";
import useOnboardingQueries from "@/app/onboarding/services/onboardingQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";
import { ICIQAnswers } from "@/app/onboarding/components/OnboardingQuestionnaire/schema/questionnaire";

const useICIQReassessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { getQuestions, submitAnswers } = useOnboardingQueries(["onboarding", "questions"]);
  const {
    data: questionList = [],
    isLoading,
    error,
  } = getQuestions;

  const submitAnswersMutation = submitAnswers;

  const iciqQuestions = useMemo(() => {
    return questionList.slice(2, 6);
  }, [questionList]);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (error && !isToastOpen) {
      setErrorMessage(
        "Erro ao carregar perguntas. Tente novamente mais tarde."
      );
      setIsToastOpen(true);
    }
  }, [error, isToastOpen]);

  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm<ICIQReassessmentAnswers>({
    resolver: zodResolver(iciqReassessmentSchema),
    mode: "onChange",
    defaultValues: {
      q3_frequency: 0,
      q4_amount: 0,
      q5_interference: 0,
      q6_when: [],
    },
  });

  const getDefaultValueForQuestion = (question: Question) => {
    switch (question.type) {
      case "slider":
        return question.min || 0;
      case "checkbox":
        return [];
      default:
        return "";
    }
  };

  const onSubmitAnswer = useCallback(async (): Promise<boolean> => {
    let success = false;

    const submitForm = handleSubmit(
      async (answers: ICIQReassessmentAnswers) => {
        const currentProfile = user?.profile;
        if (!currentProfile) {
          setErrorMessage("Erro: perfil do usuário não encontrado.");
          setIsToastOpen(true);
          success = false;
          return;
        }

        const formatAnswersForAPI = (): Record<string, string> => {
          const birthdate =
            currentProfile.birthDate || new Date().toISOString().split("T")[0];
          const gender = currentProfile.gender || "";

          const apiAnswers: Record<string, string> = {
            birthdate,
            gender,
            q3_frequency: String(answers.q3_frequency),
            q4_amount: String(answers.q4_amount),
            q5_interference: String(answers.q5_interference),
          };

          if (Array.isArray(answers.q6_when) && answers.q6_when.length > 0) {
            apiAnswers.q6_when = answers.q6_when.join(",");
          }

          return apiAnswers;
        };

        try {
          const submitData: {
            userId?: number;
            answers: Record<string, string>;
          } = {
            answers: formatAnswersForAPI(),
          };

          if (isAuthenticated && user) {
            submitData.userId = user.id;
          }

          const result = await submitAnswersMutation.mutateAsync(submitData);

          if (result.profile && user) {
            const updatedUser = {
              ...user,
              profile: {
                ...user.profile,
                birthDate: result.profile.birthDate,
                gender: result.profile.gender as "male" | "female" | "other",
                q1Score: result.profile.iciq3answer,
                q2Score: result.profile.iciq4answer,
                q3Score: result.profile.iciq5answer,
                q4Score: 0,
              },
            };
            localStorage.setItem("dailyiu_user", JSON.stringify(updatedUser));
          }

          success = true;
        } catch (error) {
          const errorMsg =
            error instanceof Error
              ? error.message
              : "Erro ao enviar respostas.";
          setErrorMessage(errorMsg);
          setIsToastOpen(true);
          success = false;
        }
      }
    );

    await submitForm();
    return success;
  }, [
    handleSubmit,
    user,
    isAuthenticated,
    submitAnswersMutation,
  ]);

  const onContinue = useCallback(
    async (field: keyof ICIQReassessmentAnswers) => {
      const isFieldValid = await trigger(field);

      if (isFieldValid) {
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < iciqQuestions.length) {
          const nextQuestion = iciqQuestions[nextIndex];
          const nextField = nextQuestion.id as keyof ICIQReassessmentAnswers;
          const defaultValue = getDefaultValueForQuestion(nextQuestion);

          if (typeof defaultValue === "number" || Array.isArray(defaultValue)) {
            setValue(nextField, defaultValue);
          } else {
            setValue(nextField, [] as any);
          }
          setCurrentQuestionIndex(nextIndex);

          if (errorMessage) {
            setErrorMessage("");
          }
        } else {
          const isFormValid = await trigger();
          if (isFormValid) {
            await onSubmitAnswer();
            return true;
          } else {
            const allErrors = Object.keys(errors);
            if (allErrors.length > 0) {
              const firstErrorField =
                allErrors[0] as keyof ICIQReassessmentAnswers;
              const { error } = getFieldState(firstErrorField);
              setErrorMessage(
                error?.message ??
                  "Por favor, preencha todos os campos corretamente"
              );
              setIsToastOpen(true);
            }
          }
        }
      } else {
        const { error } = getFieldState(field);
        setErrorMessage(error?.message ?? "Campo inválido");
        setIsToastOpen(true);
      }
      return false;
    },
    [
      trigger,
      currentQuestionIndex,
      iciqQuestions,
      getFieldState,
      setValue,
      errorMessage,
      errors,
      onSubmitAnswer,
    ]
  );

  const onCloseToast = () => {
    setIsToastOpen(false);
    setErrorMessage("");
  };

  const navigateBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const questionInputs: QuestionProps[] = iciqQuestions.map((question) => ({
    question,
    control: control as any,
    onContinue: () =>
      onContinue(question.id as keyof ICIQReassessmentAnswers),
    selectedValue: getValues(question.id as keyof ICIQReassessmentAnswers),
    setValue: setValue as any,
  }));

  const resetForm = useCallback(() => {
    setCurrentQuestionIndex(0);
    setErrorMessage("");
    setIsToastOpen(false);
    setValue("q3_frequency", 0);
    setValue("q4_amount", 0);
    setValue("q5_interference", 0);
    setValue("q6_when", []);
  }, [setValue]);

  return {
    currentQuestion: iciqQuestions[currentQuestionIndex],
    isLoading: isLoading || submitAnswersMutation.isPending,
    isValid,
    onContinue,
    handleSubmit,
    control,
    onSubmitAnswer,
    errors,
    questionInputs,
    currentQuestionIndex,
    isToastOpen,
    errorMessage,
    onCloseToast,
    navigateBack,
    resetForm,
    iciqQuestions,
  };
};

export default useICIQReassessment;

