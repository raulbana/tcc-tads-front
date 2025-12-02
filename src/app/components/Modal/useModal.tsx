import React from "react";

const useModal = (onClose?: () => void) => {
  const getContainerStyle = () =>
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4";

  const getModalStyle = (size?: "small" | "medium" | "large" | "full") => {
    const baseStyle =
      "bg-gray-01 rounded-2xl shadow-lg relative max-h-[90vh] overflow-hidden flex flex-col";

    switch (size) {
      case "small":
        return `${baseStyle} w-full max-w-md`;
      case "large":
        return `${baseStyle} w-full max-w-6xl`;
      case "full":
        return `${baseStyle} w-full max-w-7xl`;
      default:
        return `${baseStyle} w-full max-w-lg`;
    }
  };

  const getHeaderStyle = () =>
    "flex justify-between items-center border-b border-gray-03 pb-3 px-6 pt-6 flex-shrink-0";

  const getTitleStyle = () => "text-lg text-gray-08 font-semibold";

  const getCloseButtonStyle = () =>
    "text-gray-08 hover:text-purple-04 text-2xl cursor-pointer transition";

  const getBodyStyle = () =>
    "px-6 pb-6 text-sm text-gray-08 overflow-y-auto flex-1 min-h-0";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return {
    getContainerStyle,
    getModalStyle,
    getHeaderStyle,
    getTitleStyle,
    getCloseButtonStyle,
    getBodyStyle,
    handleBackdropClick,
  };
};

export default useModal;
