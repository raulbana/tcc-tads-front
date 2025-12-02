import { useMemo, useCallback, useState, useEffect } from "react";
import { Content } from "@/app/types/content";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  alt?: string;
}

export const usePostDetails = (content: Content) => {
  const { user } = useAuth();
  const [localContent, setLocalContent] = useState<Content>({
    ...content,
    isSaved: content.isSaved ?? false,
  });
  const contentQueries = useContentQueries(["content"]);
  const toggleLikeMutation = contentQueries.useToggleLike();
  const toggleSaveMutation = contentQueries.useToggleSaveContent();

  useEffect(() => {
    setLocalContent({
      ...content,
      isSaved: content.isSaved ?? false,
    });
  }, [content]);

  const getAllMedia = useCallback((content: Content): MediaItem[] => {
    const allMedia: MediaItem[] = [];

    if (content.cover?.url) {
      allMedia.push({
        type: content.cover.contentType.startsWith("video/")
          ? "video"
          : "image",
        url: content.cover.url,
        alt: content.title,
      });
    }

    content.media?.forEach((mediaItem) => {
      allMedia.push({
        type: mediaItem.contentType.startsWith("video/") ? "video" : "image",
        url: mediaItem.url,
        alt: mediaItem.altText || content.title,
      });
    });

    const videos = allMedia.filter((item) => item.type === "video");
    const images = allMedia.filter((item) => item.type === "image");

    return [...videos, ...images];
  }, []);

  const mediaItems = useMemo(
    () => getAllMedia(localContent),
    [localContent, getAllMedia]
  );
  const hasMedia = useMemo(() => mediaItems.length > 0, [mediaItems]);

  const handleToggleLike = useCallback(async () => {
    if (!user) return;

    const newLikedState = !localContent.isLiked;
    const newLikesCount = newLikedState
      ? (localContent.likesCount || 0) + 1
      : Math.max((localContent.likesCount || 0) - 1, 0);

    setLocalContent((prev) => ({
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
      setLocalContent((prev) => ({
        ...prev,
        isLiked: !newLikedState,
        likesCount: localContent.likesCount || 0,
      }));
    }
  }, [localContent, toggleLikeMutation, user]);

  const handleToggleSave = useCallback(async () => {
    if (!user) return;

    const newSavedState = !localContent.isSaved;

    setLocalContent((prev) => ({
      ...prev,
      isSaved: newSavedState,
    }));

    try {
      await toggleSaveMutation.mutateAsync({
        contentId: localContent.id,
        userId: user.id,
        control: newSavedState,
      });
    } catch (error) {
      setLocalContent((prev) => ({
        ...prev,
        isSaved: !newSavedState,
      }));
    }
  }, [localContent, toggleSaveMutation, user]);

  return {
    mediaItems,
    hasMedia,
    handleToggleLike,
    handleToggleSave,
    localContent,
  };
};
