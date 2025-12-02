"use client";

import { useState, useCallback } from "react";
import DialogModal, {
  DialogModalButton,
} from "./DialogModal";

export interface DialogConfig {
  title?: string;
  description?: string;
  primaryButton?: DialogModalButton;
  secondaryButton?: DialogModalButton;
  children?: React.ReactNode;
  dismissOnBackdropPress?: boolean;
}

export const useDialogModal = () => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = useCallback((config: DialogConfig) => {
    setDialogConfig(config);
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setDialogConfig(null);
    }, 300);
  }, []);

  const DialogPortal = dialogConfig ? (
    <DialogModal
      isOpen={isOpen}
      onClose={hideDialog}
      title={dialogConfig.title}
      description={dialogConfig.description}
      primaryButton={dialogConfig.primaryButton}
      secondaryButton={dialogConfig.secondaryButton}
      dismissOnBackdropPress={
        dialogConfig.dismissOnBackdropPress !== false
      }
    >
      {dialogConfig.children}
    </DialogModal>
  ) : null;

  return {
    showDialog,
    hideDialog,
    DialogPortal,
    isOpen,
  };
};

export default useDialogModal;


