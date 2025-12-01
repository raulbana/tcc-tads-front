"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAdministrationQueries from "../../services/adminQueryFactory";
import type {
  WorkoutAdmin,
  WorkoutExerciseEntry,
} from "../../schema/workoutsSchema";
import type { ExerciseAdmin } from "../../services/exercisesService";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";

type WorkoutFormValues = {
  name: string;
  description: string;
  totalDuration: number;
  difficultyLevel: string;
};

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

interface SelectedExercise {
  order: number;
  exerciseId: number;
}

const difficultyOptions = [
  { value: "BEGINNER", label: "Iniciante" },
  { value: "MODERATE", label: "Intermediário" },
  { value: "HARD", label: "Avançado" },
];

const WorkoutsDashboard = () => {
  const queries = useAdministrationQueries(["administration"]);
  const workoutsQuery = queries.useWorkouts();
  const exercisesQuery = queries.useExercises();

  const createWorkout = queries.useCreateWorkout();
  const updateWorkout = queries.useUpdateWorkout();
  const deleteWorkout = queries.useDeleteWorkout();

  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "INFO",
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutAdmin | null>(
    null
  );
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);

  const { showDialog, DialogPortal } = useDialogModal();

  const form = useForm<WorkoutFormValues>({
    defaultValues: {
      name: "",
      description: "",
      totalDuration: 0,
      difficultyLevel: "BEGINNER",
    },
  });

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const openCreateModal = () => {
    if (availableExercises.length === 0) {
      showToast(
        "Cadastre exercícios antes de criar um treino.",
        "WARNING"
      );
      return;
    }
    setEditingWorkout(null);
    setSelectedExercises([]);
    form.reset({
      name: "",
      description: "",
      totalDuration: 0,
      difficultyLevel: "BEGINNER",
    });
    setModalOpen(true);
  };

  const mapWorkoutExercises = (entries: WorkoutExerciseEntry[]): SelectedExercise[] =>
    entries.map((entry) => ({
      order: entry.order,
      exerciseId: Number(entry.exercise.id),
    }));

  const openEditModal = (workout: WorkoutAdmin) => {
    setEditingWorkout(workout);
    setSelectedExercises(mapWorkoutExercises(workout.exercises));
    form.reset({
      name: workout.name,
      description: workout.description,
      totalDuration: workout.totalDuration,
      difficultyLevel: workout.difficultyLevel,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingWorkout(null);
    setSelectedExercises([]);
    form.reset();
  };

  const availableExercises = useMemo(
    () => exercisesQuery.data ?? [],
    [exercisesQuery.data]
  );

  const selectedIds = selectedExercises.map((entry) => entry.exerciseId);

  const addExercise = (exerciseId: number) => {
    if (selectedIds.includes(exerciseId)) return;
    setSelectedExercises((prev) => [
      ...prev,
      { order: prev.length + 1, exerciseId },
    ]);
  };

  const updateOrder = (exerciseId: number, order: number) => {
    setSelectedExercises((prev) =>
      prev
        .map((entry) =>
          entry.exerciseId === exerciseId ? { ...entry, order } : entry
        )
        .sort((a, b) => a.order - b.order)
    );
  };

  const removeExercise = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev
        .filter((entry) => entry.exerciseId !== exerciseId)
        .map((entry, index) => ({ ...entry, order: index + 1 }))
    );
  };

  const onSubmit = async (values: WorkoutFormValues) => {
    if (selectedExercises.length === 0) {
      showToast(
        "Selecione pelo menos um exercício para montar o treino.",
        "WARNING"
      );
      return;
    }

    const exerciseIdsRecord: Record<string, number> = {};
    selectedExercises.forEach((entry) => {
      exerciseIdsRecord[String(entry.order)] = entry.exerciseId;
    });

    const payload = {
      name: values.name,
      description: values.description,
      totalDuration: Number(values.totalDuration),
      difficultyLevel: values.difficultyLevel,
      exerciseIds: exerciseIdsRecord,
    };

    try {
      if (editingWorkout?.id) {
        await updateWorkout.mutateAsync({
          id: Number(editingWorkout.id),
          payload,
        });
        showToast("Treino atualizado com sucesso.");
      } else {
        await createWorkout.mutateAsync(payload);
        showToast("Treino criado com sucesso.");
      }
      closeModal();
    } catch (error) {
      showToast("Não foi possível salvar o treino.", "ERROR");
    }
  };

  const handleDelete = async (workout: WorkoutAdmin) => {
    if (!workout.id) return;
    
    showDialog({
      title: "Remover Treino",
      description: `Deseja remover o treino "${workout.name}"? Esta ação é irreversível.`,
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Remover",
        onPress: async () => {
    try {
      await deleteWorkout.mutateAsync(Number(workout.id));
      showToast("Treino removido com sucesso.");
    } catch (error) {
      showToast("Não foi possível excluir o treino.", "ERROR");
    }
        },
        type: "PRIMARY",
        autoClose: true,
      },
      dismissOnBackdropPress: false,
    });
  };

  const resolvedWorkouts = workoutsQuery.data ?? [];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Painel de Treinos</h1>
        <p className="text-gray-600">
          Monte treinos combinando exercícios e defina a dificuldade adequada.
        </p>
        <div className="flex justify-center">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
          >
            Novo treino
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Treinos cadastrados
            </h2>
            <p className="text-sm text-gray-500">
              Gerencie os treinos que serão utilizados nos planos.
            </p>
          </div>
          <button
            onClick={() => workoutsQuery.refetch()}
            className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
          >
            Atualizar lista
          </button>
        </div>

        {workoutsQuery.isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-24 bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        )}

        {workoutsQuery.isError && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            Não foi possível carregar os treinos.
          </div>
        )}

        {!workoutsQuery.isLoading && !workoutsQuery.isError && (
          <>
            {resolvedWorkouts.length === 0 ? (
              <div className="text-center text-gray-600 border border-dashed border-gray-300 rounded-xl p-8">
                Nenhum treino cadastrado no momento.
              </div>
            ) : (
              <div className="space-y-4">
                {resolvedWorkouts.map((workout) => (
                  <div
                    key={workout.id ?? workout.name}
                    className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {workout.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {workout.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-purple-700">
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Dificuldade:{" "}
                            {
                              difficultyOptions.find(
                                (opt) => opt.value === workout.difficultyLevel
                              )?.label
                            }
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Duração total: {workout.totalDuration} s
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Exercícios: {workout.exercises.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(workout)}
                          className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(workout)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Exercícios do treino
                      </p>
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        {workout.exercises.map((entry) => (
                          <div
                            key={`${workout.id}-${entry.order}`}
                            className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {entry.order}. {entry.exercise.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Repetições: {entry.exercise.repetitions} | Séries:{" "}
                              {entry.exercise.sets}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingWorkout ? "Editar treino" : "Novo treino"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
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

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="px-6 py-6 space-y-6 overflow-y-auto"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    {...form.register("name", { required: true })}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    {...form.register("description")}
                    rows={3}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duração total (segundos)
                  </label>
                  <input
                    type="number"
                    {...form.register("totalDuration", { valueAsNumber: true })}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dificuldade
                  </label>
                  <select
                    {...form.register("difficultyLevel")}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Exercícios do treino
                    </h3>
                    <p className="text-sm text-gray-500">
                      Adicione exercícios e defina a ordem de execução.
                    </p>
                  </div>
                  <select
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (!value) return;
                      addExercise(value);
                      event.currentTarget.value = "";
                    }}
                    className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecionar exercício
                    </option>
                    {availableExercises
                      .filter(
                        (exercise) =>
                          !selectedExercises.some(
                            (entry) => entry.exerciseId === Number(exercise.id)
                          )
                      )
                      .map((exercise) => (
                        <option key={exercise.id} value={exercise.id ?? 0}>
                          {exercise.title}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedExercises.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum exercício selecionado. Utilize o seletor acima para
                    adicionar.
                  </p>
                )}

                {selectedExercises.length > 0 && (
                  <div className="space-y-3">
                    {selectedExercises.map((entry, index) => {
                      const exercise = availableExercises.find(
                        (item) => Number(item.id) === entry.exerciseId
                      );
                      if (!exercise) return null;
                      return (
                        <div
                          key={entry.exerciseId}
                          className="border border-purple-200 bg-purple-50 rounded-xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {exercise.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Duração: {exercise.duration}s • Repetições:{" "}
                              {exercise.repetitions} • Séries: {exercise.sets}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-medium text-gray-600">
                              Ordem
                            </label>
                            <input
                              type="number"
                              className="w-20 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                              value={entry.order}
                              min={1}
                              onChange={(event) =>
                                updateOrder(
                                  entry.exerciseId,
                                  Number(event.target.value)
                                )
                              }
                            />
                            <button
                              type="button"
                              onClick={() => removeExercise(entry.exerciseId)}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    createWorkout.isPending || updateWorkout.isPending
                  }
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
                >
                  {editingWorkout ? "Salvar alterações" : "Criar treino"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        type={toast.type}
        message={toast.message}
        isOpen={toast.isOpen}
        onClose={() => setToast((state) => ({ ...state, isOpen: false }))}
      />
      {DialogPortal}
    </div>
  );
};

export default WorkoutsDashboard;

