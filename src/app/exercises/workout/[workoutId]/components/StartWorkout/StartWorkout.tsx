"use client";
import React from "react";
import { Workout } from "@/app/types/exercise";
import Button from "@/app/components/Button/Button";
import { WorkoutDifficultyLabels } from "@/app/types/exercise";

interface StartWorkoutProps {
  workout: Workout;
  onStartWorkout: () => void;
}

const StartWorkout: React.FC<StartWorkoutProps> = ({
  workout,
  onStartWorkout,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {workout.name}
        </h1>
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
          {WorkoutDifficultyLabels[workout.difficulty]}
        </span>
      </div>

      {workout.description && (
        <p className="text-gray-600 text-center mb-6">
          {workout.description}
        </p>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {workout.duration && (
            <div>
              <span className="text-gray-500 block">Duração</span>
              <span className="font-semibold text-gray-800">{workout.duration}</span>
            </div>
          )}
          {workout.category && (
            <div>
              <span className="text-gray-500 block">Categoria</span>
              <span className="font-semibold text-gray-800">{workout.category}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500 block">Exercícios</span>
            <span className="font-semibold text-gray-800">{workout.exercises.length}</span>
          </div>
        </div>
      </div>

      <Button
        type="PRIMARY"
        text="Iniciar Treino"
        onClick={onStartWorkout}
        className="w-full"
      />
    </div>
  );
};

export default StartWorkout;

