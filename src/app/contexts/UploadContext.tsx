"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import contentServices from '@/app/contents/services/contentServices';
import { ContentFormData } from '@/app/contents/schemas/contentSchema';
import { useAuth } from './AuthContext';
import useContentQueries from '@/app/contents/services/contentQueryFactory';

export interface UploadProgress {
  id: string;
  type: 'create' | 'edit';
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  data?: Partial<ContentFormData>;
  contentId?: string;
}

interface UploadContextType {
  uploads: UploadProgress[];
  createContent: (data: ContentFormData) => Promise<string>;
  updateContent: (contentId: string, data: ContentFormData, existingMedia?: any[], removedMediaUrls?: string[]) => Promise<string>;
  removeUpload: (id: string) => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

const convertCategoryNamesToIds = (categoryNames: string[], allCategories: any[]): number[] => {
  return categoryNames
    .map((name) => {
      const category = allCategories.find((c) => c.name === name);
      return category ? category.id : null;
    })
    .filter((id): id is number => id !== null);
};

const generateUploadId = () => `upload_${Date.now()}_${Math.random()}`;

const UPLOAD_STORAGE_KEY = 'daily_iu_uploads';

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const contentQueries = useContentQueries(['upload']);
  const { data: allCategories = [] } = contentQueries.useGetCategories();

  useEffect(() => {
    const storedUploads = localStorage.getItem(UPLOAD_STORAGE_KEY);
    if (storedUploads) {
      try {
        const parsed = JSON.parse(storedUploads);
        setUploads(parsed);
      } catch (error) {
      }
    }
  }, []);

  useEffect(() => {
    if (uploads.length > 0) {
      localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(uploads));
    } else {
      localStorage.removeItem(UPLOAD_STORAGE_KEY);
    }
  }, [uploads]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const updateUploadProgress = useCallback((id: string, updates: Partial<UploadProgress>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  }, []);

  const createContent = useCallback(async (data: ContentFormData): Promise<string> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const uploadId = generateUploadId();
    
    const newUpload: UploadProgress = {
      id: uploadId,
      type: 'create',
      progress: 0,
      status: 'pending',
      data
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      updateUploadProgress(uploadId, { status: 'uploading', progress: 10 });

      const files: File[] = [];
      
      if (data.images && data.images.length > 0) {
        files.push(...data.images);
      }
      
      if (data.video) {
        files.push(data.video);
      }

      updateUploadProgress(uploadId, { progress: 30 });

      const result = await contentServices.createContentWithFiles(
        {
          title: data.title,
          description: data.description,
          subtitle: data.subtitle,
          subcontent: data.subcontent,
          categories: convertCategoryNamesToIds(data.categories, allCategories),
          files: files,
        },
        user.id.toString()
      );

      updateUploadProgress(uploadId, { 
        status: 'success', 
        progress: 100,
        contentId: result.id
      });

      setTimeout(() => {
        removeUpload(uploadId);
      }, 3000);

      return result.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      updateUploadProgress(uploadId, { 
        status: 'error', 
        error: errorMessage,
        progress: 0 
      });
      throw error;
    }
  }, [user, updateUploadProgress, removeUpload, allCategories]);

  const updateContent = useCallback(async (contentId: string, data: ContentFormData, existingMedia?: any[], removedMediaUrls?: string[]): Promise<string> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const uploadId = generateUploadId();
    
    const newUpload: UploadProgress = {
      id: uploadId,
      type: 'edit',
      progress: 0,
      status: 'pending',
      data,
      contentId
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      updateUploadProgress(uploadId, { status: 'uploading', progress: 20 });

      const newFiles: File[] = [];
      
      if (data.images && data.images.length > 0) {
        const newImages = data.images.filter(img => img instanceof File) as File[];
        newFiles.push(...newImages);
      }
      
      if (data.video && data.video instanceof File) {
        newFiles.push(data.video);
      }

      let uploadedMediaUrls: string[] = [];

      if (newFiles.length > 0) {
        updateUploadProgress(uploadId, { progress: 40 });
        
        const formData = new FormData();
        newFiles.forEach((file) => {
          formData.append('files', file);
        });

        const uploadRes = await contentServices.uploadMedia(formData);
        const uploadedMedia = Array.isArray(uploadRes?.media)
          ? uploadRes.media
          : Array.isArray(uploadRes)
          ? uploadRes
          : [];
        
        uploadedMediaUrls = uploadedMedia.map((m: any) => m.url);
        updateUploadProgress(uploadId, { progress: 70 });
      }

      const keptExistingMedia = (existingMedia || []).filter(
        m => !(removedMediaUrls || []).includes(m.url)
      );
      const existingImageUrls = keptExistingMedia
        .filter(m => m.contentType?.startsWith('image/'))
        .map(m => m.url);
      const newImageUrls = uploadedMediaUrls.filter((url: string) => {
        return !url.includes('.mp4') && !url.includes('.webm') && !url.includes('.mov');
      });
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      const existingVideo = keptExistingMedia.find(m => m.contentType?.startsWith('video/'));
      const newVideoUrl = uploadedMediaUrls.find((url: string) => {
        return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
      });
      const videoUrl = existingVideo?.url || newVideoUrl || undefined;

      const result = await contentServices.updateContent(
        contentId,
        {
          title: data.title,
          description: data.description,
          subtitle: data.subtitle,
          subcontent: data.subcontent,
          categories: convertCategoryNamesToIds(data.categories, allCategories).map(id => id.toString()),
          images: allImageUrls,
          video: videoUrl,
        },
        user.id.toString()
      );

      updateUploadProgress(uploadId, { 
        status: 'success', 
        progress: 100 
      });

      setTimeout(() => {
        removeUpload(uploadId);
      }, 3000);

      return result.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      updateUploadProgress(uploadId, { 
        status: 'error', 
        error: errorMessage,
        progress: 0 
      });
      throw error;
    }
  }, [user, updateUploadProgress, removeUpload, allCategories]);

  const value: UploadContextType = {
    uploads,
    createContent,
    updateContent,
    removeUpload,
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};