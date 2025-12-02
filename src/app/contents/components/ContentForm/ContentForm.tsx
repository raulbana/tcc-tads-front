"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { useContentForm } from "./useContentForm";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";
import FileUpload from "../FileUpload/FileUpload";
import CategorySelector from "../CategorySelector/CategorySelector";
import { Content } from "@/app/types/content";

interface ContentFormProps {
  onSuccess?: (contentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  initialData?: Partial<Content>;
  mode?: "create" | "edit";
  contentId?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  onSuccess,
  onError,
  onCancel,
  initialData,
  mode = "create",
  contentId,
}) => {
  const {
    control,
    errors,
    isSubmitting,
    watchedImages,
    watchedVideo,
    watchedCategories,
    handleSubmit,
    handleFilesChange,
    handleRemoveFile,
    handleCategoriesChange,
    hasValidImages,
  } = useContentForm({
    onSuccess,
    onError,
    initialData,
    mode,
    contentId,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <div>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              type="text"
              label="Título"
              placeholder="Digite o título do post"
              value={field.value}
              onChange={field.onChange}
              error={errors.title?.message}
              required
            />
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              type="textarea"
              label="Conteúdo"
              placeholder="Digite o conteúdo do post"
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
              required
            />
          )}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-4 mt-4">
          Mídia
          <span className="text-red-500"> *</span>
        </label>
        <FileUpload
          images={watchedImages}
          video={watchedVideo}
          onFilesChange={handleFilesChange}
          onRemoveFile={handleRemoveFile}
          error={
            mode === "edit" && !hasValidImages
              ? "No mínimo 1 imagem é obrigatória"
              : errors.video?.message
          }
        />
      </div>

      <CategorySelector
        selectedCategories={watchedCategories || []}
        onCategoriesChange={handleCategoriesChange}
        error={errors.categories?.message}
      />

      <div>
        <Controller
          control={control}
          name="subtitle"
          render={({ field }) => (
            <Input
              type="text"
              label="Subtópico"
              placeholder="Digite o subtópico do post (opcional)"
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.subtitle?.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="subcontent"
          render={({ field }) => (
            <Input
              type="textarea"
              label="Conteúdo adicional"
              placeholder="Digite conteúdo adicional do post (opcional)"
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.subcontent?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-row gap-3 pt-4">
        {onCancel && (
          <Button
            type="SECONDARY"
            text="Cancelar"
            onClick={onCancel}
            disabled={isSubmitting}
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? mode === "create"
              ? "Publicando..."
              : "Salvando..."
            : mode === "create"
            ? "Publicar Post"
            : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
