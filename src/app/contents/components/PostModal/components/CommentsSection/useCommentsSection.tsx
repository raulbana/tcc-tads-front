import { useState } from "react";
import { Content, Comment } from "@/app/types/content";

export const useCommentsSection = (content: Content) => {
  const [comments, setComments] = useState<Comment[]>(content.comments || []);

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      contentId: content.id,
      userId: "current-user",
      text,
      authorId: "current-user",
      authorName: "Usuário Atual",
      authorImage: "https://ui-avatars.com/api/?name=Usuario+Atual&background=5F3C6F&color=fff",
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      repliesCount: 0,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
  };

  return {
    comments,
    handleAddComment
  };
};