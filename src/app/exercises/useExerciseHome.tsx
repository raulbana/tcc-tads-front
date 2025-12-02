"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useExerciseQueries from "./services/exerciseQueryFactory";
import { Exercise, Workout } from "@/app/types/exercise";
import { saveWorkoutToSession } from "./utils/workoutStorage";
import { useAuth } from "@/app/contexts/AuthContext";
import { shouldBlockExercises } from "./utils/profileUtils";

const useExerciseHome = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isReassessmentModalOpen, setIsReassessmentModalOpen] = useState(false);

  const queries = useExerciseQueries(["exercises"], isAuthenticated);
  const {
    data: userWorkoutPlan = null,
    isLoading,
    error,
    refetch: refetchWorkoutPlan,
  } = queries.useGetUserWorkoutPlan();

  const isExercisesBlocked = useMemo(() => {
    if (user?.profile) {
      const profileDTO = {
        birthDate: user.profile.birthDate,
        gender: user.profile.gender,
        iciq3answer: user.profile.q1Score,
        iciq4answer: user.profile.q2Score,
        iciq5answer: user.profile.q3Score,
        iciqScore: user.profile.q1Score + user.profile.q2Score + user.profile.q3Score + (user.profile.q4Score || 0),
        urinationLoss: "",
      };
      return shouldBlockExercises(profileDTO);
    }
    return false;
  }, [user]);

  const hasNoActivePlan = useMemo(() => {
    if (isLoading) return false;
    if (!userWorkoutPlan) return true;
    if (!userWorkoutPlan.workouts || userWorkoutPlan.workouts.length === 0)
      return true;
    if (userWorkoutPlan.completed) return true;
    return false;
  }, [userWorkoutPlan, isLoading]);

  useEffect(() => {
    if (!isLoading && hasNoActivePlan && !isExercisesBlocked) {
      setIsReassessmentModalOpen(true);
    }
  }, [isLoading, hasNoActivePlan, isExercisesBlocked]);

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
      if (isExercisesBlocked) {
        return;
      }
      const workout = userWorkoutPlan?.workouts.find((w: Workout) =>
        w.exercises.some((e: Exercise) => e.id === exerciseId)
      );
      if (workout) {
        saveWorkoutToSession(workout);
        router.push(`/exercises/${workout.id}`);
      }
    },
    [router, userWorkoutPlan, isExercisesBlocked]
  );

  const handleCloseReassessmentModal = useCallback(() => {
    setIsReassessmentModalOpen(false);
  }, []);

  const handleReassessmentSuccess = useCallback(async () => {
    setIsReassessmentModalOpen(false);
    await refetchWorkoutPlan();
  }, [refetchWorkoutPlan]);

  return {
    workouts,
    handleWorkoutClick,
    isLoading,
    error,
    isExercisesBlocked,
    isReassessmentModalOpen,
    handleCloseReassessmentModal,
    handleReassessmentSuccess,
    hasNoActivePlan,
  };
};

export default useExerciseHome;
