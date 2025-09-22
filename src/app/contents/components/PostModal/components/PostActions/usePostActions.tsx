import { useCallback, useMemo } from "react";

interface UsePostActionsProps {
  contentId: string;
  isLiked: boolean;
  isReposted: boolean;
  onToggleLike: (contentId: string) => void;
  onToggleRepost: (contentId: string) => void;
}

export const usePostActions = ({
  contentId,
  isLiked,
  isReposted,
  onToggleLike,
  onToggleRepost
}: UsePostActionsProps) => {
  const handleLike = useCallback(() => {
    onToggleLike(contentId);
  }, [contentId, onToggleLike]);

  const handleRepost = useCallback(() => {
    onToggleRepost(contentId);
  }, [contentId, onToggleRepost]);

  const formatCount = useCallback((count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }, []);

  const likeButtonProps = useMemo(() => ({
    onClick: handleLike,
    className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isLiked
        ? 'text-red-500 bg-red-50 hover:bg-red-100'
        : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
    }`,
    'aria-label': isLiked ? 'Descurtir conteúdo' : 'Curtir conteúdo'
  }), [handleLike, isLiked]);

  const repostButtonProps = useMemo(() => ({
    onClick: handleRepost,
    className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isReposted
        ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
    }`,
    'aria-label': isReposted ? 'Desfazer compartilhamento' : 'Compartilhar conteúdo'
  }), [handleRepost, isReposted]);

  return {
    likeButtonProps,
    repostButtonProps,
    formatCount
  };
};