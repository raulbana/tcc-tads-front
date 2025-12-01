import { useQuery, useMutation, UseQueryResult, UseMutationResult, QueryKey } from "@tanstack/react-query";
import { exerciseServices } from "./exerciseServices";
import {
  Exercise,
  UserWorkoutPlanDTO,
  ExerciseFeedbackCreatorDTO,
  WorkoutCompletionDTO,
} from "@/app/types/exercise";

const useExerciseQueries = (queryKey: QueryKey, isLoggedIn?: boolean) => {
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

  const useGetUserWorkoutPlan = (): UseQueryResult<UserWorkoutPlanDTO | null, Error> => {
    return useQuery({
      queryKey: [...queryKey, 'userWorkoutPlan'],
      queryFn: () => exerciseServices.getUserWorkoutPlan(),
      enabled: isLoggedIn ?? false,
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
    useGetExerciseById,
    useGetUserWorkoutPlan,
    useSubmitWorkoutFeedback,
    useSubmitWorkoutCompletion,
  };
};

export default useExerciseQueries;

