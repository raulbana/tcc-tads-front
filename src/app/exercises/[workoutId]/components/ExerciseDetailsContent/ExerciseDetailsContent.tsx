"use client";
import React, { useState } from "react";
import { Exercise, Workout } from "@/app/types/exercise";
import ExerciseCard from "../../../components/ExerciseCard/ExerciseCard";
import Button from "@/app/components/Button/Button";
import VideoPlayer from "../../../components/VideoPlayer/VideoPlayer";
import { WorkoutDifficultyLabels } from "@/app/types/exercise";
import { FALLBACK_VIDEO_URL } from "@/app/exercises/utils/workoutStorage";

interface ExerciseDetailsContentProps {
  workout: Workout;
  onStartWorkout: () => void;
}

const ExerciseDetailsContent: React.FC<ExerciseDetailsContentProps> = ({
  workout,
  onStartWorkout,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [activeMediaTab, setActiveMediaTab] = useState<"videos" | "images">(
    "videos"
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-2">
              {WorkoutDifficultyLabels[workout.difficulty]}
            </span>
            <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
          </div>
        </div>

        {workout.description && (
          <p className="text-gray-600 mb-4">{workout.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          {workout.duration && <span>Duração: {workout.duration}</span>}
          {workout.category && <span>Categoria: {workout.category}</span>}
        </div>

        <Button
          type="PRIMARY"
          text="Iniciar Treino"
          onClick={onStartWorkout}
          className="w-full"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Exercícios ({workout.exercises.length})
        </h2>

        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id}>
              <ExerciseCard
                exercise={exercise}
                exerciseNumber={index + 1}
                onClick={() => setSelectedExercise(exercise)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedExercise.title}
              </h3>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-500 hover:text-gray-700"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedExercise.description && (
              <p className="text-gray-600 mb-6">
                {selectedExercise.description}
              </p>
            )}

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveMediaTab("videos")}
                  className={`px-4 py-2 rounded-lg ${
                    activeMediaTab === "videos"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Vídeos
                </button>
                <button
                  onClick={() => setActiveMediaTab("images")}
                  className={`px-4 py-2 rounded-lg ${
                    activeMediaTab === "images"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Imagens
                </button>
              </div>

              {activeMediaTab === "videos" && (
                <div className="space-y-4">
                  {selectedExercise.media?.videos &&
                  selectedExercise.media.videos.length > 0 ? (
                    selectedExercise.media.videos.map((video, index) => (
                      <VideoPlayer key={index} src={video} controls />
                    ))
                  ) : (
                    <VideoPlayer src={FALLBACK_VIDEO_URL} controls />
                  )}
                </div>
              )}

              {activeMediaTab === "images" && (
                <div className="space-y-4">
                  {selectedExercise.media?.images &&
                  selectedExercise.media.images.length > 0 ? (
                    selectedExercise.media.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                      >
                        <img
                          src={image}
                          alt={`${selectedExercise.title} - Imagem ${
                            index + 1
                          }`}
                          className="w-full h-auto object-contain rounded-lg"
                          style={{ maxHeight: "70vh" }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma imagem disponível</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {selectedExercise.duration && (
                <div>
                  <span className="text-gray-500">Duração</span>
                  <p className="font-semibold text-gray-800">
                    {selectedExercise.duration}
                  </p>
                </div>
              )}
              {selectedExercise.repetitions > 0 && (
                <div>
                  <span className="text-gray-500">Repetições</span>
                  <p className="font-semibold text-gray-800">
                    {selectedExercise.repetitions}
                  </p>
                </div>
              )}
              {selectedExercise.sets > 0 && (
                <div>
                  <span className="text-gray-500">Séries</span>
                  <p className="font-semibold text-gray-800">
                    {selectedExercise.sets}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetailsContent;
