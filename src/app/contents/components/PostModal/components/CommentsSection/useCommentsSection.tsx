import { useState, useCallback, useMemo } from "react";
import { Content, Comment } from "@/app/types/content";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";

export const useCommentsSection = (content: Content) => {
  const { user } = useAuth();
  const contentQueries = useContentQueries(['content']);
  const createCommentMutation = contentQueries.useCreateComment();
  const likeCommentMutation = contentQueries.useLikeComment();

  const [localComments, setLocalComments] = useState<Comment[]>(content.comments || []);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [repliesVisibleCount, setRepliesVisibleCount] = useState<Map<string, number>>(new Map());

  const comments = useMemo(() => localComments, [localComments]);
  const commentsCount = useMemo(() => comments.length, [comments]);

  const handleAddComment = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;

    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      contentId: content.id,
      text: text.trim(),
      authorId: user.id.toString(),
      authorName: user.name,
      authorImage: user.profilePictureUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      repliesCount: 0,
      replies: [],
    };

    setLocalComments(prev => [...prev, optimisticComment]);

    try {
      await createCommentMutation.mutateAsync({
        contentId: parseInt(content.id),
        authorId: user.id,
        text: text.trim(),
      });
    } catch (error) {
      setLocalComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      console.error('Error adding comment:', error);
    }
  }, [user, content.id, createCommentMutation]);

  const handleAddReply = useCallback(async (parentCommentId: string, text: string) => {
    if (!user || !text.trim()) return;

    const optimisticReply: Comment = {
      id: `temp-reply-${Date.now()}`,
      contentId: content.id,
      text: text.trim(),
      authorId: user.id.toString(),
      authorName: user.name,
      authorImage: user.profilePictureUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      repliesCount: 0,
      replies: [],
    };

    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), optimisticReply],
            repliesCount: (comment.repliesCount || 0) + 1,
          };
        }
        return comment;
      })
    );

    try {
      await createCommentMutation.mutateAsync({
        contentId: parseInt(content.id),
        authorId: user.id,
        text: text.trim(),
        replyToCommentId: parseInt(parentCommentId),
      });
    } catch (error) {
      setLocalComments(prev =>
        prev.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: (comment.replies || []).filter(r => r.id !== optimisticReply.id),
              repliesCount: Math.max((comment.repliesCount || 0) - 1, 0),
            };
          }
          return comment;
        })
      );
      console.error('Error adding reply:', error);
    }
  }, [user, content.id, createCommentMutation]);

  const handleToggleLike = useCallback(async (commentId: string) => {
    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          const newLikedState = !comment.isLikedByCurrentUser;
          return {
            ...comment,
            isLikedByCurrentUser: newLikedState,
            likesCount: newLikedState
              ? (comment.likesCount || 0) + 1
              : Math.max((comment.likesCount || 0) - 1, 0),
          };
        }
        return comment;
      })
    );

    try {
      await likeCommentMutation.mutateAsync(commentId);
    } catch (error) {
      setLocalComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            const revertLikedState = !comment.isLikedByCurrentUser;
            return {
              ...comment,
              isLikedByCurrentUser: revertLikedState,
              likesCount: revertLikedState
                ? (comment.likesCount || 0) + 1
                : Math.max((comment.likesCount || 0) - 1, 0),
            };
          }
          return comment;
        })
      );
      console.error('Error toggling comment like:', error);
    }
  }, [likeCommentMutation]);

  const handleToggleReplies = useCallback((commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleShowMoreReplies = useCallback((commentId: string) => {
    setRepliesVisibleCount(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(commentId) || 3;
      newMap.set(commentId, current + 5);
      return newMap;
    });
  }, []);

  return {
    comments,
    commentsCount,
    expandedReplies,
    repliesVisibleCount,
    handleAddComment,
    handleAddReply,
    handleToggleLike,
    handleToggleReplies,
    handleShowMoreReplies,
  };
};