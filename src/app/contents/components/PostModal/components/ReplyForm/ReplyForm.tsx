"use client";
import React, { useState } from "react";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

interface ReplyFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Escreva uma resposta..." 
}) => {
  const [reply, setReply] = useState("");

  const handleSubmit = () => {
    if (reply.trim()) {
      onSubmit(reply.trim());
      setReply("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-01 rounded-lg border border-gray-04">
      <div className="flex gap-2">
        <Input
          type="text"
          value={reply}
          onChange={setReply}
          placeholder={placeholder}
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
            className="px-3"
          />
          <Button
            type="PRIMARY"
            text="Responder"
            onClick={handleSubmit}
            disabled={!reply.trim()}
            size="SMALL"
            className="px-3"
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;