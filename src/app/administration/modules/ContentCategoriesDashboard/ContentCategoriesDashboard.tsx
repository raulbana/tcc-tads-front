"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import useAdministrationQueries from "../../services/adminQueryFactory";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";

type CategoryFormValues = {
  name: string;
  description: string;
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
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  const categoryForm = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const onCategorySubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategoryId) {
        await updateCategory.mutateAsync({
          id: editingCategoryId,
          data: {
            name: values.name,
            description: values.description,
          },
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
      description: category.description,
    });
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find((item) => item.id === id);
    const confirmation = confirm(
      `Deseja realmente excluir a categoria "${category?.name}"?`
    );
    if (!confirmation) return;
    try {
      await deleteCategory.mutateAsync(id);
      showToast("Categoria removida com sucesso.");
    } catch (error) {
      showToast("Não foi possível excluir a categoria.", "ERROR");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          HU 26. HISTÓRIA DE USUÁRIO 026 - MANTER CATEGORIA DE PUBLICAÇÃO
        </h1>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-4">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="py-2 font-semibold text-gray-700">Sendo</td>
                <td className="py-2 text-gray-600">
                  Um administrador do sistema
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-700">Quero</td>
                <td className="py-2 text-gray-600">
                  Realizar operações de inclusão, alteração e exclusão de
                  categoria de publicação
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-700">Para</td>
                <td className="py-2 text-gray-600">
                  Manter atualizada a base de dados de categorias disponíveis
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <header>
          <h3 className="text-lg font-semibold text-gray-800">
            Categorias de publicação
          </h3>
          <p className="text-sm text-gray-500">
            Organize as publicações em categorias para facilitar a busca.
          </p>
        </header>

        <form
          onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
          className="space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto] items-end">
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
                {...categoryForm.register("description", { required: true })}
                rows={2}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex gap-2">
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
                className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer whitespace-nowrap"
                disabled={
                  createCategory.isPending || updateCategory.isPending
                }
              >
                {editingCategoryId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </div>
        </form>

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
        )}
      </section>

      <Toast
        type={toast.type}
        message={toast.message}
        isOpen={toast.isOpen}
        onClose={() => setToast((state) => ({ ...state, isOpen: false }))}
      />
    </div>
  );
};

export default ContentCategoriesDashboard;

