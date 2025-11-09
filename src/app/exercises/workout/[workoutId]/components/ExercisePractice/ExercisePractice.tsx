"use client";
import React, { useState } from "react";
import { Exercise, Workout } from "@/app/types/exercise";
import Button from "@/app/components/Button/Button";
import VideoPlayer from "../../../../components/VideoPlayer/VideoPlayer";
import { FALLBACK_VIDEO_URL } from "../../../../utils/workoutStorage";

interface ExercisePracticeProps {
  workout: Workout;
  currentExercise: Exercise;
  onNextExercise: () => void;
  onPreviousExercise: () => void;
  onLeaveWorkout: () => void;
}

const ExercisePractice: React.FC<ExercisePracticeProps> = ({
  workout,
  currentExercise,
  onNextExercise,
  onPreviousExercise,
  onLeaveWorkout,
}) => {
  const [currentTab, setCurrentTab] = useState<"VIDEO" | "ILLUSTRATION">(
    "VIDEO"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentExerciseIndex = workout.exercises.findIndex(
    (exercise) => exercise.id === currentExercise.id
  );
  const exerciseNumber = currentExerciseIndex + 1;
  const totalExercises = workout.exercises.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

  const images = currentExercise.media?.images || [];
  const videos = currentExercise.media?.videos || [];

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePreviousImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-purple-600">
            Exercício {exerciseNumber} / {totalExercises}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {currentExercise.title}
          </h2>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setCurrentTab("VIDEO")}
          className={`px-4 py-2 font-medium ${
            currentTab === "VIDEO"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Vídeo
        </button>
        <button
          onClick={() => setCurrentTab("ILLUSTRATION")}
          className={`px-4 py-2 font-medium ${
            currentTab === "ILLUSTRATION"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Ilustração
        </button>
      </div>

      <div className="w-full">
        {currentTab === "VIDEO" ? (
          <VideoPlayer
            src={videos.length > 0 ? videos[0] : FALLBACK_VIDEO_URL}
            controls
            className="rounded-lg"
          />
        ) : (
          <div className="relative">
            {images.length > 0 ? (
              <>
                {images.length > 1 && (
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <img
                  src={images[currentImageIndex]}
                  alt={`${currentExercise.title} - Imagem ${
                    currentImageIndex + 1
                  }`}
                  className="w-full h-auto rounded-lg"
                />
                {images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Nenhuma ilustração disponível</p>
              </div>
            )}
          </div>
        )}
      </div>

      {currentExercise.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{currentExercise.description}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="PRIMARY"
          text={isLastExercise ? "Finalizar Treino" : "Próximo Exercício"}
          onClick={onNextExercise}
          className="w-full"
        />
        <div className="flex gap-2">
          {currentExerciseIndex > 0 && (
            <Button
              type="SECONDARY"
              text="Exercício Anterior"
              onClick={onPreviousExercise}
              className="flex-1"
            />
          )}
          <Button
            type="TERTIARY"
            text="Sair do Treino"
            onClick={onLeaveWorkout}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePractice;
