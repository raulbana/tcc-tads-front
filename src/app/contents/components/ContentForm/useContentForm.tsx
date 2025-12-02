"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContentFormData, contentSchema } from "@/app/contents/schemas/contentSchema";
import { useUpload } from "@/app/contexts/UploadContext";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Content, MediaDTO } from "@/app/types/content";
import useContentQueries from "@/app/contents/services/contentQueryFactory";

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
  const [existingMedia, setExistingMedia] = useState<MediaDTO[]>([]);
  const [removedMediaUrls, setRemovedMediaUrls] = useState<string[]>([]);
  const [imagesOrder, setImagesOrder] = useState<(File | { name: string; size: number; type: string; url: string; isExisting?: boolean })[]>([]);
  const prevInitialContentIdRef = useRef<string>('');
  
  const contentQueries = useContentQueries(["content"]);

  const dynamicSchema = useMemo(() => {
    if (mode === 'edit') {
      return contentSchema
        .omit({ images: true })
        .extend({
          images: z.array(z.instanceof(File)).default([]).optional(),
        })
        .superRefine((data, ctx) => {
          const hasExistingImages = existingMedia.some(
            m => m.contentType?.startsWith('image/') && !removedMediaUrls.includes(m.url)
          );
          const hasNewImages = data.images && Array.isArray(data.images) && data.images.length > 0;
          
          if (!hasExistingImages && !hasNewImages) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "No mínimo 1 imagem é obrigatória",
              path: ["images"],
            });
          }
          
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            data.images.forEach((file, index) => {
              if (file instanceof File) {
                if (file.size > 50 * 1024 * 1024) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Cada imagem deve ter no máximo 50MB",
                    path: ["images", index],
                  });
                }
                
                const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                if (!acceptedTypes.includes(file.type)) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Apenas imagens JPEG, PNG ou WebP são aceitas",
                    path: ["images", index],
                  });
                }
              }
            });
          }
        });
    }
    return contentSchema;
  }, [mode, existingMedia, removedMediaUrls]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger
  } = useForm<ContentFormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subtitle: initialData?.subtitle || '',
      subcontent: initialData?.subcontent || '',
      images: [],
      video: undefined,
      categories: [],
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (mode === 'edit') {
      const timeoutId = setTimeout(() => {
        trigger('images');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [mode, existingMedia.length, removedMediaUrls.length, trigger]);

  useEffect(() => {
    if (
      initialData &&
      initialData.id !== prevInitialContentIdRef.current
    ) {
      prevInitialContentIdRef.current = initialData.id;
      
      setValue('title', initialData.title || '');
      setValue('description', initialData.description || '');
      setValue('subtitle', initialData.subtitle || '');
      setValue('subcontent', initialData.subcontent || '');

      const mediaArray: MediaDTO[] = [];
      
      if (initialData.cover && initialData.cover.url) {
        mediaArray.push(initialData.cover);
      }
      
      if (Array.isArray(initialData.media)) {
        const otherMedia = initialData.media.filter(
          m => !initialData.cover || m.url !== initialData.cover.url
        );
        mediaArray.push(...otherMedia);
      }
      
      setExistingMedia(mediaArray);
      setRemovedMediaUrls([]);
      setImagesOrder([]);

      const initialImagesOrder = mediaArray
        .filter(m => m.contentType?.startsWith('image/'))
        .map(m => {
          const fileName = m.url.split('/').pop() || m.altText || 'image.jpg';
          return {
            name: fileName,
            size: m.contentSize || 0,
            type: m.contentType || 'image/jpeg',
            url: m.url,
            isExisting: true,
            originalUrl: m.url,
          } as any;
        });
      setImagesOrder(initialImagesOrder);

      if (initialData.categories && initialData.categories.length > 0) {
        const categoryArray = initialData.categories;
        setValue('categories', categoryArray);
      }
    }
  }, [initialData?.id, setValue]);


  const watchedImages = watch('images');
  const watchedVideo = watch('video');
  const watchedCategories = watch('categories');

  const displayImages = useMemo(() => {
    if (imagesOrder.length > 0) {
      const filtered = imagesOrder.filter(img => {
        if ((img as any).isExisting) {
          const url = (img as any).url || (img as any).originalUrl;
          return !removedMediaUrls.includes(url);
        }
        return true;
      });
      return filtered;
    }
    
    const existingImages = existingMedia
      .filter(m => m.contentType?.startsWith('image/') && !removedMediaUrls.includes(m.url))
      .map(m => {
        const fileName = m.url.split('/').pop() || m.altText || 'image.jpg';
        return {
          name: fileName,
          size: m.contentSize || 0,
          type: m.contentType || 'image/jpeg',
          url: m.url,
          isExisting: true,
          originalUrl: m.url,
        } as any;
      });
    
    const newImages = watchedImages.filter(img => img instanceof File) as File[];
    
    return [...existingImages, ...newImages];
  }, [existingMedia, removedMediaUrls, watchedImages, imagesOrder]);

  const displayVideo = useMemo(() => {
    const existingVideo = existingMedia.find(
      m => m.contentType?.startsWith('video/') && !removedMediaUrls.includes(m.url)
    );
    
    if (existingVideo) {
      const fileName = existingVideo.url.split('/').pop() || existingVideo.altText || 'video.mp4';
      return {
        name: fileName,
        size: existingVideo.contentSize || 0,
        type: existingVideo.contentType || 'video/mp4',
        url: existingVideo.url,
        isExisting: true,
        originalUrl: existingVideo.url, // Manter URL original para identificação
      } as any;
    }
    
    return watchedVideo && watchedVideo instanceof File ? watchedVideo : undefined;
  }, [existingMedia, removedMediaUrls, watchedVideo]);

  const onSubmit = useCallback(async (data: ContentFormData) => {
    setIsSubmitting(true);
    
    try {
      let resultId: string;
      
      if (mode === 'create') {
        resultId = await createContent(data);
      } else if (mode === 'edit' && contentId) {
        resultId = await updateContent(contentId, data, existingMedia, removedMediaUrls);
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
  }, [createContent, updateContent, mode, contentId, existingMedia, removedMediaUrls, onSuccess, onError]);

  const handleFilesChange = useCallback((
    images: (File | { name: string; size: number; type: string; url: string; isExisting?: boolean })[], 
    video?: File | { name: string; size: number; type: string; url: string; isExisting?: boolean }
  ) => {
    const existingImages = images.filter(img => (img as any).isExisting);
    const newImages = images.filter(img => img instanceof File) as File[];
    const newVideo = video && !(video as any).isExisting && video instanceof File ? video : undefined;
    
    setImagesOrder(images);
    
    if (mode === 'edit' && existingImages.length > 0) {
      const reorderedExistingMedia: MediaDTO[] = [];
      existingImages.forEach((img) => {
        const existingMediaItem = existingMedia.find(m => {
          const urlFileName = m.url.split('/').pop() || '';
          const altText = m.altText || '';
          const imgUrl = (img as any).url || (img as any).originalUrl;
          return m.url === imgUrl || 
                 urlFileName === img.name || 
                 altText === img.name ||
                 m.url.includes(img.name) ||
                 img.name.includes(m.url);
        });
        if (existingMediaItem) {
          reorderedExistingMedia.push(existingMediaItem);
        }
      });
      
      if (reorderedExistingMedia.length > 0) {
        const orderChanged = reorderedExistingMedia.some((media, index) => {
          const originalIndex = existingMedia.findIndex(m => m.url === media.url);
          return originalIndex !== index;
        });
        
        if (orderChanged) {
          setExistingMedia(reorderedExistingMedia);
        }
      }
    }
    
    setValue('images', newImages);
    setValue('video', newVideo);
  }, [setValue, mode, existingMedia]);

  const handleRemoveFile = useCallback((fileName: string) => {
    const existingMediaItem = existingMedia.find(m => {
      const urlFileName = m.url.split('/').pop() || '';
      const altText = m.altText || '';
      return m.url === fileName || 
             urlFileName === fileName || 
             altText === fileName ||
             m.url.includes(fileName) ||
             fileName.includes(m.url);
    });
    
    if (existingMediaItem) {
      setRemovedMediaUrls(prev => {
        if (!prev.includes(existingMediaItem.url)) {
          return [...prev, existingMediaItem.url];
        }
        return prev;
      });
      
      setImagesOrder(prev => prev.filter(img => {
        if ((img as any).isExisting) {
          const url = (img as any).url || (img as any).originalUrl;
          return url !== existingMediaItem.url;
        }
        return img.name !== fileName;
      }));
    } else {
      const currentImages = watchedImages.filter(
        img => {
          if ((img as any).isExisting) return true;
          return img.name !== fileName;
        }
      ).filter(img => img instanceof File) as File[];
      
      const currentVideo = watchedVideo && 
                          !(watchedVideo as any).isExisting &&
                          watchedVideo.name !== fileName
                          ? watchedVideo as File 
                          : undefined;
      
      setImagesOrder(prev => prev.filter(img => img.name !== fileName));
      
      setValue('images', currentImages);
      setValue('video', currentVideo);
    }
  }, [existingMedia, watchedImages, watchedVideo, setValue]);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setValue('categories', categories);
  }, [setValue]);

  const hasValidImages = useMemo(() => {
    if (mode !== 'edit') {
      return watchedImages && watchedImages.length > 0 && watchedImages.some(img => img instanceof File);
    }
    
    return displayImages && displayImages.length > 0;
  }, [mode, watchedImages, displayImages]);

  const adjustedErrors = useMemo(() => {
    if (mode === 'edit' && errors.images) {
      if (hasValidImages) {
        const { images, ...restErrors } = errors;
        return restErrors;
      }
      const hasExistingImages = existingMedia.some(
        m => m.contentType?.startsWith('image/') && !removedMediaUrls.includes(m.url)
      );
      if (hasExistingImages) {
        const { images, ...restErrors } = errors;
        return restErrors;
      }
    }
    return errors;
  }, [errors, mode, hasValidImages, existingMedia, removedMediaUrls]);

  return {
    control,
    errors: adjustedErrors,
    isSubmitting,
    watchedImages: displayImages,
    watchedVideo: displayVideo,
    watchedCategories,
    handleSubmit: handleSubmit(onSubmit),
    handleFilesChange,
    handleRemoveFile,
    handleCategoriesChange,
    reset,
    existingMedia,
    removedMediaUrls,
    hasValidImages,
  };
};