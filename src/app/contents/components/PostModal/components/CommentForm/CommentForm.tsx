"use client";
import React, { useState } from "react";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-gray-50 rounded-lg">
      <Input
        type="text"
        value={comment}
        onChange={setComment}
        placeholder="Escreva um comentário..."
        className="flex-1"
        onKeyDown={handleKeyPress}
      />
      
      <Button
        type="PRIMARY"
        text="Comentar"
        onClick={handleSubmit}
        disabled={!comment.trim()}
        className="px-3 w-min"
        size="SMALL"
      />
    </div>
  );
};

export default CommentForm;