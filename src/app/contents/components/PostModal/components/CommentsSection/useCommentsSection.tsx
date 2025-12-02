import { useState, useCallback, useMemo, useEffect } from "react";
import { Content, Comment, AuthorDTO } from "@/app/types/content";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import contentServices from "@/app/contents/services/contentServices";
import { useAuth } from "@/app/contexts/AuthContext";

export const useCommentsSection = (content: Content) => {
  const { user } = useAuth();
  const contentQueries = useContentQueries(["content"]);
  const createCommentMutation = contentQueries.useCreateComment();
  const likeCommentMutation = contentQueries.useLikeComment();

  const normalizeComments = useCallback((comments: Comment[]): Comment[] => {
    return comments.map((comment) => ({
      ...comment,
      id: String(comment.id),
      replies: comment.replies
        ? comment.replies.map((reply) => ({
            ...reply,
            id: String(reply.id),
          }))
        : undefined,
    }));
  }, []);

  const [localComments, setLocalComments] = useState<Comment[]>(
    normalizeComments(content.comments || [])
  );
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [repliesVisibleCount, setRepliesVisibleCount] = useState<
    Map<string, number>
  >(new Map());
  const [loadedReplies, setLoadedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const normalized = normalizeComments(content.comments || []);
    setLocalComments(normalized);
    const commentsWithReplies = new Set<string>();
    normalized.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        commentsWithReplies.add(comment.id);
      }
    });
    setLoadedReplies(commentsWithReplies);
  }, [content.comments, normalizeComments]);

  const comments = useMemo(() => localComments, [localComments]);
  const commentsCount = useMemo(() => comments.length, [comments]);

  const handleAddComment = useCallback(
    async (text: string) => {
      if (!user || !text.trim()) return;

      const optimisticCommentAuthor: AuthorDTO = {
        id: user.id,
        name: user.name,
        profilePicture: user.profilePictureUrl || "",
      };

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        contentId: content.id,
        text: text.trim(),
        author: optimisticCommentAuthor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false,
        repliesCount: 0,
        replies: [],
      };

      setLocalComments((prev) => [...prev, optimisticComment]);

      try {
        await createCommentMutation.mutateAsync({
          contentId: parseInt(content.id),
          authorId: user.id,
          text: text.trim(),
        });
      } catch (error) {
        setLocalComments((prev) =>
          prev.filter((c) => c.id !== optimisticComment.id)
        );
      }
    },
    [user, content.id, createCommentMutation]
  );

  const handleAddReply = useCallback(
    async (parentCommentId: string, text: string) => {
      if (!user || !text.trim()) return;

      const optimisticCommentAuthor: AuthorDTO = {
        id: user.id,
        name: user.name,
        profilePicture: user.profilePictureUrl || "",
      };

      const optimisticReply: Comment = {
        id: `temp-reply-${Date.now()}`,
        contentId: content.id,
        text: text.trim(),
        author: optimisticCommentAuthor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false,
        repliesCount: 0,
        replies: [],
      };

      setLocalComments((prev) =>
        prev.map((comment) => {
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
        setLocalComments((prev) =>
          prev.map((comment) => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(
                  (r) => r.id !== optimisticReply.id
                ),
                repliesCount: Math.max((comment.repliesCount || 0) - 1, 0),
              };
            }
            return comment;
          })
        );
      }
    },
    [user, content.id, createCommentMutation]
  );

  const updateCommentLike = useCallback(
    (
      comments: Comment[],
      targetId: string,
      isReply: boolean,
      parentId?: string
    ): Comment[] => {
      return comments.map((comment) => {
        if (isReply && parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: (comment.replies || []).map((reply) => {
              if (reply.id === targetId) {
                const newLikedState = !reply.isLiked;
                return {
                  ...reply,
                  isLiked: newLikedState,
                  likesCount: newLikedState
                    ? (reply.likesCount || 0) + 1
                    : Math.max((reply.likesCount || 0) - 1, 0),
                };
              }
              return reply;
            }),
          };
        } else if (!isReply && comment.id === targetId) {
          const newLikedState = !comment.isLiked;
          return {
            ...comment,
            isLiked: newLikedState,
            likesCount: newLikedState
              ? (comment.likesCount || 0) + 1
              : Math.max((comment.likesCount || 0) - 1, 0),
          };
        }
        return comment;
      });
    },
    []
  );

  const findComment = useCallback(
    (
      comments: Comment[],
      targetId: string,
      isReply: boolean,
      parentId?: string
    ): Comment | null => {
      if (isReply && parentId) {
        for (const comment of comments) {
          if (comment.id === parentId) {
            const reply = (comment.replies || []).find(
              (r) => r.id === targetId
            );
            if (reply) return reply;
          }
        }
      } else {
        const comment = comments.find((c) => c.id === targetId);
        if (comment) return comment;
      }
      return null;
    },
    []
  );

  const handleToggleLike = useCallback(
    async (commentId: string, isReply?: boolean, parentId?: string) => {
      if (
        !user ||
        !commentId ||
        commentId === "undefined" ||
        commentId.startsWith("temp-")
      ) {
        return;
      }

      const comment = findComment(
        localComments,
        commentId,
        isReply || false,
        parentId
      );
      if (!comment) {
        return;
      }

      const newLikedState = !comment.isLiked;

      setLocalComments((prev) =>
        updateCommentLike(prev, commentId, isReply || false, parentId)
      );

      try {
        await likeCommentMutation.mutateAsync({
          commentId,
          userId: user.id,
          liked: newLikedState,
        });
      } catch (error) {
        setLocalComments((prev) =>
          updateCommentLike(prev, commentId, isReply || false, parentId)
        );
      }
    },
    [user, localComments, likeCommentMutation, findComment, updateCommentLike]
  );

  const limitDepth = useCallback(
    (commentList: Comment[], depth: number = 0): Comment[] => {
      if (depth >= 2) {
        return commentList.map((comment) => ({
          ...comment,
          replies: [],
        }));
      }
      return commentList.map((comment) => ({
        ...comment,
        replies: comment.replies ? limitDepth(comment.replies, depth + 1) : [],
      }));
    },
    []
  );

  const handleToggleReplies = useCallback(
    async (commentId: string) => {
      if (!user) return;

      const isCurrentlyExpanded = expandedReplies.has(commentId);
      const comment = localComments.find((c) => c.id === commentId);

      if (!comment) return;

      if (isCurrentlyExpanded) {
        setExpandedReplies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        return;
      }

      const hasRepliesLoaded = comment.replies && comment.replies.length > 0;
      const needsToLoadReplies =
        (comment.repliesCount || 0) > 0 &&
        !hasRepliesLoaded &&
        !loadedReplies.has(commentId);

      if (needsToLoadReplies) {
        try {
          const replies = await contentServices.getCommentReplies(
            commentId,
            user.id.toString()
          );
          const normalizedReplies = normalizeComments(replies);
          const limitedReplies = limitDepth(normalizedReplies, 1);

          setLocalComments((prev) =>
            prev.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: limitedReplies,
                };
              }
              return comment;
            })
          );

          setLoadedReplies((prev) => new Set(prev).add(commentId));

          setRepliesVisibleCount((prev) => {
            if (!prev.has(commentId)) {
              const newMap = new Map(prev);
              newMap.set(commentId, Math.min(5, limitedReplies.length));
              return newMap;
            }
            return prev;
          });

          setExpandedReplies((prev) => new Set(prev).add(commentId));
        } catch (error) {
        }
      } else {
        setExpandedReplies((prev) => new Set(prev).add(commentId));
      }
    },
    [
      user,
      expandedReplies,
      loadedReplies,
      localComments,
      normalizeComments,
      limitDepth,
    ]
  );

  const handleShowMoreReplies = useCallback((commentId: string) => {
    setRepliesVisibleCount((prev) => {
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
