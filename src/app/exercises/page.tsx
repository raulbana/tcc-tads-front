"use client";
import React from "react";
import { Lock } from "@phosphor-icons/react";
import useExerciseHome from "./useExerciseHome";
import WorkoutCard from "./components/WorkoutCard/WorkoutCard";
import ICIQReassessmentModal from "./components/ICIQReassessmentModal";

const ExercisesPage = () => {
  const {
    workouts,
    handleWorkoutClick,
    isLoading,
    error,
    isExercisesBlocked,
    isReassessmentModalOpen,
    handleCloseReassessmentModal,
    handleReassessmentSuccess,
    nextWorkout,
    nextWorkoutExerciseIds,
    userWorkoutPlan,
  } = useExerciseHome();

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

  if (isExercisesBlocked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <Lock size={32} className="text-red-600" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Acesso Restrito
                </h2>

                <p className="text-gray-600 max-w-2xl">
                  Com base nas suas respostas ao questionário, identificamos que
                  você possui uma condição grave ou muito grave de incontinência
                  urinária.
                </p>

                <p className="text-gray-600 max-w-2xl">
                  Por conta da sua condição, recomendamos fortemente que você
                  consulte um médico antes de realizar exercícios de
                  fisioterapia pélvica. O acompanhamento profissional é
                  essencial para garantir sua segurança e o melhor tratamento.
                </p>

                <p className="text-red-600 font-semibold max-w-2xl">
                  O módulo de exercícios está bloqueado até que você consulte um
                  profissional de saúde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Treinos</h1>
            <p className="text-gray-600">
              Escolha um treino para começar seus exercícios
            </p>
          </div>

          {userWorkoutPlan && (
            <div className="mb-6 space-y-2">
              <p className="text-gray-700">
                Semana {userWorkoutPlan.currentWeek}
                {userWorkoutPlan.plan && " do plano de treino"}
              </p>
              {userWorkoutPlan.totalProgress !== undefined && (
                <p className="text-gray-700">
                  Progresso da semana: {userWorkoutPlan.weekProgress} treinos |
                  Progresso total: {userWorkoutPlan.totalProgress} treinos
                </p>
              )}
            </div>
          )}

          {nextWorkout && (
            <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-600 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">
                Próximo Treino Recomendado
              </h2>
              <p className="text-gray-800">{nextWorkout.name}</p>
            </div>
          )}

          {workouts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Nenhum treino disponível no momento.
              </p>
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
                  isNextWorkout={nextWorkoutExerciseIds.has(exercise.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ICIQReassessmentModal
        isOpen={isReassessmentModalOpen}
        onClose={handleCloseReassessmentModal}
        onSuccess={handleReassessmentSuccess}
      />
    </>
  );
};

export default ExercisesPage;
