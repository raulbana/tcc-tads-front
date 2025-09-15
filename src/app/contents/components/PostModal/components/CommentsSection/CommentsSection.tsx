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
  const { comments, handleAddComment } = useCommentsSection(content);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Comentários ({comments.length})
      </h3>

      <CommentForm onSubmit={handleAddComment} />

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;