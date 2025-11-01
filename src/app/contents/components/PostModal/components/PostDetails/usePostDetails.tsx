import { useMemo, useCallback, useState } from "react";
import moment from "moment";
import { Content } from "@/app/types/content";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export const usePostDetails = (content: Content) => {
  const [localContent, setLocalContent] = useState(content);

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

    content.images?.forEach((image, index) => {
      media.push({
        type: 'image',
        url: image,
        alt: `${content.title} - Imagem ${index + 1}`
      });
    });

    content.videos?.forEach((video, index) => {
      media.push({
        type: 'video',
        url: video,
        alt: `${content.title} - Vídeo ${index + 1}`
      });
    });

    return media;
  }, []);

  const handleToggleLike = useCallback((contentId: string) => {
    setLocalContent(prev => {
      const isCurrentlyLiked = prev.isLiked || false;
      const currentLikesCount = prev.likesCount || 0;
      
      return {
        ...prev,
        isLiked: !isCurrentlyLiked,
        likesCount: isCurrentlyLiked ? currentLikesCount - 1 : currentLikesCount + 1
      };
    });
  }, []);

  const handleToggleRepost = useCallback((contentId: string) => {
    setLocalContent(prev => {
      const isCurrentlyReposted = prev.isReposted || false;
      const currentRepostsCount = prev.repostsCount || 0;

      return {
        ...prev,
        isReposted: !isCurrentlyReposted,
        repostsCount: isCurrentlyReposted ? currentRepostsCount - 1 : currentRepostsCount + 1
      };
    });
  }, []);

  const mediaItems = useMemo(() => getAllMedia(localContent), [localContent, getAllMedia]);
  const formattedDate = useMemo(() => formatDate(localContent.createdAt), [localContent.createdAt, formatDate]);
  const hasMedia = useMemo(() => mediaItems.length > 0, [mediaItems]);
  const hasImages = useMemo(() => (localContent.images?.length ?? 0) > 0, [localContent.images]);

  return {
    formatDate,
    getAllMedia,
    mediaItems,
    formattedDate,
    hasMedia,
    hasImages,
    handleToggleLike,
    handleToggleRepost,
    localContent
  };
};