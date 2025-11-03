"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import contentServices from '@/app/contents/services/contentServices';
import { ContentFormData } from '@/app/contents/schemas/contentSchema';
import { useAuth } from './AuthContext';

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

const UPLOAD_STORAGE_KEY = 'daily_iu_uploads';

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  // Restaurar uploads do localStorage ao montar
  useEffect(() => {
    const storedUploads = localStorage.getItem(UPLOAD_STORAGE_KEY);
    if (storedUploads) {
      try {
        const parsed = JSON.parse(storedUploads);
        setUploads(parsed);
      } catch (error) {
        console.error('Erro ao restaurar uploads:', error);
      }
    }
  }, []);

  // Persistir uploads no localStorage sempre que mudarem
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

      // Converter Files para UploadFile
      const files: File[] = [];
      
      if (data.images && data.images.length > 0) {
        files.push(...data.images);
      }
      
      if (data.video) {
        files.push(data.video);
      }

      updateUploadProgress(uploadId, { progress: 30 });

      // Criar conteúdo com arquivos
      const result = await contentServices.createContentWithFiles(
        {
          title: data.title,
          description: data.description,
          subtitle: data.subtitle,
          subcontent: data.subcontent,
          categories: data.categories.map(c => parseInt(c.id)),
          files: files,
        },
        user.id.toString()
      );

      updateUploadProgress(uploadId, { 
        status: 'success', 
        progress: 100,
        contentId: result.id
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
  }, [user, updateUploadProgress, removeUpload]);

  const updateContent = useCallback(async (contentId: string, data: ContentFormData): Promise<string> => {
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

      const result = await contentServices.updateContent(
        contentId,
        {
          title: data.title,
          description: data.description,
          subtitle: data.subtitle,
          subcontent: data.subcontent,
          categories: data.categories.map(c => c.id),
        },
        user.id.toString()
      );

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
  }, [user, updateUploadProgress, removeUpload]);

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