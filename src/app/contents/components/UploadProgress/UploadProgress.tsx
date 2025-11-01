"use client";
import React from 'react';
import { useUpload } from '@/app/contexts/UploadContext';
import { XIcon, CheckIcon, WarningIcon } from '@phosphor-icons/react';

const UploadProgress: React.FC = () => {
  const { uploads, removeUpload } = useUpload();

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {upload.type === 'create' ? 'Criando post' : 'Editando post'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {upload.data?.title || 'Sem título'}
              </p>
            </div>
            
            <button
              onClick={() => removeUpload(upload.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <XIcon />
            </button>
          </div>

          <div className="space-y-2">
            {upload.status === 'pending' && (
              <div className="text-xs text-gray-500">Preparando...</div>
            )}

            {upload.status === 'uploading' && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-04 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">{upload.progress}%</div>
              </>
            )}

            {upload.status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckIcon className="w-4 h-4" />
                <span className="text-xs">Concluído!</span>
              </div>
            )}

            {upload.status === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <WarningIcon className="w-4 h-4" />
                <span className="text-xs">{upload.error || 'Erro desconhecido'}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadProgress;