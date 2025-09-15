import { useState } from "react";
import { Content, Comment } from "@/app/types/content";

export const useCommentsSection = (content: Content) => {
  const [comments, setComments] = useState<Comment[]>(content.comments || []);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [repliesVisibleCount, setRepliesVisibleCount] = useState<Record<string, number>>({});

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      contentId: content.id,
      userId: "current-user",
      text,
      authorId: "current-user",
      authorName: "Usuário Atual",
      authorImage: "https://ui-avatars.com/api/?name=UA&background=F5E5FD&color=5F3C6F",
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      repliesCount: 0,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
  };

  const handleAddReply = (parentCommentId: string, text: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      contentId: content.id,
      userId: "current-user",
      text,
      authorId: "current-user",
      authorName: "Usuário Atual",
      authorImage: "https://ui-avatars.com/api/?name=UA&background=F5E5FD&color=5F3C6F",
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      repliesCount: 0,
      replies: []
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentCommentId) {
        const updatedReplies = [...(comment.replies || []), newReply].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return {
          ...comment,
          replies: updatedReplies,
          repliesCount: updatedReplies.length
        };
      }
      return comment;
    }));

    // Expand replies when a new one is added
    setExpandedReplies(prev => new Set([...prev, parentCommentId]));
  };

  const handleToggleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          const updatedReplies = comment.replies?.map(reply => {
            if (reply.id === commentId) {
              const isLiked = reply.isLikedByCurrentUser;
              return {
                ...reply,
                isLikedByCurrentUser: !isLiked,
                likesCount: (reply.likesCount || 0) + (isLiked ? -1 : 1)
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      }));
    } else {
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const isLiked = comment.isLikedByCurrentUser;
          return {
            ...comment,
            isLikedByCurrentUser: !isLiked,
            likesCount: (comment.likesCount || 0) + (isLiked ? -1 : 1)
          };
        }
        return comment;
      }));
    }
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        // Initialize visible count
        if (!repliesVisibleCount[commentId]) {
          setRepliesVisibleCount(prev => ({ ...prev, [commentId]: 5 }));
        }
      }
      return newSet;
    });
  };

  const handleShowMoreReplies = (commentId: string) => {
    setRepliesVisibleCount(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 5) + 5
    }));
  };

  return {
    comments,
    expandedReplies,
    repliesVisibleCount,
    handleAddComment,
    handleAddReply,
    handleToggleLike,
    handleToggleReplies,
    handleShowMoreReplies
  };
};