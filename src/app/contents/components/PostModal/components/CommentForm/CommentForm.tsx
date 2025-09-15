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
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <Input
        type="text"
        value={comment}
        onChange={setComment}
        placeholder="Escreva um comentário... (Ctrl + Enter para enviar)"
        className="min-h-20 resize-none"
        onKeyDown={handleKeyPress}
      />
      
      <div className="flex justify-end">
        <Button
          type="PRIMARY"
          text="Comentar"
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="px-6"
        />
      </div>
    </div>
  );
};

export default CommentForm;