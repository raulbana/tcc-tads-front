"use client";
import React from 'react';
import { Controller } from 'react-hook-form';
import { useContentForm } from './useContentForm';
import Input from '@/app/components/Input/Input';
import Button from '@/app/components/Button/Button';
import FileUpload from '../FileUpload/FileUpload';
import CategorySelector from '../CategorySelector/CategorySelector';
import { Content } from '@/app/types/content';

interface ContentFormProps {
  onSuccess?: (contentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  initialData?: Partial<Content>;
  mode?: 'create' | 'edit';
  contentId?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  onSuccess,
  onError,
  onCancel,
  initialData,
  mode = 'create',
  contentId
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
    handleCategoriesChange,
  } = useContentForm({
    onSuccess,
    onError,
    initialData,
    mode,
    contentId
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mídia
          <span className="text-red-500"> *</span>
        </label>
        <FileUpload
          images={watchedImages}
          video={watchedVideo}
          onFilesChange={handleFilesChange}
          error={errors.images?.message || errors.video?.message}
        />
      </div>

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
              label="Descrição"
              placeholder="Digite a descrição do post"
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
              required

            />
          )}
        />
      </div>

      <CategorySelector
        selectedCategories={watchedCategories}
        onCategoriesChange={handleCategoriesChange}
        error={errors.categories?.message}
      />
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="PRIMARY"
          text={isSubmitting 
            ? (mode === 'create' ? 'Publicando...' : 'Salvando...') 
            : (mode === 'create' ? 'Publicar Post' : 'Salvar Alterações')
          }
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1"
        />
        
        {onCancel && (
          <Button
            type="SECONDARY"
            text="Cancelar"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial"
          />
        )}
      </div>
    </form>
  );
};

export default ContentForm;