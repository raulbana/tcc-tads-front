"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ContentFormData } from '../contents/schemas/contentSchema';
import contentServices, { CreateContentRequest, UpdateContentRequest } from '../contents/services/contentServices';

interface UploadProgress {
  id: string;
  type: 'create' | 'update';
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  data?: ContentFormData;
}

interface UploadContextType {
  uploads: UploadProgress[];
  createContent: (data: ContentFormData) => Promise<string>;
  updateContent: (id: string, data: Partial<ContentFormData>) => Promise<string>;
  removeUpload: (uploadId: string) => void;
  getUploadProgress: (uploadId: string) => UploadProgress | undefined;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const generateUploadId = () => `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
        images: data.images,
        video: data.video,
        categories: data.categories,
      };

      updateUploadProgress(uploadId, { progress: 50 });

      const result = await contentServices.createContent(createRequest);

      updateUploadProgress(uploadId, { status: 'completed', progress: 100 });

      // Remove upload after 3 seconds
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => upload.id !== uploadId));
      }, 3000);

      return result.id;
    } catch (error) {
      updateUploadProgress(uploadId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
      throw error;
    }
  }, [updateUploadProgress]);

  const updateContent = useCallback(async (id: string, data: Partial<ContentFormData>): Promise<string> => {
    const uploadId = generateUploadId();
    
    const newUpload: UploadProgress = {
      id: uploadId,
      type: 'update',
      progress: 0,
      status: 'pending',
      data: data as ContentFormData
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      updateUploadProgress(uploadId, { status: 'uploading', progress: 20 });

      const updateRequest: UpdateContentRequest = {
        id,
        ...data
      };

      updateUploadProgress(uploadId, { progress: 50 });

      const result = await contentServices.updateContent(updateRequest);

      updateUploadProgress(uploadId, { status: 'completed', progress: 100 });

      // Remove upload after 3 seconds
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => upload.id !== uploadId));
      }, 3000);

      return result.id;
    } catch (error) {
      updateUploadProgress(uploadId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
      throw error;
    }
  }, [updateUploadProgress]);

  const removeUpload = useCallback((uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  }, []);

  const getUploadProgress = useCallback((uploadId: string) => {
    return uploads.find(upload => upload.id === uploadId);
  }, [uploads]);

  return (
    <UploadContext.Provider value={{
      uploads,
      createContent,
      updateContent,
      removeUpload,
      getUploadProgress,
    }}>
      {children}
    </UploadContext.Provider>
  );
};