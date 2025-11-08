"use client";
import React from "react";
import { WorkoutDifficultyLabels } from "@/app/types/exercise";

interface WorkoutCardProps {
  title: string;
  duration?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  onClick: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  category,
  difficulty,
  description,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">
          {title}
        </h3>
        {difficulty && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 ml-2">
            {difficulty}
          </span>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
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

