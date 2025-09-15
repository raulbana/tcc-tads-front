"use client";
import React from "react";
import Image from "next/image";
import { Comment } from "@/app/types/content";
import { HeartIcon, ChatCircleIcon } from "@phosphor-icons/react";
import Button from "@/app/components/Button/Button";
import ReplyForm from "../ReplyForm/ReplyForm";
import { useCommentItem } from "./useCommentItem";

interface CommentItemProps {
  comment: Comment;
  onToggleLike: (commentId: string, isReply?: boolean, parentId?: string) => void;
  onAddReply: (parentCommentId: string, text: string) => void;
  onToggleReplies: (commentId: string) => void;
  onShowMoreReplies: (commentId: string) => void;
  isExpanded: boolean;
  visibleRepliesCount: number;
  isReply?: boolean;
  parentId?: string;
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const { comment, isReply = false, isExpanded } = props;
  
  const {
    showReplyForm,
    formattedDate,
    visibleReplies,
    hasMoreReplies,
    remainingRepliesCount,
    likeButtonProps,
    replyButtonProps,
    toggleRepliesButtonProps,
    handleSubmitReply,
    handleCancelReply,
    handleShowMoreRepliesClick
  } = useCommentItem(props);

  return (
    <div className={`${isReply ? 'ml-6 border-l-1 border-gray-05 bg-gray-03 pe-3' : 'bg-gray-03'}`}>
      <div className="flex gap-3 p-3">
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
                {formattedDate}
              </span>
            </div>

            <button {...likeButtonProps}>
              {comment.likesCount || 0}
              <HeartIcon
                className="w-4 h-4"
                weight={comment.isLikedByCurrentUser ? "fill" : "regular"}
              />
            </button>
          </div>

          <p className="text-gray-08 text-sm leading-relaxed">
            {comment.text}
          </p>

          <div className="flex items-center gap-4 pt-1">
            {!isReply && comment.repliesCount! > 0 && (
              <button {...toggleRepliesButtonProps}>
                {comment.repliesCount}
                <ChatCircleIcon className="w-4 h-4" />
              </button>
            )}

            <button {...replyButtonProps}>
              Responder
            </button>
          </div>

          {showReplyForm && (
            <ReplyForm
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              placeholder={`Respondendo a ${comment.authorName}...`}
            />
          )}
        </div>
      </div>

      {!isReply && isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {visibleReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onToggleLike={props.onToggleLike}
              onAddReply={props.onAddReply}
              onToggleReplies={props.onToggleReplies}
              onShowMoreReplies={props.onShowMoreReplies}
              isExpanded={false}
              visibleRepliesCount={0}
              isReply={true}
              parentId={comment.id}
            />
          ))}

          {hasMoreReplies && (
            <div className="px-4 pb-4">
              <Button
                type="SECONDARY"
                text={`Ver mais ${remainingRepliesCount} respostas`}
                onClick={handleShowMoreRepliesClick}
                size="SMALL"
                className="text-xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;