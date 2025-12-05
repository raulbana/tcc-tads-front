"use client";
import React from "react";
interface WorkoutCardProps {
  title: string;
  duration?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  onClick: () => void;
  isNextWorkout?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  category,
  difficulty,
  description,
  onClick,
  isNextWorkout = false,
}) => {
  return (
    <div
      className={`rounded-lg shadow-sm border-2 p-6 cursor-pointer hover:shadow-md transition-shadow ${
        isNextWorkout
          ? "bg-purple-50 border-purple-600"
          : "bg-white border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">{title}</h3>
        {isNextWorkout && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-600 text-white ml-2">
            Próximo treino
          </span>
        )}
        {difficulty && !isNextWorkout && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 ml-2">
            {difficulty}
          </span>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {category && (
          <span className="flex items-center gap-1">
            <span>{category}</span>
          </span>
        )}
        {duration && (
          <span className="flex items-center gap-1">
            <span>{duration}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
