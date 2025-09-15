"use client";
import React from "react";
import Modal from "@/app/components/Modal/Modal";
import { Content } from "@/app/types/content";
import PostDetails from "./components/PostDetails/PostDetails";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  if (!content) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="large"
    >
      <div className="h-[calc(90vh-120px)] overflow-hidden">
        <PostDetails content={content} />
      </div>
    </Modal>
  );
};

export default PostModal;