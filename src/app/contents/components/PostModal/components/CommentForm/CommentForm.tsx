"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";
import { useCommentForm } from "./useCommentForm";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, placeholder }) => {
  const {
    comment,
    setComment,
    handleSubmit,
    handleKeyPress,
    isSubmitDisabled,
    placeholder: formPlaceholder
  } = useCommentForm({ onSubmit, placeholder });

  return (
    <div className="flex gap-2 p-2 bg-gray-01 rounded-lg">
      <Input
        type="text"
        value={comment}
        onChange={setComment}
        placeholder={formPlaceholder}
        className="flex-1"
        onKeyDown={handleKeyPress}
      />
      
      <Button
        type="PRIMARY"
        text="Comentar"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        size="SMALL"
        className="flex-0"
      />
    </div>
  );
};

export default CommentForm;