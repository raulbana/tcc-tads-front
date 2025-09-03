"use client";

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import useModal from "./useModal";
import { XIcon } from "@phosphor-icons/react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const {
    getContainerStyle,
    getModalStyle,
    getHeaderStyle,
    getTitleStyle,
    getCloseButtonStyle,
    getBodyStyle,
  } = useModal();

  if (!isOpen) return null;

  return createPortal(
    <div className={getContainerStyle()}>
      <div className={getModalStyle()}>
        <div className={getHeaderStyle()}>
          {title && <h2 className={getTitleStyle()}>{title}</h2>}
          <button onClick={onClose} className={getCloseButtonStyle()}>
            <XIcon />
          </button>
        </div>

        <div className={getBodyStyle()}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
