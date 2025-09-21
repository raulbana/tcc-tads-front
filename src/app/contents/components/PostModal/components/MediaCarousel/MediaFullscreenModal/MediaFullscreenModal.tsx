"use client";
import React from "react";
import { createPortal } from "react-dom";
import { XIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { MediaItem } from "../../PostDetails/usePostDetails";

interface MediaFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToIndex: (index: number) => void;
}

const MediaFullscreenModal: React.FC<MediaFullscreenModalProps> = ({
  isOpen,
  onClose,
  media,
  currentIndex,
  onPrevious,
  onNext,
  onGoToIndex,
}) => {
  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const hasMultipleItems = media.length > 1;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasMultipleItems) {
      onPrevious();
    } else if (e.key === 'ArrowRight' && hasMultipleItems) {
      onNext();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      
      <button
        onClick={onClose}
        className="cursor-pointer absolute top-4 right-4 z-10 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        aria-label="Fechar visualização em tela cheia"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {hasMultipleItems && (
        <div className="absolute top-4 left-4 z-10 text-white bg-black/50 px-3 py-1 rounded">
          {currentIndex + 1} / {media.length}
        </div>
      )}

      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
        {currentMedia.type === 'image' ? (
          <div className="relative w-full h-full">
            <Image
              src={currentMedia.url}
              alt={currentMedia.alt || 'Mídia em tela cheia'}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        ) : (
          <video
            src={currentMedia.url}
            className="max-w-full max-h-full object-contain"
            controls
            autoPlay
            aria-label={currentMedia.alt || 'Vídeo em tela cheia'}
          />
        )}

        {hasMultipleItems && (
          <>
            <button
              onClick={onPrevious}
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Mídia anterior"
            >
              <CaretLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={onNext}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Próxima mídia"
            >
              <CaretRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {hasMultipleItems && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToIndex(index)}
                className={`cursor-pointer w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para mídia ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MediaFullscreenModal;