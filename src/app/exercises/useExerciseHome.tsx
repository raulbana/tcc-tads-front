"use client";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import useExerciseQueries from "./services/exerciseQueryFactory";
import { Exercise, Workout } from "@/app/types/exercise";
import { saveWorkoutToSession } from "./utils/workoutStorage";
import { useAuth } from "@/app/contexts/AuthContext";

const useExerciseHome = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queries = useExerciseQueries(["exercises"], isAuthenticated);
  const {
    data: userWorkoutPlan = null,
    isLoading,
    error,
  } = queries.useGetUserWorkoutPlan();

  const workouts = useMemo<Exercise[]>(() => {
    if (userWorkoutPlan?.workouts) {
      return userWorkoutPlan.workouts.flatMap(
        (w): Exercise[] => w.exercises || []
      );
    }
    return [];
  }, [userWorkoutPlan]);

  const handleWorkoutClick = useCallback(
    (exerciseId: string) => {
      const workout = userWorkoutPlan?.workouts.find((w: Workout) =>
        w.exercises.some((e: Exercise) => e.id === exerciseId)
      );
      if (workout) {
        saveWorkoutToSession(workout);
        router.push(`/exercises/${workout.id}`);
      }
    },
    [router, userWorkoutPlan]
  );

  return {
    workouts,
    handleWorkoutClick,
    isLoading,
    error,
  };
};

export default useExerciseHome;
