import { useMemo, useCallback } from "react";
import moment from "moment";
import { Content } from "@/app/types/content";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export const usePostDetails = (content: Content) => {
  const formatDate = useCallback((date: Date) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  }, []);

  const getAllMedia = useCallback((content: Content): MediaItem[] => {
    const media: MediaItem[] = [];
    
    if (content.coverUrl) {
      media.push({
        type: 'image',
        url: content.coverUrl,
        alt: content.title
      });
    }

    content.images.forEach((image, index) => {
      media.push({
        type: 'image',
        url: image,
        alt: `${content.title} - Imagem ${index + 1}`
      });
    });

    content.videos.forEach((video, index) => {
      media.push({
        type: 'video',
        url: video,
        alt: `${content.title} - Vídeo ${index + 1}`
      });
    });

    return media;
  }, []);

  const mediaItems = useMemo(() => getAllMedia(content), [content, getAllMedia]);
  const formattedDate = useMemo(() => formatDate(content.createdAt), [content.createdAt, formatDate]);
  const hasMedia = useMemo(() => mediaItems.length > 0, [mediaItems]);
  const hasImages = useMemo(() => content.images.length > 0, [content.images]);
  const hasTags = useMemo(() => content.tags && content.tags.length > 0, [content.tags]);

  return {
    formatDate,
    getAllMedia,
    mediaItems,
    formattedDate,
    hasMedia,
    hasImages,
    hasTags
  };
};