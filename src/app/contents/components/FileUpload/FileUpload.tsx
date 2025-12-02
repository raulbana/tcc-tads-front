"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  CloudArrowUpIcon,
  TrashIcon,
  VideoIcon,
  DotsSixVertical,
  Lightbulb,
} from "@phosphor-icons/react";
import Button from "@/app/components/Button/Button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FileUploadProps {
  images: (File | { name: string; size: number; type: string; url: string; isExisting?: boolean })[];
  video?: File | { name: string; size: number; type: string; url: string; isExisting?: boolean };
  onFilesChange: (images: (File | { name: string; size: number; type: string; url: string; isExisting?: boolean })[], video?: File | { name: string; size: number; type: string; url: string; isExisting?: boolean }) => void;
  onRemoveFile?: (fileName: string) => void;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  images,
  video,
  onFilesChange,
  onRemoveFile,
  error,
}) => {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string>("");

  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 500 * 1024 * 1024;

  const imagesKey = useMemo(() => {
    return images.map(img => {
      if ((img as any).isExisting) {
        return (img as any).url || (img as any).originalUrl || img.name;
      }
      return img.name;
    }).join(',');
  }, [images]);

  const videoKey = useMemo(() => {
    if (!video) return '';
    if ((video as any).isExisting) {
      return (video as any).url || (video as any).originalUrl || video.name;
    }
    return video.name;
  }, [video]);

  useEffect(() => {
    setPreviews((prev) => {
      const newPreviews: Record<string, string> = { ...prev };
      let hasNewPreviews = false;

      images.forEach((file) => {
        const fileName = file.name;
        if (!newPreviews[fileName]) {
          if ((file as any).isExisting && (file as any).url) {
            newPreviews[fileName] = (file as any).url;
            hasNewPreviews = true;
          } else if (file instanceof File) {
            newPreviews[fileName] = URL.createObjectURL(file);
            hasNewPreviews = true;
          }
        }
      });

      if (video) {
        const videoName = video.name;
        if (!newPreviews[videoName]) {
          if ((video as any).isExisting && (video as any).url) {
            newPreviews[videoName] = (video as any).url;
            hasNewPreviews = true;
          } else if (video instanceof File) {
            newPreviews[videoName] = URL.createObjectURL(video);
            hasNewPreviews = true;
          }
        }
      }

      const currentFileNames = new Set([
        ...images.map((img) => img.name),
        ...(video ? [video.name] : []),
      ]);

      Object.keys(newPreviews).forEach((fileName) => {
        if (!currentFileNames.has(fileName)) {
          if (newPreviews[fileName].startsWith('blob:')) {
            URL.revokeObjectURL(newPreviews[fileName]);
          }
          delete newPreviews[fileName];
        }
      });

      return newPreviews;
    });
  }, [imagesKey, videoKey]);

  const calculateTotalSize = useCallback((files: File[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLocalError("");

      const newImages: File[] = [];
      const currentVideo = video && !(video as any).isExisting ? video as File : undefined;
      let newVideo: File | undefined = currentVideo;

      acceptedFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setLocalError(
            `O arquivo ${file.name} excede o tamanho máximo de 50MB`
          );
          return;
        }

        if (file.type.startsWith("video/")) {
          if (newVideo) {
            setLocalError("Apenas 1 vídeo é permitido por post");
            return;
          }
          newVideo = file;
        } else if (file.type.startsWith("image/")) {
          newImages.push(file);
        }
      });

      const newFilesOnly = images.filter(img => img instanceof File) as File[];
      const allFiles = [...newFilesOnly, ...newImages];
      if (newVideo) {
        allFiles.push(newVideo);
      }

      const totalSize = calculateTotalSize(allFiles);
      if (totalSize > MAX_TOTAL_SIZE) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        setLocalError(
          `Limite excedido (${totalSizeMB}MB). Máximo: 500MB total por post`
        );
        return;
      }

      const existingImages = images.filter(img => (img as any).isExisting);
      onFilesChange([...existingImages, ...newImages], newVideo);
    },
    [images, video, onFilesChange, calculateTotalSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg"],
    },
    multiple: true,
  });

  const removeFile = useCallback(
    (fileName: string) => {
      if (onRemoveFile) {
        onRemoveFile(fileName);
      } else {
        if (video?.name === fileName) {
          onFilesChange(images.filter(img => img instanceof File) as File[], undefined);
        } else {
          const newImages = images.filter((img) => img.name !== fileName && img instanceof File) as File[];
          const newVideo = video && video.name !== fileName && !(video as any).isExisting ? video as File : undefined;
          onFilesChange(newImages, newVideo);
        }
      }

      if (previews[fileName] && previews[fileName].startsWith('blob:')) {
        URL.revokeObjectURL(previews[fileName]);
      }
        setPreviews((prev) => {
          const newPreviews = { ...prev };
          delete newPreviews[fileName];
          return newPreviews;
        });

      setLocalError("");
    },
    [images, video, onFilesChange, onRemoveFile, previews]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.name === active.id);
      const newIndex = images.findIndex((img) => img.name === over.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      onFilesChange(newImages as any, video as any);
    }
  };

  const imageIds = useMemo(() => images.map((img) => img.name), [images]);

  const hasFiles = images.length > 0 || !!video;
  const displayError = error || localError;

  const totalSize = useMemo(() => {
    const newFiles = images.filter(img => img instanceof File) as File[];
    const allFiles = [...newFiles];
    if (video && video instanceof File) allFiles.push(video);
    return calculateTotalSize(allFiles);
  }, [images, video, calculateTotalSize]);

  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  const maxSizeMB = (MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300 hover:border-purple-400"
          }
          ${displayError ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
        <p className="text-gray-700 mb-2">
          {isDragActive
            ? "Solte os arquivos aqui..."
            : "Arraste e solte arquivos aqui ou clique para selecionar"}
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
          {images.length > 1 && (
            <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Lightbulb
                className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                weight="bold"
              />
              <p className="text-sm text-purple-800">
                Dica: Arraste a imagem que você quer como capa para o primeiro
                lugar da lista! 👆
              </p>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={imageIds}
              strategy={verticalListSortingStrategy}
            >
              {images.map((file, index) => (
                <SortableImageItem
                  key={file.name}
                  file={file instanceof File ? file : file as any}
                  index={index}
                  previewUrl={previews[file.name] || ((file as any).url)}
                  onRemove={removeFile}
                  isExisting={(file as any).isExisting}
                />
              ))}
            </SortableContext>
          </DndContext>

          {video && (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center opacity-50">
                <VideoIcon className="w-5 h-5 text-gray-400" weight="fill" />
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                <VideoIcon className="w-6 h-6 text-purple-600" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {video.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(video.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex-shrink-0">
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
        </div>
      )}
    </div>
  );
};

interface SortableImageItemProps {
  file: File | { name: string; size: number; type: string; url?: string; isExisting?: boolean };
  index: number;
  previewUrl?: string;
  onRemove: (fileName: string) => void;
  isExisting?: boolean;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  file,
  index,
  previewUrl,
  onRemove,
  isExisting,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasValidPreview = previewUrl && previewUrl !== "";
  const isCover = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-gray-100 rounded-lg ${
        isDragging ? "shadow-lg z-50" : ""
      } ${isCover ? "ring-2 ring-purple-500 ring-offset-2" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
        aria-label="Arrastar para reordenar"
      >
        <DotsSixVertical className="w-5 h-5 text-gray-500" />
      </div>

      {hasValidPreview ? (
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={previewUrl || (file as any).url || ''}
            alt={file.name}
            fill
            className="rounded object-cover"
            sizes="48px"
            unoptimized={isExisting}
          />
          {isCover && (
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
              CAPA
            </div>
          )}
          {isExisting && (
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-full font-semibold">
              EXISTENTE
            </div>
          )}
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          <CloudArrowUpIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      <div className="flex-shrink-0">
        <Button
          onClick={() => onRemove(file.name)}
          icon={<TrashIcon className="w-4 h-4" />}
          iconPosition="CENTER"
          type="SECONDARY"
          aria-label="Remover arquivo"
        />
      </div>
    </div>
  );
};

export default FileUpload;
