import { useMemo, useCallback, useState } from "react";
import moment from "moment";
import { Content } from "@/app/types/content";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export const usePostDetails = (content: Content) => {
  const { user } = useAuth();
  const [localContent, setLocalContent] = useState(content);
  const contentQueries = useContentQueries(['content']);
  const toggleLikeMutation = contentQueries.useToggleLike();
  const toggleRepostMutation = contentQueries.useToggleRepost();

  const formatDate = useCallback((date: Date | string) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  }, []);

  const getAllMedia = useCallback((content: Content): MediaItem[] => {
    const media: MediaItem[] = [];
    
    if (content.cover?.url) {
      media.push({
        type: content.cover.contentType.startsWith('video/') ? 'video' : 'image',
        url: content.cover.url,
        alt: content.title
      });
    }

    content.media?.forEach((mediaItem) => {
      media.push({
        type: mediaItem.contentType.startsWith('video/') ? 'video' : 'image',
        url: mediaItem.url,
        alt: mediaItem.altText || content.title
      });
    });

    return media;
  }, []);

  const mediaItems = useMemo(() => getAllMedia(localContent), [localContent, getAllMedia]);
  const formattedDate = useMemo(() => formatDate(localContent.createdAt), [localContent.createdAt, formatDate]);
  const hasMedia = useMemo(() => mediaItems.length > 0, [mediaItems]);

  const handleToggleLike = useCallback(async () => {
    if (!user) return;

    const newLikedState = !localContent.isLiked;
    const newLikesCount = newLikedState
      ? (localContent.likesCount || 0) + 1
      : Math.max((localContent.likesCount || 0) - 1, 0);

    setLocalContent(prev => ({
      ...prev,
      isLiked: newLikedState,
      likesCount: newLikesCount,
    }));

    try {
      await toggleLikeMutation.mutateAsync({
        id: localContent.id,
        liked: newLikedState,
        userId: user.id.toString(),
      });
    } catch (error) {
      setLocalContent(prev => ({
        ...prev,
        isLiked: !newLikedState,
        likesCount: localContent.likesCount || 0,
      }));
      console.error('Error toggling like:', error);
    }
  }, [localContent, toggleLikeMutation, user]);

  const handleToggleRepost = useCallback(async () => {
    if (!user) return;

    const newRepostedState = !localContent.isReposted;
    const newRepostsCount = newRepostedState
      ? (localContent.repostsCount || 0) + 1
      : Math.max((localContent.repostsCount || 0) - 1, 0);

    setLocalContent(prev => ({
      ...prev,
      isReposted: newRepostedState,
      repostsCount: newRepostsCount,
    }));

    try {
      await toggleRepostMutation.mutateAsync({
        id: localContent.id,
        reposted: newRepostedState,
        userId: user.id.toString(),
      });
    } catch (error) {
      setLocalContent(prev => ({
        ...prev,
        isReposted: !newRepostedState,
        repostsCount: localContent.repostsCount || 0,
      }));
      console.error('Error toggling repost:', error);
    }
  }, [localContent, toggleRepostMutation, user]);

  return {
    mediaItems,
    formattedDate,
    hasMedia,
    handleToggleLike,
    handleToggleRepost,
    localContent
  };
};