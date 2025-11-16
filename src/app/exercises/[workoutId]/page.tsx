"use client";
import React from "react";
import { useParams } from "next/navigation";
import useExerciseDetails from "./useExerciseDetails";
import ExerciseDetailsContent from "./components/ExerciseDetailsContent/ExerciseDetailsContent";

const ExerciseDetailsPage = () => {
  const params = useParams();
  const workoutId = params?.workoutId as string;
  const { workout, isLoading, error, handleStartWorkout } = useExerciseDetails(workoutId);

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ExerciseDetailsContent
          workout={workout}
          onStartWorkout={handleStartWorkout}
        />
      </div>
    </div>
  );
};

export default ExerciseDetailsPage;

