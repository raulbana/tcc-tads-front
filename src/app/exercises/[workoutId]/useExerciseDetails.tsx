"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Workout } from "@/app/types/exercise";
import { loadWorkoutFromSession } from "../utils/workoutStorage";

const useExerciseDetails = (workoutId: string) => {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workoutId) {
      setError(new Error("Treino não informado"));
      setIsLoading(false);
      return;
    }

    const storedWorkout = loadWorkoutFromSession(workoutId);

    if (storedWorkout) {
      setWorkout(storedWorkout);
      setError(null);
    } else {
      setError(
        new Error(
          "Treino não encontrado. Volte à tela anterior e selecione o treino novamente."
        )
      );
    }

    setIsLoading(false);
  }, [workoutId]);

  const handleStartWorkout = useCallback(() => {
    if (workout) {
      router.push(`/exercises/workout/${workout.id}`);
    }
  }, [router, workout]);

  return {
    workout,
    isLoading,
    error,
    handleStartWorkout,
  };
};

export default useExerciseDetails;

