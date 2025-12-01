"use client";
import React from "react";
import useExerciseHome from "./useExerciseHome";
import WorkoutCard from "./components/WorkoutCard/WorkoutCard";

const ExercisesPage = () => {
  const { workouts, handleWorkoutClick, isLoading, error } = useExerciseHome();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">
              Erro ao carregar treinos. Tente novamente mais tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Treinos</h1>
          <p className="text-gray-600">
            Escolha um treino para começar seus exercícios
          </p>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Nenhum treino disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((exercise) => (
              <WorkoutCard
                key={exercise.id}
                title={exercise.title}
                duration={exercise.duration}
                category={exercise.category}
                difficulty=""
                description={exercise.description}
                onClick={() => handleWorkoutClick(exercise.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;

