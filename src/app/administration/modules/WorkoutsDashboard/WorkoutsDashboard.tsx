"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "@phosphor-icons/react";
import useAdministrationQueries from "../../services/adminQueryFactory";
import type {
  WorkoutAdmin,
  WorkoutExerciseEntry,
} from "../../schema/workoutsSchema";
import { workoutFormSchema } from "../../schema/workoutsSchema";
import type { ExerciseAdmin } from "../../schema/exercisesSchema";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";

type WorkoutFormValues = {
  name: string;
  description?: string;
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
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [isExerciseDropdownOpen, setIsExerciseDropdownOpen] = useState(false);
  const exerciseDropdownRef = useRef<HTMLDivElement>(null);

  const { showDialog, DialogPortal } = useDialogModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exerciseDropdownRef.current &&
        !exerciseDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExerciseDropdownOpen(false);
      }
    };

    if (isExerciseDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExerciseDropdownOpen]);

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      totalDuration: 1,
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
      showToast("Cadastre exercícios antes de criar um treino.", "WARNING");
      return;
    }
    setEditingWorkout(null);
    setSelectedExercises([]);
    form.reset({
      name: "",
      description: "",
      totalDuration: 1,
      difficultyLevel: "BEGINNER",
    });
    setModalOpen(true);
  };

  const mapWorkoutExercises = (
    entries: WorkoutExerciseEntry[]
  ): SelectedExercise[] =>
    entries.map((entry) => ({
      order: entry.order,
      exerciseId: Number(entry.exercise.id),
    }));

  const openEditModal = (workout: WorkoutAdmin) => {
    setEditingWorkout(workout);
    setSelectedExercises(mapWorkoutExercises(workout.exercises));
    setExerciseSearchTerm("");
    setIsExerciseDropdownOpen(false);
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
    setExerciseSearchTerm("");
    setIsExerciseDropdownOpen(false);
    form.reset();
  };

  const availableExercises = useMemo(
    () => exercisesQuery.data ?? [],
    [exercisesQuery.data]
  );

  const filteredExercises = useMemo(() => {
    return availableExercises.filter(
      (exercise) =>
        !selectedExercises.some(
          (entry) => entry.exerciseId === Number(exercise.id)
        ) &&
        (exerciseSearchTerm === "" ||
          exercise.title
            .toLowerCase()
            .includes(exerciseSearchTerm.toLowerCase()))
    );
  }, [availableExercises, selectedExercises, exerciseSearchTerm]);

  const selectedIds = selectedExercises.map((entry) => entry.exerciseId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);

      const activeIndex = selectedExercises.findIndex(
        (entry) => String(entry.exerciseId) === activeId
      );
      const overIndex = selectedExercises.findIndex(
        (entry) => String(entry.exerciseId) === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newExercises = arrayMove(
          selectedExercises,
          activeIndex,
          overIndex
        );
        // Atualizar a ordem sequencialmente (1, 2, 3, ...)
        const reorderedExercises = newExercises.map((entry, index) => ({
          ...entry,
          order: index + 1,
        }));
        setSelectedExercises(reorderedExercises);
      }
    }
  };

  const addExercise = (exerciseId: number) => {
    if (selectedIds.includes(exerciseId)) return;
    setSelectedExercises((prev) => [
      ...prev,
      { order: prev.length + 1, exerciseId },
    ]);
    setExerciseSearchTerm("");
    setIsExerciseDropdownOpen(false);
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
      description: values.description ?? "",
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

  const exerciseIdStrings = useMemo(
    () => selectedExercises.map((entry) => String(entry.exerciseId)),
    [selectedExercises]
  );

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
                    {...form.register("name")}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
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
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.totalDuration
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.totalDuration && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.totalDuration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dificuldade
                  </label>
                  <select
                    {...form.register("difficultyLevel")}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.difficultyLevel
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.difficultyLevel && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.difficultyLevel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Exercícios do treino
                    </h3>
                    <p className="text-sm text-gray-500">
                      Adicione exercícios e defina a ordem de execução.
                    </p>
                  </div>
                  <div className="relative" ref={exerciseDropdownRef}>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Pesquisar exercício..."
                          value={exerciseSearchTerm}
                          onChange={(e) => {
                            setExerciseSearchTerm(e.target.value);
                            setIsExerciseDropdownOpen(true);
                          }}
                          onFocus={() => setIsExerciseDropdownOpen(true)}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    {isExerciseDropdownOpen && filteredExercises.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredExercises.map((exercise) => (
                          <button
                            key={exercise.id}
                            type="button"
                            onClick={() => addExercise(Number(exercise.id))}
                            className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition"
                          >
                            <p className="text-sm font-semibold text-gray-800">
                              {exercise.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Duração: {exercise.duration}s • Repetições:{" "}
                              {exercise.repetitions} • Séries: {exercise.sets}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                    {isExerciseDropdownOpen &&
                      exerciseSearchTerm &&
                      filteredExercises.length === 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg p-4">
                          <p className="text-sm text-gray-500 text-center">
                            Nenhum exercício encontrado
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {selectedExercises.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum exercício selecionado. Utilize o seletor acima para
                    adicionar.
                  </p>
                )}

                {selectedExercises.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={exerciseIdStrings}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {selectedExercises.map((entry) => {
                          const exercise = availableExercises.find(
                            (item) => Number(item.id) === entry.exerciseId
                          );
                          if (!exercise) return null;
                          return (
                            <SortableExerciseItem
                              key={entry.exerciseId}
                              exercise={exercise}
                              entry={entry}
                              onRemove={() => removeExercise(entry.exerciseId)}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
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
                    !form.formState.isValid ||
                    createWorkout.isPending ||
                    updateWorkout.isPending ||
                    selectedExercises.length === 0
                  }
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createWorkout.isPending || updateWorkout.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Salvando...
                    </>
                  ) : editingWorkout ? (
                    "Salvar alterações"
                  ) : (
                    "Criar treino"
                  )}
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

interface SortableExerciseItemProps {
  exercise: ExerciseAdmin;
  entry: SelectedExercise;
  onRemove: () => void;
}

const SortableExerciseItem: React.FC<SortableExerciseItemProps> = ({
  exercise,
  entry,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(entry.exerciseId) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-purple-200 bg-purple-50 rounded-xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${
        isDragging ? "shadow-lg z-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-purple-100 rounded transition-colors"
        aria-label="Arrastar para reordenar"
      >
        <DotsSixVertical className="w-5 h-5 text-purple-600" weight="bold" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{exercise.title}</p>
        <p className="text-xs text-gray-500">
          Duração: {exercise.duration}s • Repetições: {exercise.repetitions} •
          Séries: {exercise.sets}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">
          Ordem: {entry.order}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
        >
          Remover
        </button>
      </div>
    </div>
  );
};

export default WorkoutsDashboard;
