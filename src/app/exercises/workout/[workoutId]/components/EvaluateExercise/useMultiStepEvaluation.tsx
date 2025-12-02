"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exercise, Workout } from "@/app/types/exercise";
import { QuestionOptions } from "@/app/types/question";
import {
  workoutEvaluationSchema,
  exerciseSpecificEvaluationSchema,
  WorkoutEvaluationAnswers,
  ExerciseSpecificEvaluationAnswers,
} from "./schema/exerciseEvaluation";
import useExerciseQueries from "@/app/exercises/services/exerciseQueryFactory";

const RATING_EASILY = 1;
const RATING_WITH_DIFFICULTY = 2;
const RATING_COULD_NOT_COMPLETE = 3;

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type EvaluationStep = "WORKOUT_EVALUATION" | "EXERCISE_EVALUATION";

interface UseMultiStepEvaluationProps {
  workout: Workout;
  currentExercise: Exercise;
  onComplete: (data: {
    workoutEvaluation: WorkoutEvaluationAnswers;
    exercisesEvaluations: Array<{
      exerciseId: string;
      evaluation: ExerciseSpecificEvaluationAnswers;
    }>;
  }) => void;
  scrollToTop?: () => void;
}

const useMultiStepEvaluation = ({
  workout,
  currentExercise: _currentExercise,
  onComplete,
  scrollToTop,
}: UseMultiStepEvaluationProps) => {
  const queries = useExerciseQueries(["exercises", "feedback"]);
  const submitWorkoutFeedbackMutation = queries.useSubmitWorkoutFeedback();

  const [currentStep, setCurrentStep] =
    useState<EvaluationStep>("WORKOUT_EVALUATION");
  const [workoutEvaluationData, setWorkoutEvaluationData] =
    useState<WorkoutEvaluationAnswers | null>(null);
  const [currentExerciseEvaluationIndex, setCurrentExerciseEvaluationIndex] =
    useState(0);
  const [exercisesEvaluations, setExercisesEvaluations] = useState<
    Array<{
      exerciseId: string;
      evaluation: ExerciseSpecificEvaluationAnswers;
    }>
  >([]);

  const workoutForm = useForm<WorkoutEvaluationAnswers>({
    resolver: zodResolver(workoutEvaluationSchema),
    mode: "onChange",
    defaultValues: {
      difficulty: undefined,
    },
  });

  const exerciseForm = useForm<ExerciseSpecificEvaluationAnswers>({
    resolver: zodResolver(exerciseSpecificEvaluationSchema),
    mode: "onChange",
    defaultValues: {
      completion: undefined,
    },
  });

  const resetExerciseForm = exerciseForm.reset;

  useEffect(() => {
    if (currentStep === "EXERCISE_EVALUATION") {
      resetExerciseForm({
        completion: undefined,
      });
    }
  }, [currentExerciseEvaluationIndex, currentStep, resetExerciseForm]);

  const totalExercises = workout.exercises.length;
  const currentExercise = workout.exercises[currentExerciseEvaluationIndex];
  const isLastExercise = currentExerciseEvaluationIndex === totalExercises - 1;
  const isLastStep = currentStep === "EXERCISE_EVALUATION" && isLastExercise;

  const totalSteps = 1 + totalExercises;
  const currentStepIndex =
    currentStep === "WORKOUT_EVALUATION"
      ? 1
      : 1 + currentExerciseEvaluationIndex + 1;

  const difficultyOptions: QuestionOptions[] = useMemo(
    () => [
      { value: "EASY", label: "Fácil" },
      { value: "MODERATE", label: "Regular" },
      { value: "HARD", label: "Difícil" },
    ],
    []
  );

  const completionOptions: QuestionOptions[] = useMemo(
    () => [
      { value: "EASILY", label: "Consegui com tranquilidade" },
      { value: "WITH_DIFFICULTY", label: "Consegui com dificuldade" },
      { value: "COULD_NOT_COMPLETE", label: "Não consegui" },
    ],
    []
  );

  const handleNextStep = () => {
    if (currentStep === "WORKOUT_EVALUATION") {
      const workoutData = workoutForm.getValues();
      setWorkoutEvaluationData(workoutData);
      setCurrentStep("EXERCISE_EVALUATION");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "EXERCISE_EVALUATION") {
      if (currentExerciseEvaluationIndex === 0) {
        setCurrentStep("WORKOUT_EVALUATION");
      } else {
        setCurrentExerciseEvaluationIndex(currentExerciseEvaluationIndex - 1);
      }
    }
  };

  const handleComplete = () => {
    if (!workoutEvaluationData) return;

    onComplete({
      workoutEvaluation: workoutEvaluationData,
      exercisesEvaluations: exercisesEvaluations,
    });
  };

  const handleWorkoutContinue = () => {
    workoutForm.handleSubmit((data) => {
      handleNextStep();
      if (scrollToTop) {
        setTimeout(() => scrollToTop(), 100);
      }
    })();
  };

  const handleExerciseContinue = async () => {
    exerciseForm.handleSubmit(async (data) => {
      const newEvaluation = {
        exerciseId: currentExercise.id,
        evaluation: data,
      };

      const updatedEvaluations = [...exercisesEvaluations, newEvaluation];
      setExercisesEvaluations(updatedEvaluations);

      if (!isLastExercise) {
        setCurrentExerciseEvaluationIndex(currentExerciseEvaluationIndex + 1);
        if (scrollToTop) {
          setTimeout(() => scrollToTop(), 100);
        }
      } else {
        if (workoutEvaluationData && updatedEvaluations.length > 0) {
          try {
            const completionToRating: Record<string, number> = {
              EASILY: RATING_EASILY,
              WITH_DIFFICULTY: RATING_WITH_DIFFICULTY,
              COULD_NOT_COMPLETE: RATING_COULD_NOT_COMPLETE,
            };

            const feedbackArray = updatedEvaluations
              .map((evalData) => {
                const exercise = workout.exercises.find(
                  (ex) => ex.id === evalData.exerciseId
                );
                const rating =
                  completionToRating[evalData.evaluation.completion] ||
                  RATING_COULD_NOT_COMPLETE;

                const exerciseId = Number(evalData.exerciseId);
                const workoutId = Number(workout.id);

                if (Number.isNaN(exerciseId) || Number.isNaN(workoutId)) {
                  return null;
                }

                if (!workoutEvaluationData?.difficulty) {
                  return null;
                }

                const completedAt = exercise?.completedAt
                  ? formatLocalDate(new Date(exercise.completedAt))
                  : formatLocalDate(new Date());

                const feedbackItem: {
                  exerciseId: number;
                  workoutId: number;
                  rating: number;
                  evaluation: string;
                  completedAt: string;
                  comments?: string;
                } = {
                  exerciseId,
                  workoutId,
                  rating,
                  evaluation: workoutEvaluationData.difficulty,
                  completedAt,
                };

                return feedbackItem;
              })
              .filter(
                (item): item is NonNullable<typeof item> => item !== null
              );

            if (feedbackArray.length > 0) {
              await submitWorkoutFeedbackMutation.mutateAsync(feedbackArray);
            }
          } catch (error) {
          }
        }

        if (workoutEvaluationData) {
          onComplete({
            workoutEvaluation: workoutEvaluationData,
            exercisesEvaluations: updatedEvaluations,
          });
        }
      }
    })();
  };

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    handleNextStep,
    handlePreviousStep,

    workoutForm,
    exerciseForm,

    handleWorkoutContinue,
    handleExerciseContinue,

    difficultyOptions,
    completionOptions,

    currentExercise,
    currentExerciseIndex: currentExerciseEvaluationIndex + 1,
    totalExercises,
    isLastExercise,
  };
};

export default useMultiStepEvaluation;
