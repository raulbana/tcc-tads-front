"use client";
import React from "react";
import { HeartIcon, BookmarkIcon } from "@phosphor-icons/react";
import { usePostActions } from "./usePostActions";

interface PostActionsProps {
  contentId: string;
  isLiked?: boolean;
  likesCount?: number;
  isSaved?: boolean;
  onToggleLike: (contentId: string) => void;
  onToggleSave: (contentId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  contentId,
  isLiked = false,
  likesCount = 0,
  isSaved = false,
  onToggleLike,
  onToggleSave,
}) => {
  const {
    likeButtonProps,
    saveButtonProps,
    formatCount
  } = usePostActions({
    contentId,
    isLiked,
    isSaved,
    onToggleLike,
    onToggleSave
  });

  return (
    <div className="flex items-center gap-4">
      <button {...likeButtonProps}>
        <HeartIcon
          className="w-5 h-5"
          weight={isLiked ? "fill" : "regular"}
        />
        <span className="text-sm font-medium">
          {formatCount(likesCount)}
        </span>
      </button>

      <button {...saveButtonProps}>
        <BookmarkIcon
          className="w-5 h-5"
          weight={isSaved ? "fill" : "regular"}
        />
      </button>
    </div>
  );
};

export default PostActions;