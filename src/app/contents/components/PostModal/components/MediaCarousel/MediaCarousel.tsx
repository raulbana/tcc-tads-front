"use client";
import React from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MediaItem } from "../PostDetails/usePostDetails";
import { useMediaCarousel } from "./useMediaCarousel";
import MediaFullscreenModal from "./MediaFullscreenModal/MediaFullscreenModal";

interface MediaCarouselProps {
  media: MediaItem[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media }) => {
  const {
    currentIndex,
    currentMedia,
    hasMultipleItems,
    isEmpty,
    isFullscreenOpen,
    goToIndex,
    goToPrevious,
    goToNext,
    closeFullscreen,
    previousButtonProps,
    nextButtonProps,
    mediaClickProps
  } = useMediaCarousel({ media });

  if (isEmpty) return null;

  return (
    <>
      <div className="relative aspect-square bg-black rounded-lg group">
        {currentMedia.type === 'image' ? (
          <Image
            src={currentMedia.url}
            alt={currentMedia.alt || 'Mídia do post'}
            fill
            {...mediaClickProps}
          />
        ) : (
          <div {...mediaClickProps} className="w-full h-full">
            <video
              src={currentMedia.url}
              className="cursor-pointer w-full h-full object-contain"
              controls
              aria-label={currentMedia.alt || 'Vídeo do post'}
            />
          </div>
        )}

        {hasMultipleItems && (
          <>
            <button {...previousButtonProps}>
              <CaretLeftIcon className="w-5 h-5" />
            </button>

            <button {...nextButtonProps}>
              <CaretRightIcon className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Ir para mídia ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {hasMultipleItems && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      <MediaFullscreenModal
        isOpen={isFullscreenOpen}
        onClose={closeFullscreen}
        media={media}
        currentIndex={currentIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onGoToIndex={goToIndex}
      />
    </>
  );
};

export default MediaCarousel;