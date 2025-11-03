"use client";
import React from "react";
import { Content } from "@/app/types/content";
import { useCommentsSection } from "./useCommentsSection";
import CommentItem from "../CommentItem/CommentItem";
import CommentForm from "../CommentForm/CommentForm";

interface CommentsSectionProps {
  content: Content;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ content }) => {
  const { 
    comments, 
    commentsCount,
    expandedReplies,
    repliesVisibleCount,
    handleAddComment,
    handleAddReply,
    handleToggleLike,
    handleToggleReplies,
    handleShowMoreReplies
  } = useCommentsSection(content);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Comentários ({commentsCount})
      </h3>

      <CommentForm onSubmit={handleAddComment} />

      <div className="space-y-4 overflow-y-auto">
        {commentsCount === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onToggleLike={handleToggleLike}
              onAddReply={handleAddReply}
              onToggleReplies={handleToggleReplies}
              onShowMoreReplies={handleShowMoreReplies}
              isExpanded={expandedReplies.has(comment.id)}
              visibleRepliesCount={repliesVisibleCount.get(comment.id) || 5}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;