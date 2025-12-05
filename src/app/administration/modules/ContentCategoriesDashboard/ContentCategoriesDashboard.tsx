"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import useAdministrationQueries from "../../services/adminQueryFactory";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";
import Switch from "@/app/components/Switch/Switch";
import type { ContentCategory } from "../../schema/contentCategoriesSchema";

type CategoryFormValues = {
  name: string;
  description: string;
  auditable: boolean;
};

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

const ContentCategoriesDashboard = () => {
  const queries = useAdministrationQueries(["administration"]);
  const categoriesQuery = queries.useContentCategories();
  const { data: categories = [], isLoading, isError } = categoriesQuery;

  const createCategory = queries.useCreateContentCategory();
  const updateCategory = queries.useUpdateContentCategory();
  const deleteCategory = queries.useDeleteContentCategory();

  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "INFO",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ContentCategory | null>(null);

  const { showDialog, DialogPortal } = useDialogModal();

  const categoryForm = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
      auditable: false,
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
    setEditingCategory(null);
    categoryForm.reset({
      name: "",
      description: "",
      auditable: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (category: ContentCategory) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description,
      auditable: category.auditable ?? false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    categoryForm.reset({
      name: "",
      description: "",
      auditable: false,
    });
  };

  const onCategorySubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: {
            name: values.name,
            description: values.description,
            auditable: values.auditable,
          },
        });
        showToast("Categoria atualizada com sucesso.");
      } else {
        await createCategory.mutateAsync({
          name: values.name,
          description: values.description,
          auditable: values.auditable,
        });
        showToast("Categoria criada com sucesso.");
      }
      closeModal();
    } catch (error) {
      showToast("Não foi possível salvar a categoria.", "ERROR");
    }
  };

  const handleEditCategory = (id: number) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return;
    openEditModal(category);
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find((item) => item.id === id);

    showDialog({
      title: "Excluir Categoria",
      description: `Deseja realmente excluir a categoria "${category?.name}"? Esta ação não pode ser desfeita.`,
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {},
      },
      primaryButton: {
        label: "Excluir",
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

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Categorias de publicação
            </h3>
            <p className="text-sm text-gray-500">
              Organize as publicações em categorias para facilitar a busca.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer whitespace-nowrap"
          >
            Nova categoria
          </button>
        </header>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse h-20 bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            Não foi possível carregar as categorias.
          </div>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma categoria cadastrada.
          </p>
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">{category.name}</p>
                    {category.auditable && (
                      <span className="px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded">
                        Auditável
                      </span>
                    )}
                  </div>
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
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategory ? "Editar categoria" : "Nova categoria"}
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
              onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
              className="px-6 py-6 space-y-6 overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  {...categoryForm.register("name", { required: true })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  {...categoryForm.register("description", { required: true })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Switch
                  type="PRIMARY"
                  size="MEDIUM"
                  label="Categoria auditável"
                  checked={categoryForm.watch("auditable")}
                  onChange={(value) =>
                    categoryForm.setValue("auditable", value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Categorias auditáveis requerem aprovação antes da publicação.
                </p>
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
                    createCategory.isPending || updateCategory.isPending
                  }
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingCategory ? "Salvar alterações" : "Criar categoria"}
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

export default ContentCategoriesDashboard;
