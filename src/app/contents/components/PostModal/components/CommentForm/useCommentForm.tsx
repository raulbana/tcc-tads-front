import { useState, useCallback } from "react";

interface UseCommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export const useCommentForm = ({ onSubmit, placeholder = "Escreva um comentário..." }: UseCommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = useCallback(() => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
    }
  }, [comment, onSubmit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  const isSubmitDisabled = !comment.trim();

  return {
    comment,
    setComment,
    handleSubmit,
    handleKeyPress,
    isSubmitDisabled,
    placeholder
  };
};