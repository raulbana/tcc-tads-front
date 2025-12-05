import { useState, useCallback, useMemo } from "react";
import { MediaItem } from "../PostDetails/usePostDetails";

interface UseMediaCarouselProps {
  media: MediaItem[];
}

export const useMediaCarousel = ({ media }: UseMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  }, [media.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  }, [media.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const openFullscreen = useCallback(() => {
    setIsFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  const currentMedia = useMemo(() => media[currentIndex], [media, currentIndex]);
  const hasMultipleItems = useMemo(() => media.length > 1, [media.length]);
  const isEmpty = useMemo(() => media.length === 0, [media.length]);

  const previousButtonProps = useMemo(() => ({
    onClick: goToPrevious,
    className: "absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10",
    'aria-label': "Mídia anterior"
  }), [goToPrevious]);

  const nextButtonProps = useMemo(() => ({
    onClick: goToNext,
    className: "absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10",
    'aria-label': "Próxima mídia"
  }), [goToNext]);

  const mediaClickProps = useMemo(() => ({
    onClick: openFullscreen,
    className: "cursor-pointer object-contain",
    'aria-label': "Clique para ver em tela cheia"
  }), [openFullscreen]);

  return {
    currentIndex,
    currentMedia,
    hasMultipleItems,
    isEmpty,
    isFullscreenOpen,
    goToPrevious,
    goToNext,
    goToIndex,
    openFullscreen,
    closeFullscreen,
    previousButtonProps,
    nextButtonProps,
    mediaClickProps
  };
};