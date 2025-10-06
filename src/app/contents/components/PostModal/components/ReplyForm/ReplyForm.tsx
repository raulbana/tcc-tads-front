"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";
import { useReplyForm } from "./useReplyForm";

interface ReplyFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel, placeholder }) => {
  const {
    reply,
    setReply,
    handleSubmit,
    handleKeyPress,
    isSubmitDisabled,
    placeholder: formPlaceholder
  } = useReplyForm({ onSubmit, onCancel, placeholder });

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          value={reply}
          onChange={setReply}
          placeholder={formPlaceholder}
          className="flex-1"
          onKeyDown={handleKeyPress}
          autoFocus
        />

        <div className="flex gap-1">
          <Button
            type="SECONDARY"
            text="Cancelar"
            onClick={onCancel}
            size="SMALL"
            className="px-3 flex-1"
          />
          <Button
            type="PRIMARY"
            text="Responder"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            size="SMALL"
            className="px-3 flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;