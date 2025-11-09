import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { exerciseServices } from "./exerciseServices";
import {
  Exercise,
  Workout,
  WorkoutPlan,
  UserWorkoutPlanDTO,
  ExerciseFeedbackCreatorDTO,
  WorkoutCompletionDTO,
} from "@/app/types/exercise";

const useExerciseQueries = (queryKey: string[]) => {
  const useListExercises = (): UseQueryResult<Exercise[], Error> => {
    return useQuery({
      queryKey: [...queryKey, 'exercises'],
      queryFn: () => exerciseServices.listExercises(),
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useGetExerciseById = (id: string): UseQueryResult<Exercise, Error> => {
    return useQuery({
      queryKey: [...queryKey, 'exercise', id],
      queryFn: () => exerciseServices.getExerciseById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useListWorkouts = (): UseQueryResult<Workout[], Error> => {
    return useQuery({
      queryKey: [...queryKey, 'workouts'],
      queryFn: () => exerciseServices.listWorkouts(),
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useListWorkoutPlans = (): UseQueryResult<WorkoutPlan[], Error> => {
    return useQuery({
      queryKey: [...queryKey, 'workoutPlans'],
      queryFn: () => exerciseServices.listWorkoutPlans(),
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useGetWorkoutPlanById = (id: string): UseQueryResult<WorkoutPlan, Error> => {
    return useQuery({
      queryKey: [...queryKey, 'workoutPlan', id],
      queryFn: () => exerciseServices.getWorkoutPlanById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useGetUserWorkoutPlan = (): UseQueryResult<UserWorkoutPlanDTO | null, Error> => {
    return useQuery({
      queryKey: [...queryKey, 'userWorkoutPlan'],
      queryFn: () => exerciseServices.getUserWorkoutPlan(),
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  };

  const useSubmitWorkoutFeedback = (): UseMutationResult<void, Error, ExerciseFeedbackCreatorDTO[]> => {
    return useMutation({
      mutationFn: (payload: ExerciseFeedbackCreatorDTO[]) => 
        exerciseServices.submitWorkoutFeedback(payload),
    });
  };

  const useSubmitWorkoutCompletion = (): UseMutationResult<void, Error, WorkoutCompletionDTO[]> => {
    return useMutation({
      mutationFn: (payload: WorkoutCompletionDTO[]) => 
        exerciseServices.submitWorkoutCompletion(payload),
    });
  };

  return {
    useListExercises,
    useGetExerciseById,
    useListWorkouts,
    useListWorkoutPlans,
    useGetWorkoutPlanById,
    useGetUserWorkoutPlan,
    useSubmitWorkoutFeedback,
    useSubmitWorkoutCompletion,
  };
};

export default useExerciseQueries;

