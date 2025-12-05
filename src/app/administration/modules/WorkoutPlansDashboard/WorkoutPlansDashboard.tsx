"use client";

import { useMemo, useState } from "react";
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
  WorkoutPlanAdmin,
  WorkoutPlanEntry,
} from "../../schema/workoutPlansSchema";
import { workoutPlanFormSchema } from "../../schema/workoutPlansSchema";
import type { WorkoutAdmin } from "../../schema/workoutsSchema";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";

type PlanFormValues = {
  name: string;
  description: string;
  daysPerWeek: number;
  totalWeeks: number;
  iciqScoreMin: number;
  iciqScoreMax: number;
  ageMin: number;
  ageMax: number;
};

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

interface SelectedWorkout {
  order: number;
  workoutId: number;
}

const WorkoutPlansDashboard = () => {
  const queries = useAdministrationQueries(["administration"]);
  const plansQuery = queries.useWorkoutPlans();
  const workoutsQuery = queries.useWorkouts();

  const createPlan = queries.useCreateWorkoutPlan();
  const updatePlan = queries.useUpdateWorkoutPlan();
  const deletePlan = queries.useDeleteWorkoutPlan();

  const { showDialog, DialogPortal } = useDialogModal();

  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "INFO",
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlanAdmin | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<SelectedWorkout[]>(
    []
  );

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      daysPerWeek: 3,
      totalWeeks: 4,
      iciqScoreMin: 1,
      iciqScoreMax: 12,
      ageMin: 18,
      ageMax: 65,
    },
  });

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const availableWorkouts = useMemo(
    () => workoutsQuery.data ?? [],
    [workoutsQuery.data]
  );

  const openCreateModal = () => {
    if (availableWorkouts.length === 0) {
      showToast(
        "Cadastre treinos antes de criar um plano de treino.",
        "WARNING"
      );
      return;
    }
    setEditingPlan(null);
    setSelectedWorkouts([]);
    form.reset({
      name: "",
      description: "",
      daysPerWeek: 3,
      totalWeeks: 4,
      iciqScoreMin: 1,
      iciqScoreMax: 12,
      ageMin: 18,
      ageMax: 65,
    });
    setModalOpen(true);
  };

  const mapPlanEntries = (entries: WorkoutPlanEntry[]): SelectedWorkout[] =>
    entries.map((entry) => ({
      order: entry.order,
      workoutId: Number(entry.workout.id),
    }));

  const openEditModal = (plan: WorkoutPlanAdmin) => {
    setEditingPlan(plan);
    setSelectedWorkouts(mapPlanEntries(plan.workouts));
    form.reset({
      name: plan.name,
      description: plan.description,
      daysPerWeek: plan.daysPerWeek,
      totalWeeks: plan.totalWeeks,
      iciqScoreMin: plan.iciqScoreMin,
      iciqScoreMax: plan.iciqScoreMax,
      ageMin: plan.ageMin,
      ageMax: plan.ageMax,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
    setSelectedWorkouts([]);
    form.reset();
  };

  const selectedIds = selectedWorkouts.map((entry) => entry.workoutId);

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

      const activeIndex = selectedWorkouts.findIndex(
        (entry) => String(entry.workoutId) === activeId
      );
      const overIndex = selectedWorkouts.findIndex(
        (entry) => String(entry.workoutId) === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newWorkouts = arrayMove(selectedWorkouts, activeIndex, overIndex);
        // Atualizar a ordem sequencialmente (1, 2, 3, ...)
        const reorderedWorkouts = newWorkouts.map((entry, index) => ({
          ...entry,
          order: index + 1,
        }));
        setSelectedWorkouts(reorderedWorkouts);
      }
    }
  };

  const addWorkout = (workoutId: number) => {
    if (selectedIds.includes(workoutId)) return;
    setSelectedWorkouts((prev) => [
      ...prev,
      { order: prev.length + 1, workoutId },
    ]);
  };

  const removeWorkout = (workoutId: number) => {
    setSelectedWorkouts((prev) =>
      prev
        .filter((entry) => entry.workoutId !== workoutId)
        .map((entry, index) => ({ ...entry, order: index + 1 }))
    );
  };

  const onSubmit = async (values: PlanFormValues) => {
    if (selectedWorkouts.length === 0) {
      showToast(
        "Adicione pelo menos um treino para montar o plano.",
        "WARNING"
      );
      return;
    }

    const workoutIdsRecord: Record<string, number> = {};
    selectedWorkouts.forEach((entry) => {
      workoutIdsRecord[String(entry.order)] = entry.workoutId;
    });

    const payload = {
      name: values.name,
      description: values.description,
      workoutIds: workoutIdsRecord,
      daysPerWeek: Number(values.daysPerWeek),
      totalWeeks: Number(values.totalWeeks),
      iciqScoreMin: Number(values.iciqScoreMin),
      iciqScoreMax: Number(values.iciqScoreMax),
      ageMin: Number(values.ageMin),
      ageMax: Number(values.ageMax),
    };

    try {
      if (editingPlan?.id) {
        await updatePlan.mutateAsync({
          id: Number(editingPlan.id),
          payload,
        });
        showToast("Plano de treino atualizado com sucesso.");
      } else {
        await createPlan.mutateAsync(payload);
        showToast("Plano de treino criado com sucesso.");
      }
      closeModal();
    } catch (error) {
      showToast("Não foi possível salvar o plano de treino.", "ERROR");
    }
  };

  const handleDelete = async (plan: WorkoutPlanAdmin) => {
    if (!plan.id) return;

    showDialog({
      title: "Remover Plano de Treino",
      description: `Deseja remover o plano "${plan.name}"? Esta ação não pode ser desfeita.`,
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Remover",
        onPress: async () => {
          try {
            await deletePlan.mutateAsync(Number(plan.id));
            showToast("Plano de treino removido com sucesso.");
          } catch (error) {
            showToast("Não foi possível excluir o plano de treino.", "ERROR");
          }
        },
        type: "PRIMARY",
        autoClose: true,
      },
      dismissOnBackdropPress: false,
    });
  };

  const resolvedPlans = plansQuery.data ?? [];

  const workoutIds = useMemo(
    () => selectedWorkouts.map((entry) => String(entry.workoutId)),
    [selectedWorkouts]
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel de Planos de Treino
        </h1>
        <p className="text-gray-600">
          Combine treinos para gerar planos personalizados para cada perfil de
          paciente.
        </p>
        <div className="flex justify-center">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
          >
            Novo plano
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Planos cadastrados
            </h2>
            <p className="text-sm text-gray-500">
              Acompanhe os planos disponíveis na plataforma.
            </p>
          </div>
          <button
            onClick={() => plansQuery.refetch()}
            className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
          >
            Atualizar lista
          </button>
        </div>

        {plansQuery.isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-24 bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        )}

        {plansQuery.isError && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            Não foi possível carregar os planos de treino.
          </div>
        )}

        {!plansQuery.isLoading && !plansQuery.isError && (
          <>
            {resolvedPlans.length === 0 ? (
              <div className="text-center text-gray-600 border border-dashed border-gray-300 rounded-xl p-8">
                Nenhum plano cadastrado no momento.
              </div>
            ) : (
              <div className="space-y-4">
                {resolvedPlans.map((plan) => (
                  <div
                    key={plan.id ?? plan.name}
                    className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {plan.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-purple-700">
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Dias por semana: {plan.daysPerWeek}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Semanas totais: {plan.totalWeeks}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Faixa ICIQ: {plan.iciqScoreMin} -{" "}
                            {plan.iciqScoreMax}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Idade: {plan.ageMin} - {plan.ageMax} anos
                          </span>
                          <span className="px-3 py-1 bg-purple-100 rounded-full">
                            Treinos: {plan.workouts.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Treinos do plano
                      </p>
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        {plan.workouts.map((entry) => (
                          <div
                            key={`${plan.id}-${entry.order}`}
                            className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {entry.order}. {entry.workout.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Duração: {entry.workout.totalDuration}s •
                              Dificuldade: {entry.workout.difficultyLevel}
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
                {editingPlan
                  ? "Editar plano de treino"
                  : "Novo plano de treino"}
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
                    Dias por semana
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    {...form.register("daysPerWeek", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.daysPerWeek
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.daysPerWeek && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.daysPerWeek.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total de semanas
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("totalWeeks", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.totalWeeks
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.totalWeeks && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.totalWeeks.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ICIQ mínimo
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("iciqScoreMin", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.iciqScoreMin
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.iciqScoreMin && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.iciqScoreMin.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ICIQ máximo
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("iciqScoreMax", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.iciqScoreMax
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.iciqScoreMax && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.iciqScoreMax.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Idade mínima
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("ageMin", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.ageMin
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.ageMin && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.ageMin.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Idade máxima
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("ageMax", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.ageMax
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.ageMax && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.ageMax.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Treinos do plano
                    </h3>
                    <p className="text-sm text-gray-500">
                      Selecione os treinos e defina a ordem que serão aplicados.
                    </p>
                  </div>
                  <select
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (!value) return;
                      addWorkout(value);
                      event.currentTarget.value = "";
                    }}
                    className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecionar treino
                    </option>
                    {availableWorkouts
                      .filter(
                        (workout) =>
                          !selectedWorkouts.some(
                            (entry) => entry.workoutId === Number(workout.id)
                          )
                      )
                      .map((workout) => (
                        <option key={workout.id} value={workout.id ?? 0}>
                          {workout.name}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedWorkouts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum treino selecionado. Utilize o seletor acima para
                    adicionar treinos.
                  </p>
                )}

                {selectedWorkouts.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={workoutIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {selectedWorkouts.map((entry) => {
                          const workout = availableWorkouts.find(
                            (item) => Number(item.id) === entry.workoutId
                          );
                          if (!workout) return null;
                          return (
                            <SortableWorkoutItem
                              key={entry.workoutId}
                              workout={workout}
                              entry={entry}
                              onRemove={() => removeWorkout(entry.workoutId)}
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
                    createPlan.isPending ||
                    updatePlan.isPending ||
                    selectedWorkouts.length === 0
                  }
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createPlan.isPending || updatePlan.isPending ? (
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
                  ) : editingPlan ? (
                    "Salvar alterações"
                  ) : (
                    "Criar plano"
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

interface SortableWorkoutItemProps {
  workout: WorkoutAdmin;
  entry: SelectedWorkout;
  onRemove: () => void;
}

const SortableWorkoutItem: React.FC<SortableWorkoutItemProps> = ({
  workout,
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
  } = useSortable({ id: String(entry.workoutId) });

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
        <p className="text-sm font-semibold text-gray-800">{workout.name}</p>
        <p className="text-xs text-gray-500">
          Duração: {workout.totalDuration}s • Dificuldade:{" "}
          {workout.difficultyLevel}
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

export default WorkoutPlansDashboard;
