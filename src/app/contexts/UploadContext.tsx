"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import contentServices, { CreateContentRequest, UpdateContentRequest } from '@/app/contents/services/contentServices';
import { ContentFormData } from '@/app/contents/schemas/contentSchema';

export interface UploadProgress {
  id: string;
  type: 'create' | 'edit';
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  data?: Partial<ContentFormData>;
}

interface UploadContextType {
  uploads: UploadProgress[];
  createContent: (data: ContentFormData) => Promise<string>;
  updateContent: (contentId: string, data: ContentFormData) => Promise<string>;
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

const generateUploadId = () => `upload_${Date.now()}_${Math.random()}`;

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const updateUploadProgress = useCallback((id: string, updates: Partial<UploadProgress>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  }, []);

  const createContent = useCallback(async (data: ContentFormData): Promise<string> => {
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
      updateUploadProgress(uploadId, { status: 'uploading', progress: 20 });

      const createRequest: CreateContentRequest = {
        title: data.title,
        description: data.description,
        subtitle: data.subtitle,
        subcontent: data.subcontent,
        images: data.images,
        video: data.video,
        categories: data.categories,
      };

      updateUploadProgress(uploadId, { progress: 50 });

      const result = await contentServices.createContent(createRequest);

      updateUploadProgress(uploadId, { 
        status: 'success', 
        progress: 100 
      });

      // Remove upload após 3 segundos
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
  }, [updateUploadProgress, removeUpload]);

  const updateContent = useCallback(async (contentId: string, data: ContentFormData): Promise<string> => {
    const uploadId = generateUploadId();
    
    const newUpload: UploadProgress = {
      id: uploadId,
      type: 'edit',
      progress: 0,
      status: 'pending',
      data
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      updateUploadProgress(uploadId, { status: 'uploading', progress: 20 });

      const updateRequest: UpdateContentRequest = {
        id: contentId,
        title: data.title,
        description: data.description,
        subtitle: data.subtitle,
        subcontent: data.subcontent,
        images: data.images,
        video: data.video,
        categories: data.categories,
      };

      updateUploadProgress(uploadId, { progress: 50 });

      const result = await contentServices.updateContent(updateRequest);

      updateUploadProgress(uploadId, { 
        status: 'success', 
        progress: 100 
      });

      // Remove upload após 3 segundos
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
  }, [updateUploadProgress, removeUpload]);

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