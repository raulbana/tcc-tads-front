import { useState, useCallback, useMemo } from "react";
import moment from "moment";
import { Comment } from "@/app/types/content";

interface UseCommentItemProps {
  comment: Comment;
  onToggleLike: (
    commentId: string,
    isReply?: boolean,
    parentId?: string
  ) => void;
  onAddReply: (parentCommentId: string, text: string) => void;
  onToggleReplies: (commentId: string) => void;
  onShowMoreReplies: (commentId: string) => void;
  isExpanded: boolean;
  visibleRepliesCount: number;
  isReply?: boolean;
  parentId?: string;
}

export const useCommentItem = ({
  comment,
  onToggleLike,
  onAddReply,
  onToggleReplies,
  onShowMoreReplies,
  isExpanded,
  visibleRepliesCount,
  isReply = false,
  parentId,
}: UseCommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = useCallback((date: Date) => {
    return moment(date).fromNow();
  }, []);

  const handleLike = useCallback(() => {
    if (!comment.id || comment.id === "undefined") {
      return;
    }
    onToggleLike(comment.id, isReply, parentId);
  }, [comment.id, isReply, parentId, onToggleLike]);

  const handleReply = useCallback(() => {
    setShowReplyForm(true);
  }, []);

  const handleSubmitReply = useCallback(
    (text: string) => {
      onAddReply(isReply ? parentId! : comment.id, text);
      setShowReplyForm(false);
    },
    [isReply, parentId, comment.id, onAddReply]
  );

  const handleCancelReply = useCallback(() => {
    setShowReplyForm(false);
  }, []);

  const handleToggleRepliesClick = useCallback(() => {
    onToggleReplies(comment.id);
  }, [comment.id, onToggleReplies]);

  const handleShowMoreRepliesClick = useCallback(() => {
    onShowMoreReplies(comment.id);
  }, [comment.id, onShowMoreReplies]);

  const visibleReplies = useMemo(
    () => comment.replies?.slice(0, visibleRepliesCount) || [],
    [comment.replies, visibleRepliesCount]
  );

  const hasMoreReplies = useMemo(
    () => (comment.replies?.length || 0) > visibleRepliesCount,
    [comment.replies, visibleRepliesCount]
  );

  const formattedDate = useMemo(
    () => formatDate(new Date(comment.createdAt)),
    [comment.createdAt, formatDate]
  );

  const remainingRepliesCount = useMemo(
    () => Math.min(5, (comment.replies?.length || 0) - visibleRepliesCount),
    [comment.replies, visibleRepliesCount]
  );

  const likeButtonProps = useMemo(
    () => ({
      onClick: handleLike,
      className: `flex items-center gap-1 text-xs transition-colors ${
        comment.isLiked
          ? "text-purple-04 hover:text-purple-03"
          : "text-gray-07 hover:text-purple-03"
      }`,
      "aria-label": `${comment.isLiked ? "Descurtir" : "Curtir"} comentário`,
    }),
    [comment.isLiked, handleLike]
  );

  const replyButtonProps = useMemo(
    () => ({
      onClick: handleReply,
      className:
        "flex items-center gap-1 text-xs transition-colors text-gray-07 hover:text-purple-03",
      "aria-label": "Responder comentário",
    }),
    [handleReply]
  );

  const toggleRepliesButtonProps = useMemo(
    () => ({
      onClick: handleToggleRepliesClick,
      className:
        "flex items-center gap-1 text-xs transition-colors text-gray-07 hover:text-purple-03",
      "aria-label": isExpanded ? "Ocultar respostas" : "Ver respostas",
    }),
    [handleToggleRepliesClick, isExpanded]
  );

  return {
    showReplyForm,
    formattedDate,
    visibleReplies,
    hasMoreReplies,
    remainingRepliesCount,
    likeButtonProps,
    replyButtonProps,
    toggleRepliesButtonProps,
    handleSubmitReply,
    handleCancelReply,
    handleShowMoreRepliesClick,
  };
};
