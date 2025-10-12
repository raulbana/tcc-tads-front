"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TrashIcon, CloudArrowUpIcon } from '@phosphor-icons/react';
import Button from '@/app/components/Button/Button';
import Image from 'next/image';

interface FileUploadProps {
  onFilesChange: (images: File[], video?: File) => void;
  images: File[];
  video?: File;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  images,
  video,
  error
}) => {
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles: File[] = [];
    let videoFile: File | undefined;

    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        imageFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/') && !videoFile) {
        videoFile = file;
        
        const url = URL.createObjectURL(file);
        setPreviews(prev => ({
          ...prev,
          [file.name]: url
        }));
      }
    });

    onFilesChange([...images, ...imageFiles], video || videoFile);
  }, [images, video, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = useCallback((fileName: string) => {
    const isVideo = video?.name === fileName;

    if (isVideo) {
      onFilesChange(images, undefined);
      if (previews[fileName] && previews[fileName].startsWith('blob:')) {
        URL.revokeObjectURL(previews[fileName]);
      }
    } else {
      const newImages = images.filter(img => img.name !== fileName);
      onFilesChange(newImages, video);
    }

    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  }, [images, video, onFilesChange, previews]);

  const hasFiles = images.length > 0 || video;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
          ? 'border-purple-04 bg-purple-01'
          : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-purple-04'
          }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-purple-04" />
        <p className="text-gray-700 mb-2">
          {isDragActive
            ? 'Solte os arquivos aqui...'
            : 'Arraste e solte arquivos aqui ou clique para selecionar'}
        </p>
        <p className="text-sm text-gray-500">
          Formatos: JPG, PNG, WebP, MP4, WebM / Máx: 50MB por arquivo
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {hasFiles && (
        <div className="space-y-3 flex flex-col">
          {images.map((file) => (
            <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <Image
                src={previews[file.name]}
                alt={file.name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded"
                style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <Button
                  onClick={() => removeFile(file.name)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  iconPosition="CENTER"
                  aria-label="Remover arquivo"
                />
              </div>
            </div>
          ))}

          {video && (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              {previews[video.name] && (
                <video
                  src={previews[video.name]}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
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