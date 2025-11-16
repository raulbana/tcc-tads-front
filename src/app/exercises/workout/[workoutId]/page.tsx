"use client";
import React from "react";
import { useParams } from "next/navigation";
import useExerciseWorkout from "./useExerciseWorkout";
import StartWorkout from "./components/StartWorkout/StartWorkout";
import ExercisePractice from "./components/ExercisePractice/ExercisePractice";
import EvaluateExercise from "./components/EvaluateExercise/EvaluateExercise";
import Toast from "@/app/components/Toast/Toast";

const ExerciseWorkoutPage = () => {
  const params = useParams();
  const workoutId = params?.workoutId as string;
  const {
    workout,
    currentExercise,
    step,
    isLoading,
    error,
    onStartWorkout,
    onLeaveWorkout,
    onFinishWorkout,
    onNextExercise,
    onPreviousExercise,
    onEvaluate,
    errorMessage,
    isToastOpen,
    onCloseToast,
  } = useExerciseWorkout(workoutId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">
              {error?.message || 'Treino não encontrado'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        type="ERROR"
        message={errorMessage}
        isOpen={isToastOpen}
        duration={5000}
        onClose={onCloseToast}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {step === 'START_WORKOUT' && workout && (
          <StartWorkout workout={workout} onStartWorkout={onStartWorkout} />
        )}
        {step === 'EXERCISE' && workout && currentExercise && (
          <ExercisePractice
            workout={workout}
            currentExercise={currentExercise}
            onNextExercise={onNextExercise}
            onPreviousExercise={onPreviousExercise}
            onLeaveWorkout={onLeaveWorkout}
          />
        )}
        {step === 'EVALUATE' && workout && currentExercise && (
          <EvaluateExercise
            workout={workout}
            currentExercise={currentExercise}
            onContinue={onEvaluate}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseWorkoutPage;

