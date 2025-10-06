"use client";
import React from "react";
import { HeartIcon, ShareIcon } from "@phosphor-icons/react";
import { usePostActions } from "./usePostActions";

interface PostActionsProps {
  contentId: string;
  isLiked?: boolean;
  likesCount?: number;
  isReposted?: boolean;
  repostsCount?: number;
  onToggleLike: (contentId: string) => void;
  onToggleRepost: (contentId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  contentId,
  isLiked = false,
  likesCount = 0,
  isReposted = false,
  repostsCount = 0,
  onToggleLike,
  onToggleRepost,
}) => {
  const {
    likeButtonProps,
    repostButtonProps,
    formatCount
  } = usePostActions({
    contentId,
    isLiked,
    isReposted,
    onToggleLike,
    onToggleRepost
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

      <button {...repostButtonProps}>
        <ShareIcon
          className="w-5 h-5"
          weight={isReposted ? "fill" : "regular"}
        />
        <span className="text-sm font-medium">
          {formatCount(repostsCount)}
        </span>
      </button>
    </div>
  );
};

export default PostActions;