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
  const [hasUserDismissedModal, setHasUserDismissedModal] = useState(false);

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
        iciqScore:
          user.profile.q1Score +
          user.profile.q2Score +
          user.profile.q3Score +
          (user.profile.q4Score || 0),
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
    // Se há workouts e o plano não está completo, há um plano ativo
    // nextWorkout pode ser 0 (falsy), mas isso não significa que não há plano
    return false;
  }, [userWorkoutPlan, isLoading]);

  useEffect(() => {
    // Não fazer nada enquanto está carregando
    if (isLoading) {
      return;
    }

    // Fechar modal se houver um plano ativo
    if (!hasNoActivePlan) {
      setIsReassessmentModalOpen(false);
      // Resetar flag quando um novo plano for criado
      if (hasUserDismissedModal) {
        setHasUserDismissedModal(false);
      }
      return;
    }

    // Abrir modal apenas se não foi fechado pelo usuário e não há plano ativo
    if (hasNoActivePlan && !isExercisesBlocked && !hasUserDismissedModal) {
      setIsReassessmentModalOpen(true);
    } else if (hasNoActivePlan && hasUserDismissedModal) {
      // Garantir que o modal está fechado se foi fechado pelo usuário
      setIsReassessmentModalOpen(false);
    }
  }, [isLoading, hasNoActivePlan, isExercisesBlocked, hasUserDismissedModal]);

  const workouts = useMemo<Exercise[]>(() => {
    if (userWorkoutPlan?.workouts) {
      return userWorkoutPlan.workouts.flatMap(
        (w): Exercise[] => w.exercises || []
      );
    }
    return [];
  }, [userWorkoutPlan]);

  const nextWorkout = useMemo(() => {
    if (!userWorkoutPlan?.nextWorkout || !userWorkoutPlan?.workouts) {
      return null;
    }
    const workoutIndex = userWorkoutPlan.nextWorkout - 1; // Converter para 0-based
    return userWorkoutPlan.workouts[workoutIndex] || null;
  }, [userWorkoutPlan]);

  const nextWorkoutExerciseIds = useMemo(() => {
    if (!nextWorkout) return new Set<string>();
    return new Set(nextWorkout.exercises.map((e: Exercise) => e.id));
  }, [nextWorkout]);

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
    setHasUserDismissedModal(true); // Marcar como fechado pelo usuário
  }, []);

  const handleReassessmentSuccess = useCallback(async () => {
    setIsReassessmentModalOpen(false);
    setHasUserDismissedModal(false); // Resetar para permitir que o modal apareça novamente se necessário
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
    nextWorkout,
    nextWorkoutExerciseIds,
    userWorkoutPlan,
  };
};

export default useExerciseHome;
