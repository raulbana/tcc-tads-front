"use client";
import React from "react";
import Image from "next/image";
import { Comment } from "@/app/types/content";
import moment from "moment";
import { HeartIcon, ChatCircleIcon } from "@phosphor-icons/react";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const formatDate = (date: Date) => {
    return moment(date).fromNow();
  };

  return (
    <div className="flex gap-3 p-3 bg-gray-03 rounded-lg">
      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={comment.authorImage}
          alt={comment.authorName}
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">

            <span className="font-medium text-gray-08 text-sm">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-07">
              {formatDate(comment.createdAt)}
            </span>

          </div>

          <button className={`flex items-center gap-1 text-xs transition-colors ${comment.isLikedByCurrentUser ? 'text-purple-04 hover:text-purple-03' : 'text-gray-07 hover:text-purple-03'}`}>
            {comment.likesCount}
            <HeartIcon
              className="w-4 h-4"
              weight={comment.isLikedByCurrentUser ? "fill" : "regular"}
            />
          </button>
        </div>

        <p className="text-gray-08 text-sm leading-relaxed">
          {comment.text}
        </p>

        <div className="gap-4 pt-1">
          <button className='flex items-center gap-1 text-xs transition-colors text-gray-07 hover:text-purple-03'>
            {comment.repliesCount}
            <ChatCircleIcon
              className="w-4 h-4"
              />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommentItem;