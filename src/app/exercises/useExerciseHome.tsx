"use client";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import useExerciseQueries from "./services/exerciseQueryFactory";
import { Workout } from "@/app/types/exercise";
import { saveWorkoutToSession } from "./utils/workoutStorage";

const useExerciseHome = () => {
  const router = useRouter();
  const queries = useExerciseQueries(["exercises"]);
  const {
    data: workoutsApi = [],
    isLoading,
    error,
  } = queries.useListWorkouts();

  const workouts = useMemo<Workout[]>(() => {
    return workoutsApi || [];
  }, [workoutsApi]);

  const handleWorkoutClick = useCallback(
    (workout: Workout) => {
      saveWorkoutToSession(workout);
      router.push(`/exercises/${workout.id}`);
    },
    [router]
  );

  return {
    workouts,
    handleWorkoutClick,
    isLoading,
    error,
  };
};

export default useExerciseHome;
