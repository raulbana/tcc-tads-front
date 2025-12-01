import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import complaintsService from "./complaintsService";
import exercisesService, {
  type ExerciseCategory,
  type ExerciseAttribute,
} from "./exercisesService";
import workoutsService from "./workoutsService";
import workoutPlansService from "./workoutPlansService";
import contentCategoriesService, {
  type ContentCategory,
} from "./contentCategoriesService";
import { ContentAdmin, ReportToggle } from "../schema/complaintsSchema";
import { ExerciseAdmin, ExerciseCreator } from "../schema/exercisesSchema";
import { WorkoutPlanAdmin } from "../schema/workoutPlansSchema";
import { WorkoutAdmin } from "../schema/workoutsSchema";
import {
  type ContentCategoryCreator,
} from "../schema/contentCategoriesSchema";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;
const retry = 1;

const useAdministrationQueries = (key: string[] = ["administration"]) => {
  const queryClient = useQueryClient();

  const invalidate = (suffix: string[]) =>
    queryClient.invalidateQueries({ queryKey: [...key, ...suffix] });

  const useComplaints = (): UseQueryResult<ContentAdmin[], Error> =>
    useQuery({
      queryKey: [...key, "complaints"],
      queryFn: () => complaintsService.listComplaints(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useValidateComplaint = (): UseMutationResult<
    void,
    Error,
    ReportToggle
  > =>
    useMutation({
      mutationFn: (payload) => complaintsService.validateReport(payload),
      onSuccess: () => invalidate(["complaints"]),
    });

  const useApplyStrike = (): UseMutationResult<void, Error, number> =>
    useMutation({
      mutationFn: (contentId) => complaintsService.applyStrike(contentId),
      onSuccess: () => invalidate(["complaints"]),
    });

  const useExercises = (): UseQueryResult<ExerciseAdmin[], Error> =>
    useQuery({
      queryKey: [...key, "exercises"],
      queryFn: () => exercisesService.listExercises(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateExercise = (): UseMutationResult<
    ExerciseAdmin,
    Error,
    ExerciseCreator
  > =>
    useMutation({
      mutationFn: (payload) => exercisesService.createExercise(payload),
      onSuccess: () => invalidate(["exercises"]),
    });

  const useUpdateExercise = (): UseMutationResult<
    ExerciseAdmin,
    Error,
    { id: number; data: ExerciseCreator }
  > =>
    useMutation({
      mutationFn: ({ id, data }) => exercisesService.updateExercise(id, data),
      onSuccess: () => invalidate(["exercises"]),
    });

  const useDeleteExercise = (): UseMutationResult<void, Error, number> =>
    useMutation({
      mutationFn: (id) => exercisesService.deleteExercise(id),
      onSuccess: () => invalidate(["exercises"]),
    });

  const useExerciseCategories = (): UseQueryResult<ExerciseCategory[], Error> =>
    useQuery({
      queryKey: [...key, "exerciseCategories"],
      queryFn: () => exercisesService.listCategories(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateExerciseCategory = (): UseMutationResult<
    ExerciseCategory,
    Error,
    { name: string; description?: string | null }
  > =>
    useMutation({
      mutationFn: (payload) => exercisesService.createCategory(payload),
      onSuccess: () => invalidate(["exerciseCategories"]),
    });

  const useUpdateExerciseCategory = (): UseMutationResult<
    ExerciseCategory,
    Error,
    { id: number; name: string; description?: string | null }
  > =>
    useMutation({
      mutationFn: ({ id, name, description }) =>
        exercisesService.updateCategory(id, { name, description }),
      onSuccess: () => invalidate(["exerciseCategories"]),
    });

  const useDeleteExerciseCategory = (): UseMutationResult<
    void,
    Error,
    number
  > =>
    useMutation({
      mutationFn: (id) => exercisesService.deleteCategory(id),
      onSuccess: () => invalidate(["exerciseCategories"]),
    });

  const useExerciseAttributes = (): UseQueryResult<
    ExerciseAttribute[],
    Error
  > =>
    useQuery({
      queryKey: [...key, "exerciseAttributes"],
      queryFn: () => exercisesService.listAttributes(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateExerciseAttribute = (): UseMutationResult<
    ExerciseAttribute,
    Error,
    { name: string; description: string; type: number }
  > =>
    useMutation({
      mutationFn: (payload) => exercisesService.createAttribute(payload),
      onSuccess: () => invalidate(["exerciseAttributes"]),
    });

  const useUpdateExerciseAttribute = (): UseMutationResult<
    ExerciseAttribute,
    Error,
    { id: number; name: string; description: string; type: number }
  > =>
    useMutation({
      mutationFn: ({ id, ...payload }) =>
        exercisesService.updateAttribute(id, payload),
      onSuccess: () => invalidate(["exerciseAttributes"]),
    });

  const useDeleteExerciseAttribute = (): UseMutationResult<
    void,
    Error,
    number
  > =>
    useMutation({
      mutationFn: (id) => exercisesService.deleteAttribute(id),
      onSuccess: () => invalidate(["exerciseAttributes"]),
    });

  const useWorkouts = (): UseQueryResult<WorkoutAdmin[], Error> =>
    useQuery({
      queryKey: [...key, "workouts"],
      queryFn: () => workoutsService.listWorkouts(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateWorkout = (): UseMutationResult<
    WorkoutAdmin,
    Error,
    {
      name: string;
      description: string;
      totalDuration: number;
      difficultyLevel: string;
      exerciseIds: Record<string, number>;
    }
  > =>
    useMutation({
      mutationFn: (payload) => workoutsService.createWorkout(payload),
      onSuccess: () => invalidate(["workouts"]),
    });

  const useUpdateWorkout = (): UseMutationResult<
    WorkoutAdmin,
    Error,
    {
      id: number;
      payload: {
        name: string;
        description: string;
        totalDuration: number;
        difficultyLevel: string;
        exerciseIds: Record<string, number>;
      };
    }
  > =>
    useMutation({
      mutationFn: ({ id, payload }) =>
        workoutsService.updateWorkout(id, payload),
      onSuccess: () => invalidate(["workouts"]),
    });

  const useDeleteWorkout = (): UseMutationResult<void, Error, number> =>
    useMutation({
      mutationFn: (id) => workoutsService.deleteWorkout(id),
      onSuccess: () => invalidate(["workouts"]),
    });

  const useWorkoutPlans = (): UseQueryResult<WorkoutPlanAdmin[], Error> =>
    useQuery({
      queryKey: [...key, "workoutPlans"],
      queryFn: () => workoutPlansService.listPlans(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateWorkoutPlan = (): UseMutationResult<
    WorkoutPlanAdmin,
    Error,
    {
      name: string;
      description: string;
      workoutIds: Record<string, number>;
      daysPerWeek: number;
      totalWeeks: number;
      iciqScoreMin: number;
      iciqScoreMax: number;
      ageMin: number;
      ageMax: number;
    }
  > =>
    useMutation({
      mutationFn: (payload) => workoutPlansService.createPlan(payload),
      onSuccess: () => invalidate(["workoutPlans"]),
    });

  const useUpdateWorkoutPlan = (): UseMutationResult<
    WorkoutPlanAdmin,
    Error,
    {
      id: number;
      payload: {
        name: string;
        description: string;
        workoutIds: Record<string, number>;
        daysPerWeek: number;
        totalWeeks: number;
        iciqScoreMin: number;
        iciqScoreMax: number;
        ageMin: number;
        ageMax: number;
      };
    }
  > =>
    useMutation({
      mutationFn: ({ id, payload }) =>
        workoutPlansService.updatePlan(id, payload),
      onSuccess: () => invalidate(["workoutPlans"]),
    });

  const useDeleteWorkoutPlan = (): UseMutationResult<void, Error, number> =>
    useMutation({
      mutationFn: (id) => workoutPlansService.deletePlan(id),
      onSuccess: () => invalidate(["workoutPlans"]),
    });

  const useContentCategories = (): UseQueryResult<ContentCategory[], Error> =>
    useQuery({
      queryKey: [...key, "contentCategories"],
      queryFn: () => contentCategoriesService.listCategories(),
      staleTime,
      gcTime,
      retry,
      refetchOnWindowFocus: false,
    });

  const useCreateContentCategory = (): UseMutationResult<
    ContentCategory,
    Error,
    ContentCategoryCreator
  > =>
    useMutation({
      mutationFn: (payload) => contentCategoriesService.createCategory(payload),
      onSuccess: () => invalidate(["contentCategories"]),
    });

  const useUpdateContentCategory = (): UseMutationResult<
    ContentCategory,
    Error,
    { id: number; data: ContentCategoryCreator }
  > =>
    useMutation({
      mutationFn: ({ id, data }) =>
        contentCategoriesService.updateCategory(id, data),
      onSuccess: () => invalidate(["contentCategories"]),
    });

  const useDeleteContentCategory = (): UseMutationResult<
    void,
    Error,
    number
  > =>
    useMutation({
      mutationFn: (id) => contentCategoriesService.deleteCategory(id),
      onSuccess: () => invalidate(["contentCategories"]),
    });

  return {
    useComplaints,
    useValidateComplaint,
    useApplyStrike,
    useExercises,
    useCreateExercise,
    useUpdateExercise,
    useDeleteExercise,
    useExerciseCategories,
    useCreateExerciseCategory,
    useUpdateExerciseCategory,
    useDeleteExerciseCategory,
    useExerciseAttributes,
    useCreateExerciseAttribute,
    useUpdateExerciseAttribute,
    useDeleteExerciseAttribute,
    useWorkouts,
    useCreateWorkout,
    useUpdateWorkout,
    useDeleteWorkout,
    useWorkoutPlans,
    useCreateWorkoutPlan,
    useUpdateWorkoutPlan,
    useDeleteWorkoutPlan,
    useContentCategories,
    useCreateContentCategory,
    useUpdateContentCategory,
    useDeleteContentCategory,
  };
};

export default useAdministrationQueries;
