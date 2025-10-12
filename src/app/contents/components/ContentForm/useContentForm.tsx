"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentFormData, contentSchema } from "@/app/contents/schemas/contentSchema";
import { useUpload } from "@/app/contexts/UploadContext";
import { useState, useCallback } from "react";
import { Content } from "@/app/types/content";

interface UseContentFormProps {
  onSuccess?: (contentId: string) => void;
  onError?: (error: string) => void;
  initialData?: Partial<Content>;
  mode?: 'create' | 'edit';
  contentId?: string;
}

export const useContentForm = ({
  onSuccess,
  onError,
  initialData,
  mode = 'create',
  contentId
}: UseContentFormProps) => {
  const { createContent, updateContent } = useUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subtitle: initialData?.subtitle || '',
      subcontent: initialData?.subcontent || '',
      images: [],
      video: undefined,
      categories: initialData?.category ? [typeof initialData.category === 'string' ? initialData.category : initialData.category.id] : [],
    },
    mode: 'onSubmit',
  });

  const watchedImages = watch('images');
  const watchedVideo = watch('video');
  const watchedCategories = watch('categories');

  const onSubmit = useCallback(async (data: ContentFormData) => {
    setIsSubmitting(true);
    
    try {
      let resultId: string;
      
      if (mode === 'create') {
        resultId = await createContent(data);
      } else if (mode === 'edit' && contentId) {
        resultId = await updateContent(contentId, data);
      } else {
        throw new Error('ID do conteúdo é necessário para edição');
      }
      
      onSuccess?.(resultId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [createContent, updateContent, mode, contentId, onSuccess, onError]);

  const handleFilesChange = useCallback((images: File[], video?: File) => {
    setValue('images', images);
    setValue('video', video);
  }, [setValue]);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setValue('categories', categories);
  }, [setValue]);

  return {
    control,
    errors,
    isSubmitting,
    watchedImages,
    watchedVideo,
    watchedCategories,
    handleSubmit: handleSubmit(onSubmit),
    handleFilesChange,
    handleCategoriesChange,
    reset
  };
};