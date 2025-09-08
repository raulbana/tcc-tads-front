"use client";

import React from "react";
import Modal from "@/app/components/Modal/Modal";
import AccessibilityForm from "../accessibilityForm/accessibilityForm";

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações de Acessibilidade"
    >
      <AccessibilityForm />
    </Modal>
  );
};

export default AccessibilityModal;
