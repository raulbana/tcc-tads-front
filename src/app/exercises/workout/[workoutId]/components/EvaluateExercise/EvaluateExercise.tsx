"use client";
import React from "react";
import { Exercise, Workout } from "@/app/types/exercise";
import useMultiStepEvaluation from "./useMultiStepEvaluation";
import WorkoutEvaluationStep from "./components/WorkoutEvaluationStep/WorkoutEvaluationStep";
import ExerciseSpecificEvaluationStep from "./components/ExerciseSpecificEvaluationStep/ExerciseSpecificEvaluationStep";
import EvaluationProgress from "./components/EvaluationProgress/EvaluationProgress";

interface EvaluateExerciseProps {
  workout: Workout;
  currentExercise: Exercise;
  onContinue: () => void;
  scrollToTop?: () => void;
}

const EvaluateExercise: React.FC<EvaluateExerciseProps> = ({
  workout,
  currentExercise,
  onContinue,
  scrollToTop,
}) => {
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    workoutForm,
    exerciseForm,
    handleWorkoutContinue,
    handleExerciseContinue,
    handlePreviousStep,
    difficultyOptions,
    completionOptions,
    currentExercise: evaluationExercise,
    currentExerciseIndex,
    totalExercises,
    isLastExercise,
  } = useMultiStepEvaluation({
    workout,
    currentExercise,
    onComplete: (data) => {
      onContinue();
    },
    scrollToTop,
  });

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "WORKOUT_EVALUATION":
        return (
          <WorkoutEvaluationStep
            control={workoutForm.control}
            errors={workoutForm.formState.errors}
            difficultyOptions={difficultyOptions}
            onContinue={handleWorkoutContinue}
            isValid={workoutForm.formState.isValid}
          />
        );
      case "EXERCISE_EVALUATION":
        return (
          <ExerciseSpecificEvaluationStep
            control={exerciseForm.control}
            errors={exerciseForm.formState.errors}
            completionOptions={completionOptions}
            currentExercise={evaluationExercise}
            currentExerciseIndex={currentExerciseIndex}
            totalExercises={totalExercises}
            onContinue={handleExerciseContinue}
            onPrevious={handlePreviousStep}
            isValid={exerciseForm.formState.isValid}
            isLastExercise={isLastExercise}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <EvaluationProgress
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
      />
      {renderCurrentStep()}
    </div>
  );
};

export default EvaluateExercise;
