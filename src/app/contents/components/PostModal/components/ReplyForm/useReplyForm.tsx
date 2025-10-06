import { useState, useCallback } from "react";

interface UseReplyFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const useReplyForm = ({ onSubmit, onCancel, placeholder = "Escreva uma resposta..." }: UseReplyFormProps) => {
  const [reply, setReply] = useState("");

  const handleSubmit = useCallback(() => {
    if (reply.trim()) {
      onSubmit(reply.trim());
      setReply("");
    }
  }, [reply, onSubmit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [handleSubmit, onCancel]);

  const isSubmitDisabled = !reply.trim();

  return {
    reply,
    setReply,
    handleSubmit,
    handleKeyPress,
    isSubmitDisabled,
    placeholder
  };
};