"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import {
  TrashIcon,
  VideoIcon,
  DotsSixVertical,
} from "@phosphor-icons/react";
import Button from "@/app/components/Button/Button";
import FileUpload from "@/app/contents/components/FileUpload/FileUpload";
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

interface ExistingMedia {
  id?: number | null;
  url: string;
  contentType: string;
  contentSize: number;
  altText?: string | null;
}

interface MediaManagerProps {
  existingMedia: ExistingMedia[];
  newImages: File[];
  newVideo?: File;
  onExistingMediaChange: (media: ExistingMedia[]) => void;
  onNewFilesChange: (images: File[], video?: File) => void;
  onRemoveExisting: (id: number) => void;
  error?: string;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  existingMedia,
  newImages,
  newVideo,
  onExistingMediaChange,
  onNewFilesChange,
  onRemoveExisting,
  error,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);

      const activeIndex = existingMedia.findIndex(
        (m) => String(m.id || m.url) === activeId
      );
      const overIndex = existingMedia.findIndex(
        (m) => String(m.id || m.url) === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newMedia = arrayMove(existingMedia, activeIndex, overIndex);
        onExistingMediaChange(newMedia);
      }
    }
  };

  const existingImageIds = useMemo(
    () => existingMedia.map((m) => String(m.id || m.url)),
    [existingMedia]
  );

  const hasExistingMedia = existingMedia && existingMedia.length > 0;

  return (
    <div className="space-y-4">
      {hasExistingMedia && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Mídias existentes ({existingMedia.length})
          </label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={existingImageIds}
              strategy={verticalListSortingStrategy}
            >
              {existingMedia.map((media, index) => {
                if (!media || !media.url) return null;
                
                const isVideo = media.contentType?.startsWith("video/") || false;
                const mediaId = String(media.id || media.url);

                return (
                  <SortableExistingMediaItem
                    key={mediaId}
                    media={media}
                    index={index}
                    isVideo={isVideo}
                    onRemove={() => {
                      if (media.id) {
                        onRemoveExisting(media.id);
                      }
                    }}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {hasExistingMedia ? "Adicionar novas mídias" : "Mídia (imagens e vídeos)"}
        </label>
        <FileUpload
          images={newImages}
          video={newVideo}
          onFilesChange={onNewFilesChange}
          error={error}
        />
      </div>
    </div>
  );
};

interface SortableExistingMediaItemProps {
  media: ExistingMedia;
  index: number;
  isVideo: boolean;
  onRemove: () => void;
}

const SortableExistingMediaItem: React.FC<SortableExistingMediaItemProps> = ({
  media,
  index,
  isVideo,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(media.id || media.url) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCover = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 ${
        isDragging ? "shadow-lg z-50" : ""
      } ${isCover ? "ring-2 ring-purple-500 ring-offset-2" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
        aria-label="Arrastar para reordenar"
      >
        <DotsSixVertical className="w-5 h-5 text-blue-600" />
      </div>

      {isVideo ? (
        <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
          <VideoIcon className="w-6 h-6 text-purple-600" weight="fill" />
        </div>
      ) : (
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={media.url}
            alt={media.altText || "Mídia existente"}
            fill
            className="rounded object-cover"
            sizes="48px"
          />
          {isCover && (
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
              CAPA
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {isVideo ? "Vídeo" : "Imagem"} {index + 1}
        </p>
        <p className="text-xs text-gray-500">
          {media.contentSize
            ? `${(media.contentSize / 1024 / 1024).toFixed(2)} MB`
            : "Tamanho não disponível"}
        </p>
      </div>

      <div className="flex-shrink-0">
        <Button
          onClick={onRemove}
          icon={<TrashIcon className="w-4 h-4" />}
          iconPosition="CENTER"
          type="SECONDARY"
          aria-label="Remover mídia"
        />
      </div>
    </div>
  );
};

export default MediaManager;

