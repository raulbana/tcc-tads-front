"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MediaItem } from "../PostDetails/usePostDetails";

interface MediaCarouselProps {
  media: MediaItem[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {currentMedia.type === 'image' ? (
        <Image
          src={currentMedia.url}
          alt={currentMedia.alt || 'Mídia do post'}
          fill
          className="object-cover"
        />
      ) : (
        <video
          src={currentMedia.url}
          className="w-full h-full object-cover"
          controls
          aria-label={currentMedia.alt || 'Vídeo do post'}
        />
      )}

      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Mídia anterior"
          >
            <CaretLeftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Próxima mídia"
          >
            <CaretRightIcon className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Ir para mídia ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {media.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;