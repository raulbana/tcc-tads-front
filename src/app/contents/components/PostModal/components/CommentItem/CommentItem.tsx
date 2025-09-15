"use client";
import React from "react";
import { Comment } from "@/app/types/content";
import moment from "moment";
import { HeartIcon } from "@phosphor-icons/react";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const formatDate = (date: Date) => {
    return moment(date).fromNow();
  };

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={comment.authorImage}
          alt={comment.authorName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 text-sm">
            {comment.authorName}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          {comment.text}
        </p>

        {/* Interações */}
        <div className="flex items-center gap-4 pt-1">
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
            <HeartIcon 
              className="w-4 h-4" 
              weight={comment.isLikedByCurrentUser ? "fill" : "regular"}
            />
            {comment.likesCount || 0}
          </button>

          {comment.repliesCount && comment.repliesCount > 0 && (
            <button className="text-xs text-purple-600 hover:text-purple-800 transition-colors">
              {comment.repliesCount} resposta{comment.repliesCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;