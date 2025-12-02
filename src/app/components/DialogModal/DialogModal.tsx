"use client";

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Button, { ButtonType, ButtonSize } from "../Button/Button";

export interface DialogModalButton {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  autoClose?: boolean;
}

export interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  primaryButton?: DialogModalButton;
  secondaryButton?: DialogModalButton;
  children?: ReactNode;
  dismissOnBackdropPress?: boolean;
}

const DialogModal: React.FC<DialogModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryButton,
  secondaryButton,
  children,
  dismissOnBackdropPress = true,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dismissOnBackdropPress && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryPress = () => {
    if (primaryButton) {
      primaryButton.onPress();
      if (primaryButton.autoClose !== false) {
        onClose();
      }
    }
  };

  const handleSecondaryPress = () => {
    if (secondaryButton) {
      secondaryButton.onPress();
      if (secondaryButton.autoClose !== false) {
        onClose();
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        )}

        {description && (
          <p className="text-gray-600 text-base">{description}</p>
        )}

        {children}

        {(primaryButton || secondaryButton) && (
          <div className="flex flex-row justify-end gap-3 pt-4 flex-wrap">
            {secondaryButton && (
              <Button
                type={secondaryButton.type || "SECONDARY"}
                size={secondaryButton.size || "SMALL"}
                text={secondaryButton.label}
                onClick={handleSecondaryPress}
                disabled={secondaryButton.disabled}
                className="w-auto min-w-24"
              />
            )}
            {primaryButton && (
              <Button
                type={primaryButton.type || "PRIMARY"}
                size={primaryButton.size || "SMALL"}
                text={primaryButton.label}
                onClick={handlePrimaryPress}
                disabled={primaryButton.disabled}
                className="w-auto min-w-24"
              />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DialogModal;

