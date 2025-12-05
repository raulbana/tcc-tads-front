"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAdministrationQueries from "../../services/adminQueryFactory";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";
import contentServices from "@/app/contents/services/contentServices";
import MediaManager from "./components/MediaManager/MediaManager";
import {
  ExerciseAdmin,
  exerciseCreatorSchema,
} from "../../schema/exercisesSchema";

type ExerciseFormValues = {
  title: string;
  instructions: string;
  categoryId: number;
  repetitions: number;
  sets: number;
  restTime: number;
  duration: number;
  attributeIds: number[];
};

type CategoryFormValues = {
  name: string;
  description?: string;
};

type AttributeFormValues = {
  name: string;
  description: string;
  type: number;
};

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

const ExercisesDashboard = () => {
  const queries = useAdministrationQueries(["administration"]);
  const exercisesQuery = queries.useExercises();
  const { data: exercisesData, isLoading, isError, refetch } = exercisesQuery;
  const categoriesQuery = queries.useExerciseCategories();
  const attributesQuery = queries.useExerciseAttributes();

  const createExercise = queries.useCreateExercise();
  const updateExercise = queries.useUpdateExercise();
  const deleteExercise = queries.useDeleteExercise();

  const createCategory = queries.useCreateExerciseCategory();
  const updateCategory = queries.useUpdateExerciseCategory();
  const deleteCategory = queries.useDeleteExerciseCategory();

  const createAttribute = queries.useCreateExerciseAttribute();
  const updateAttribute = queries.useUpdateExerciseAttribute();
  const deleteAttribute = queries.useDeleteExerciseAttribute();

  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "INFO",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [attributeFilter, setAttributeFilter] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const pageSizeOptions = [4, 8, 12, 20];

  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseAdmin | null>(
    null
  );
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingAttributeId, setEditingAttributeId] = useState<number | null>(
    null
  );
  const [exerciseImages, setExerciseImages] = useState<File[]>([]);

  const { showDialog, DialogPortal } = useDialogModal();
  const [exerciseVideo, setExerciseVideo] = useState<File | undefined>(
    undefined
  );
  const [existingMedia, setExistingMedia] = useState<
    Array<{
      id?: number | null;
      url: string;
      contentType: string;
      contentSize: number;
      altText?: string | null;
    }>
  >([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const [uploadError, setUploadError] = useState<string>("");

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseCreatorSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      instructions: "",
      categoryId: undefined as any,
      repetitions: 1,
      sets: 1,
      restTime: 1,
      duration: 1,
      attributeIds: [],
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const attributeForm = useForm<AttributeFormValues>({
    defaultValues: {
      name: "",
      description: "",
      type: 1,
    },
  });

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const categories = categoriesQuery.data ?? [];
  const attributes = attributesQuery.data ?? [];
  const exercises = exercisesData ?? [];

  const filteredExercises = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchSearch = normalizedSearch
        ? exercise.title.toLowerCase().includes(normalizedSearch) ||
          exercise.instructions.toLowerCase().includes(normalizedSearch)
        : true;
      const matchCategory = categoryFilter
        ? exercise.category.toLowerCase() === categoryFilter.toLowerCase()
        : true;
      const matchAttribute = attributeFilter
        ? exercise.benefits.some(
            (benefit: { id: number }) =>
              typeof benefit.id === "number" && benefit.id === attributeFilter
          )
        : true;
      return matchSearch && matchCategory && matchAttribute;
    });
  }, [exercises, searchTerm, categoryFilter, attributeFilter]);

  const totalFiltered = filteredExercises.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageNumbers = useMemo(() => {
    const visible: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      visible.push(i);
    }
    return visible;
  }, [currentPage, totalPages]);

  const paginatedExercises = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredExercises.slice(startIndex, startIndex + pageSize);
  }, [filteredExercises, currentPage, pageSize]);

  const goToPage = (target: number) => {
    if (target < 1 || target > totalPages) return;
    setPage(target);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setAttributeFilter("");
    setPage(1);
    setPageSize(8);
  };

  const openCreateModal = () => {
    if (categories.length === 0) {
      showToast(
        "Cadastre uma categoria antes de criar novos exercícios.",
        "WARNING"
      );
      return;
    }
    setEditingExercise(null);
    setExerciseImages([]);
    setExerciseVideo(undefined);
    setExistingMedia([]);
    setRemovedMediaIds([]);
    setUploadError("");
    const defaultCategoryId = categories[0]?.id ?? 0;
    form.reset({
      title: "",
      instructions: "",
      categoryId: defaultCategoryId,
      repetitions: 1,
      sets: 1,
      restTime: 1,
      duration: 1,
      attributeIds: [],
    });
    // Trigger validation after reset to ensure categoryId is validated
    if (defaultCategoryId > 0) {
      form.trigger("categoryId");
    }
    setExerciseModalOpen(true);
  };

  const openEditModal = (exercise: ExerciseAdmin) => {
    setEditingExercise(exercise);
    const categoryId =
      categories.find((category) => category.name === exercise.category)?.id ??
      0;

    form.reset({
      title: exercise.title,
      instructions: exercise.instructions,
      categoryId,
      repetitions: exercise.repetitions,
      sets: exercise.sets,
      restTime: exercise.restTime,
      duration: exercise.duration,
      attributeIds: exercise.benefits
        .map((benefit) => benefit.id)
        .filter((id): id is number => typeof id === "number"),
    });
    setExerciseModalOpen(true);
  };

  useEffect(() => {
    if (isExerciseModalOpen && editingExercise) {
      const mediaArray = Array.isArray(editingExercise.media)
        ? editingExercise.media
        : [];
      setExistingMedia(mediaArray);
      setRemovedMediaIds([]);
      setExerciseImages([]);
      setExerciseVideo(undefined);
      setUploadError("");
    }
  }, [isExerciseModalOpen, editingExercise]);

  const closeExerciseModal = () => {
    setExerciseModalOpen(false);
    setEditingExercise(null);
    setExerciseImages([]);
    setExerciseVideo(undefined);
    setExistingMedia([]);
    setRemovedMediaIds([]);
    setUploadError("");
    form.reset();
  };

  const onExerciseSubmit = async (values: ExerciseFormValues) => {
    setUploadError("");

    if (!hasMedia) {
      setUploadError("Adicione pelo menos uma imagem ou vídeo");
      showToast("Adicione pelo menos uma imagem ou vídeo", "ERROR");
      return;
    }

    let uploadedMedia: Array<{
      url: string;
      contentType: string;
      contentSize: number;
      altText?: string;
    }> = [];

    const allFiles = [
      ...exerciseImages,
      ...(exerciseVideo ? [exerciseVideo] : []),
    ];

    if (allFiles.length > 0) {
      try {
        const formData = new FormData();
        allFiles.forEach((file) => {
          formData.append("files", file);
        });

        const uploadRes = await contentServices.uploadMedia(formData);
        uploadedMedia = Array.isArray(uploadRes?.media)
          ? uploadRes.media
          : Array.isArray(uploadRes)
          ? uploadRes
          : [];
      } catch (error) {
        setUploadError("Erro ao fazer upload das mídias. Tente novamente.");
        showToast("Erro ao fazer upload das mídias.", "ERROR");
        return;
      }
    }

    const newMediaArray = uploadedMedia.map((m) => ({
      url: m.url,
      contentType: m.contentType || "application/octet-stream",
      contentSize: m.contentSize || 0,
      altText: m.altText || values.title,
    }));

    const keptExistingMedia = existingMedia
      .filter((media) => {
        if (media.id === null || media.id === undefined) return false;
        return !removedMediaIds.includes(media.id);
      })
      .map((media) => ({
        id: media.id,
        url: media.url,
        contentType: media.contentType,
        contentSize: media.contentSize,
        altText: media.altText || values.title,
      }));

    const allMedia = [...keptExistingMedia, ...newMediaArray];

    const payload = {
      title: values.title,
      instructions: values.instructions,
      categoryId: Number(values.categoryId),
      repetitions: Number(values.repetitions),
      sets: Number(values.sets),
      restTime: Number(values.restTime),
      duration: Number(values.duration),
      attributes: values.attributeIds,
      media: allMedia,
    };

    try {
      if (editingExercise) {
        await updateExercise.mutateAsync({
          id: Number(editingExercise.id),
          data: payload,
        });
        showToast("Exercício atualizado com sucesso.");
      } else {
        await createExercise.mutateAsync(payload);
        showToast("Exercício criado com sucesso.");
      }
      closeExerciseModal();
    } catch (error) {
      showToast("Não foi possível salvar o exercício.", "ERROR");
    }
  };

  const handleDeleteExercise = async (exercise: ExerciseAdmin) => {
    if (!exercise.id) return;

    showDialog({
      title: "Excluir Exercício",
      description: `Deseja realmente excluir o exercício "${exercise.title}"? Esta ação não pode ser desfeita.`,
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Excluir",
        onPress: async () => {
          try {
            await deleteExercise.mutateAsync(Number(exercise.id));
            showToast("Exercício removido com sucesso.");
          } catch (error) {
            showToast("Não foi possível excluir o exercício.", "ERROR");
          }
        },
        type: "PRIMARY",
        autoClose: true,
      },
      dismissOnBackdropPress: false,
    });
  };

  const onCategorySubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategoryId) {
        await updateCategory.mutateAsync({
          id: editingCategoryId,
          name: values.name,
          description: values.description,
        });
        showToast("Categoria atualizada com sucesso.");
      } else {
        await createCategory.mutateAsync({
          name: values.name,
          description: values.description,
        });
        showToast("Categoria criada com sucesso.");
      }
      categoryForm.reset({ name: "", description: "" });
      setEditingCategoryId(null);
    } catch (error) {
      showToast("Não foi possível salvar a categoria.", "ERROR");
    }
  };

  const handleEditCategory = (id: number) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return;
    setEditingCategoryId(id);
    categoryForm.reset({
      name: category.name,
      description: category.description ?? "",
    });
  };

  const handleDeleteCategory = async (id: number) => {
    showDialog({
      title: "Remover Categoria",
      description:
        "Deseja remover esta categoria? Esta ação não pode ser desfeita.",
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Remover",
        onPress: async () => {
          try {
            await deleteCategory.mutateAsync(id);
            showToast("Categoria removida com sucesso.");
          } catch (error) {
            showToast("Não foi possível excluir a categoria.", "ERROR");
          }
        },
        type: "PRIMARY",
        autoClose: true,
      },
      dismissOnBackdropPress: false,
    });
  };

  const onAttributeSubmit = async (values: AttributeFormValues) => {
    try {
      if (editingAttributeId) {
        await updateAttribute.mutateAsync({
          id: editingAttributeId,
          name: values.name,
          description: values.description,
          type: Number(values.type),
        });
        showToast("Atributo atualizado com sucesso.");
      } else {
        await createAttribute.mutateAsync({
          name: values.name,
          description: values.description,
          type: Number(values.type),
        });
        showToast("Atributo criado com sucesso.");
      }
      attributeForm.reset({ name: "", description: "", type: 1 });
      setEditingAttributeId(null);
    } catch (error) {
      showToast("Não foi possível salvar o atributo.", "ERROR");
    }
  };

  const handleEditAttribute = (id: number) => {
    const attribute = attributes.find((item) => item.id === id);
    if (!attribute) return;
    setEditingAttributeId(id);
    attributeForm.reset({
      name: attribute.name,
      description: attribute.description,
      type: attribute.type,
    });
  };

  const handleDeleteAttribute = async (id: number) => {
    showDialog({
      title: "Remover Atributo",
      description:
        "Deseja remover este atributo? Esta ação não pode ser desfeita.",
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Remover",
        onPress: async () => {
          try {
            await deleteAttribute.mutateAsync(id);
            showToast("Atributo removido com sucesso.");
          } catch (error) {
            showToast("Não foi possível excluir o atributo.", "ERROR");
          }
        },
        type: "PRIMARY",
        autoClose: true,
      },
      dismissOnBackdropPress: false,
    });
  };

  const isExerciseListEmpty = useMemo(
    () => !isLoading && !isError && (exercises?.length ?? 0) === 0,
    [isLoading, isError, exercises]
  );

  const hasMedia = useMemo(
    () =>
      existingMedia.length > 0 ||
      exerciseImages.length > 0 ||
      exerciseVideo !== undefined,
    [existingMedia, exerciseImages, exerciseVideo]
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel de Exercícios
        </h1>
        <p className="text-gray-600">
          Gerencie o catálogo de exercícios, categorias e atributos disponíveis
          para os planos de treino.
        </p>
        <div className="flex justify-center">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
          >
            Novo exercício
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2 w-full xl:max-w-xl">
            <label className="block text-sm font-medium text-gray-700">
              Pesquisar exercícios
            </label>
            <input
              type="text"
              placeholder="Título ou instruções"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full xl:justify-end">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-40"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Atributo/benefício
              </label>
              <select
                value={attributeFilter}
                onChange={(event) =>
                  setAttributeFilter(
                    event.target.value ? Number(event.target.value) : ""
                  )
                }
                className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-48"
              >
                <option value="">Todos</option>
                {attributes.map((attribute) => (
                  <option key={attribute.id} value={attribute.id ?? undefined}>
                    {attribute.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Resultados por página
              </label>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-32"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="self-end px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div className="flex flex-wrap gap-2 items-center">
            <span>
              {totalFiltered > 0
                ? `Mostrando ${
                    paginatedExercises.length > 0
                      ? (currentPage - 1) * pageSize + 1
                      : 0
                  } - ${Math.min(
                    currentPage * pageSize,
                    totalFiltered
                  )} de ${totalFiltered}`
                : "Nenhum exercício encontrado"}
            </span>
            {categoryFilter && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Categoria: {categoryFilter}
              </span>
            )}
            {attributeFilter && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Atributo selecionado
              </span>
            )}
            {searchTerm.trim() && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Busca: "{searchTerm.trim()}"
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 rounded-lg transition cursor-pointer"
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                  currentPage === pageNumber
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 rounded-lg transition cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-20 bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            Não foi possível carregar os exercícios.
          </div>
        )}

        {isExerciseListEmpty && (
          <div className="text-center text-gray-600 border border-dashed border-gray-300 rounded-xl p-8">
            Nenhum exercício cadastrado até o momento.
          </div>
        )}

        {!isLoading && !isError && (exercises?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-purple-100 text-left text-gray-700">
                  <th className="p-3 rounded-l-lg">Título</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Repetições</th>
                  <th className="p-3">Séries</th>
                  <th className="p-3">Descanso (s)</th>
                  <th className="p-3">Duração (s)</th>
                  <th className="p-3 rounded-r-lg text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExercises.map((exercise) => (
                  <tr
                    key={exercise.id ?? exercise.title}
                    className="border-b border-gray-100 hover:bg-purple-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {exercise.title}
                    </td>
                    <td className="p-3 text-gray-600">{exercise.category}</td>
                    <td className="p-3 text-gray-600">
                      {exercise.repetitions}
                    </td>
                    <td className="p-3 text-gray-600">{exercise.sets}</td>
                    <td className="p-3 text-gray-600">{exercise.restTime}</td>
                    <td className="p-3 text-gray-600">{exercise.duration}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exercise)}
                          className="px-3 py-2 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(exercise)}
                          className="px-3 py-2 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <header>
            <h3 className="text-lg font-semibold text-gray-800">
              Categorias de exercício
            </h3>
            <p className="text-sm text-gray-500">
              Organize os exercícios em categorias para facilitar a busca.
            </p>
          </header>

          <form
            onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                {...categoryForm.register("name", { required: true })}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...categoryForm.register("description")}
                rows={2}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    categoryForm.reset({ name: "", description: "" });
                  }}
                  className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
              >
                {editingCategoryId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {categories.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhuma categoria cadastrada.
              </p>
            )}
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{category.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <header>
            <h3 className="text-lg font-semibold text-gray-800">
              Atributos e benefícios
            </h3>
            <p className="text-sm text-gray-500">
              Cadastre benefícios ou contraindicações para associar aos
              exercícios.
            </p>
          </header>

          <form
            onSubmit={attributeForm.handleSubmit(onAttributeSubmit)}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                {...attributeForm.register("name", { required: true })}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...attributeForm.register("description", { required: true })}
                rows={2}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                {...attributeForm.register("type", { valueAsNumber: true })}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value={1}>Benefício</option>
                <option value={2}>Contraindicação</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              {editingAttributeId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAttributeId(null);
                    attributeForm.reset({ name: "", description: "", type: 1 });
                  }}
                  className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer"
              >
                {editingAttributeId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {attributes.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhum atributo cadastrado.
              </p>
            )}
            {attributes.map((attribute) => (
              <div
                key={attribute.id}
                className="border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{attribute.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAttribute(attribute.id)}
                      className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attribute.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{attribute.description}</p>
                <span className="text-xs text-purple-600 font-medium">
                  {attribute.type === 1 ? "Benefício" : "Contraindicação"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isExerciseModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingExercise ? "Editar exercício" : "Novo exercício"}
              </h2>
              <button
                onClick={closeExerciseModal}
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
              onSubmit={form.handleSubmit(onExerciseSubmit)}
              className="px-6 py-6 space-y-4 overflow-y-auto"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    {...form.register("title")}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.title
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Instruções
                  </label>
                  <textarea
                    {...form.register("instructions")}
                    rows={4}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.instructions
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.instructions && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.instructions.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                        className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                          form.formState.errors.categoryId
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Repetições
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("repetitions", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.repetitions
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.repetitions && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.repetitions.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Séries
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("sets", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.sets
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.sets && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.sets.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descanso (segundos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("restTime", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.restTime
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.restTime && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.restTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duração (segundos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...form.register("duration", { valueAsNumber: true })}
                    className={`mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      form.formState.errors.duration
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {form.formState.errors.duration && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <MediaManager
                    existingMedia={existingMedia}
                    newImages={exerciseImages}
                    newVideo={exerciseVideo}
                    onExistingMediaChange={setExistingMedia}
                    onNewFilesChange={(images, video) => {
                      setExerciseImages(images);
                      setExerciseVideo(video);
                      setUploadError("");
                    }}
                    onRemoveExisting={(id) => {
                      setRemovedMediaIds((prev) => [...prev, id]);
                      setExistingMedia((prev) =>
                        prev.filter((m) => m.id !== id)
                      );
                    }}
                    error={uploadError}
                  />
                  {uploadError && (
                    <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Benefícios / atributos
                  </label>
                  <Controller
                    control={form.control}
                    name="attributeIds"
                    render={({ field }) => (
                      <div className="grid gap-2 mt-2 sm:grid-cols-2">
                        {attributes.map((attribute) => {
                          const checked = field.value.includes(attribute.id);
                          return (
                            <label
                              key={attribute.id}
                              className={`flex items-start gap-3 border rounded-xl px-3 py-2 cursor-pointer transition ${
                                checked
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                checked={checked}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    field.onChange([
                                      ...field.value,
                                      attribute.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (id) => id !== attribute.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {attribute.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {attribute.description}
                                </p>
                                <span className="text-xs text-purple-600 font-medium">
                                  {attribute.type === 1
                                    ? "Benefício"
                                    : "Contraindicação"}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                        {attributes.length === 0 && (
                          <p className="text-sm text-gray-500">
                            Cadastre atributos no painel ao lado para
                            associá-los aos exercícios.
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeExerciseModal}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  disabled={
                    createExercise.isPending || updateExercise.isPending
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={
                    !form.formState.isValid ||
                    !hasMedia ||
                    createExercise.isPending ||
                    updateExercise.isPending
                  }
                >
                  {createExercise.isPending || updateExercise.isPending ? (
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
                  ) : editingExercise ? (
                    "Salvar alterações"
                  ) : (
                    "Criar exercício"
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

export default ExercisesDashboard;
