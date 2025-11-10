"use client";
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { CloudArrowUpIcon, TrashIcon, VideoIcon } from '@phosphor-icons/react';
import Button from '@/app/components/Button/Button';

interface FileUploadProps {
  images: File[];
  video?: File;
  onFilesChange: (images: File[], video?: File) => void;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  images,
  video,
  onFilesChange,
  error
}) => {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string>('');

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total (como no mobile)

  useEffect(() => {
    // Gerar previews para as imagens
    const newPreviews: Record<string, string> = {};
    
    images.forEach(file => {
      if (!previews[file.name]) {
        newPreviews[file.name] = URL.createObjectURL(file);
      }
    });

    if (video && !previews[video.name]) {
      newPreviews[video.name] = URL.createObjectURL(video);
    }

    setPreviews(prev => ({ ...prev, ...newPreviews }));

    // Cleanup
    return () => {
      Object.values(newPreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [images, video]);

  const calculateTotalSize = useCallback((files: File[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLocalError('');

    const newImages: File[] = [];
    let newVideo: File | undefined = video;

    acceptedFiles.forEach(file => {
      // Verificar tamanho individual
      if (file.size > MAX_FILE_SIZE) {
        setLocalError(`O arquivo ${file.name} excede o tamanho máximo de 50MB`);
        return;
      }

      if (file.type.startsWith('video/')) {
        if (newVideo) {
          setLocalError('Apenas 1 vídeo é permitido por post');
          return;
        }
        newVideo = file;
      } else if (file.type.startsWith('image/')) {
        newImages.push(file);
      }
    });

    const allFiles = [...images, ...newImages];
    if (newVideo) {
      allFiles.push(newVideo);
    }

    // Verificar tamanho total
    const totalSize = calculateTotalSize(allFiles);
    if (totalSize > MAX_TOTAL_SIZE) {
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      setLocalError(`Limite excedido (${totalSizeMB}MB). Máximo: 10MB total por post`);
      return;
    }

    onFilesChange([...images, ...newImages], newVideo);
  }, [images, video, onFilesChange, calculateTotalSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    multiple: true
  });

  const removeFile = useCallback((fileName: string) => {
    if (video?.name === fileName) {
      onFilesChange(images, undefined);
    } else {
      onFilesChange(images.filter(img => img.name !== fileName), video);
    }
    
    if (previews[fileName]) {
      URL.revokeObjectURL(previews[fileName]);
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fileName];
        return newPreviews;
      });
    }
    
    setLocalError('');
  }, [images, video, onFilesChange, previews]);

  const hasFiles = images.length > 0 || !!video;
  const displayError = error || localError;

  const totalSize = useMemo(() => {
    const allFiles = [...images];
    if (video) allFiles.push(video);
    return calculateTotalSize(allFiles);
  }, [images, video, calculateTotalSize]);

  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  const maxSizeMB = (MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${displayError ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
        <p className="text-gray-700 mb-2">
          {isDragActive
            ? 'Solte os arquivos aqui...'
            : 'Arraste e solte arquivos aqui ou clique para selecionar'}
        </p>
        <p className="text-sm text-gray-500">
          Formatos: JPG, PNG, WebP, MP4, WebM / Máx: 50MB por arquivo
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Total: {totalSizeMB}MB / {maxSizeMB}MB
        </p>
      </div>

      {displayError && (
        <p className="text-red-500 text-sm mt-2">{displayError}</p>
      )}

      {hasFiles && (
        <div className="space-y-3 flex flex-col">
          {images.map((file, index) => (
            <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <Image
                src={previews[file.name]}
                alt={file.name}
                width={48}
                height={48}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {index === 0 && 'Capa - '}{file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <Button
                  onClick={() => removeFile(file.name)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  iconPosition="CENTER"
                  type="SECONDARY"
                  aria-label="Remover arquivo"
                />
              </div>
            </div>
          ))}

          {video && (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{video.name}</p>
                <p className="text-xs text-gray-500">
                  {(video.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <Button
                  onClick={() => removeFile(video.name)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  iconPosition="CENTER"
                  type="SECONDARY"
                  aria-label="Remover arquivo"
                />
              </div>
            </div>
          )}

          {images.length > 1 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-5 h-5 text-blue-600 mt-0.5">💡</div>
              <p className="text-sm text-blue-800">
                Dica: A primeira imagem será usada como capa do post!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;