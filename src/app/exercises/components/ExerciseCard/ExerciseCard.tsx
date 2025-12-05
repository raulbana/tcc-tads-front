"use client";
import React from "react";
import { Exercise } from "@/app/types/exercise";

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseNumber?: number;
  onClick?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseNumber,
  onClick,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {exerciseNumber && (
            <span className="text-xs font-medium text-purple-600 mb-1 block">
              Exercício {exerciseNumber}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {exercise.title}
          </h3>
        </div>
      </div>

      {exercise.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {exercise.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {exercise.duration && (
          <span className="flex items-center gap-1">
            <span>Duração: {exercise.duration}</span>
          </span>
        )}
        {exercise.repetitions > 0 && (
          <span className="flex items-center gap-1">
            <span>{exercise.repetitions} repetições</span>
          </span>
        )}
        {exercise.sets > 0 && (
          <span className="flex items-center gap-1">
            <span>{exercise.sets} séries</span>
          </span>
        )}
      </div>

      {exercise.media && exercise.media.images && exercise.media.images.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {exercise.media.images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${exercise.title} - Imagem ${index + 1}`}
                className="w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;

