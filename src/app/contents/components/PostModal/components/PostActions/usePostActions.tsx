import { useCallback, useMemo } from "react";

interface UsePostActionsProps {
  contentId: string;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (contentId: string) => void;
  onToggleSave: (contentId: string) => void;
}

export const usePostActions = ({
  contentId,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave
}: UsePostActionsProps) => {
  const handleLike = useCallback(() => {
    onToggleLike(contentId);
  }, [contentId, onToggleLike]);

  const handleSave = useCallback(() => {
    onToggleSave(contentId);
  }, [contentId, onToggleSave]);

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

  const saveButtonProps = useMemo(() => ({
    onClick: handleSave,
    className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isSaved
        ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
        : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
    }`,
    'aria-label': isSaved ? 'Remover dos salvos' : 'Salvar conteúdo'
  }), [handleSave, isSaved]);

  return {
    likeButtonProps,
    saveButtonProps,
    formatCount
  };
};