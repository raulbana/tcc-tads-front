"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useExerciseQueries from "../../services/exerciseQueryFactory";
import { Exercise, Workout, WorkoutEvaluation } from "@/app/types/exercise";
import { loadWorkoutFromSession } from "../../utils/workoutStorage";

type ExerciseWorkoutStep = "START_WORKOUT" | "EXERCISE" | "EVALUATE";

const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const extractErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as any).response?.data?.message
  ) {
    return (error as any).response.data.message as string;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
};

const useExerciseWorkout = (workoutId: string | undefined) => {
  const router = useRouter();
  const queries = useExerciseQueries(["exercises", "workout", workoutId || ""]);

  const submitWorkoutCompletionMutation = queries.useSubmitWorkoutCompletion();
  const { refetch: refetchUserWorkoutPlan } = queries.useGetUserWorkoutPlan();

  const workoutStartTimeRef = useRef<Date | null>(null);
  const [workout, setWorkout] = useState<Workout | undefined>();
  const [currentExercise, setCurrentExercise] = useState<
    Exercise | undefined
  >();
  const [step, setStep] = useState<ExerciseWorkoutStep>("START_WORKOUT");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workoutId) {
      setError(new Error("ID do treino não fornecido"));
      setIsLoading(false);
      return;
    }

    const storedWorkout = loadWorkoutFromSession(workoutId);

    if (storedWorkout) {
      setWorkout(storedWorkout);
      if (storedWorkout.exercises && storedWorkout.exercises.length > 0) {
        setCurrentExercise(storedWorkout.exercises[0]);
      }
      setIsLoading(false);
      return;
    }

    setError(new Error("Treino não encontrado"));
    setIsLoading(false);
  }, [workoutId]);

  const checkUserWorkoutPlan = async () => {
    const result = await refetchUserWorkoutPlan();
    if (!result.data) {
      throw new Error(
        "Usuário não possui um plano de treino ativo. Por favor, complete o onboarding para iniciar um plano de treino."
      );
    }
  };

  const onStartWorkout = async () => {
    if (!workout) return;

    try {
      await checkUserWorkoutPlan();
      setStep("EXERCISE");
      workoutStartTimeRef.current = new Date();
      const first = workout.exercises[0];
      setCurrentExercise({ ...first, status: "IN_PROGRESS" });
      setWorkout({ ...workout, status: "IN_PROGRESS" });
    } catch (error: unknown) {
      const backendMessage = extractErrorMessage(error);
      const fallbackMessage =
        "Você precisa ter um plano de treino ativo para iniciar um treino. Por favor, complete o onboarding.";
      setErrorMessage(backendMessage || fallbackMessage);
      setIsToastOpen(true);
      return;
    }
  };

  const onLeaveWorkout = () => {
    setStep("START_WORKOUT");
    if (!workout) return;
    const first = workout.exercises[0];
    setWorkout({ ...workout, status: "PAUSED" });
    setCurrentExercise({ ...first, status: "PENDING" });
  };

  const onFinishWorkout = () => {
    setStep("EVALUATE");
    if (!workout) return;
    const first = workout.exercises[0];
    setWorkout({ ...workout, status: "COMPLETED" });
    setCurrentExercise({ ...first, status: "COMPLETED" });
  };

  const onNextExercise = async () => {
    if (!workout || !workout.exercises || !currentExercise) return;
    const currentIndex = workout.exercises.findIndex(
      (exercise) => exercise.id === currentExercise.id
    );

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((exercise) =>
        exercise.id === currentExercise.id
          ? { ...exercise, status: "COMPLETED" }
          : exercise
      ),
    });

    if (currentIndex !== -1 && currentIndex < workout.exercises.length - 1) {
      setCurrentExercise(workout.exercises[currentIndex + 1]);
      setWorkout((prevWorkout) => ({
        ...prevWorkout!,
        exercises: prevWorkout!.exercises.map((exercise) => {
          if (exercise.id === workout.exercises[currentIndex + 1].id) {
            return { ...exercise, status: "IN_PROGRESS" };
          }
          return exercise;
        }),
      }));
    } else {
      if (workout && workoutStartTimeRef.current) {
        const completedAt = new Date();
        const workoutIdNum = Number(workout.id);

        if (!isNaN(workoutIdNum)) {
          try {
            await checkUserWorkoutPlan();
            await submitWorkoutCompletionMutation.mutateAsync([
              {
                workoutId: workoutIdNum,
                completedAt: formatLocalDateTime(completedAt),
              },
            ]);
          } catch (error: unknown) {
            const backendMessage = extractErrorMessage(error);
            const fallbackMessage =
              "Não foi possível registrar a conclusão do treino. Verifique se você possui um plano de treino ativo.";
            setErrorMessage(backendMessage || fallbackMessage);
            setIsToastOpen(true);
          }
        }
      }
      setStep("EVALUATE");
    }
  };

  const onPreviousExercise = () => {
    if (!workout || !workout.exercises || !currentExercise) return;
    const currentIndex = workout.exercises.findIndex(
      (exercise) => exercise.id === currentExercise.id
    );
    if (currentIndex !== -1 && currentIndex > 0) {
      setCurrentExercise(workout.exercises[currentIndex - 1]);
    }
  };

  const onEvaluate = () => {
    router.push("/exercises");
  };

  const onCloseToast = () => {
    setIsToastOpen(false);
    setErrorMessage("");
  };

  return {
    workout,
    currentExercise,
    step,
    isLoading,
    error,
    onStartWorkout,
    onLeaveWorkout,
    onFinishWorkout,
    onNextExercise,
    onPreviousExercise,
    onEvaluate,
    errorMessage,
    isToastOpen,
    onCloseToast,
  };
};

export default useExerciseWorkout;
