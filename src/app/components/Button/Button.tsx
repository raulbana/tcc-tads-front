import React from "react";
import useButton from "./useButton";

export type ButtonType = "PRIMARY" | "SECONDARY" | "TERTIARY";
export type ButtonSize = "SMALL" | "MEDIUM" | "LARGE";

export interface ButtonProps {
  type?: ButtonType;
  buttonType?: "submit" | "button";
  size?: ButtonSize;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  text?: string | React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "LEFT" | "RIGHT" | "CENTER";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "PRIMARY",
  size = "MEDIUM",
  buttonType = "button",
  onClick,
  disabled = false,
  text,
  icon,
  iconPosition,
  className = "",
}) => {
  const { getButtonColor, getButtonSize } = useButton();

  const baseStyle =
    "w-full cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonType === "submit") {
      if (onClick) {
        onClick(e);
      }
      return;
    }
    e.preventDefault();
    onClick?.(e);
  };

  return (
    <button
      type={buttonType}
      className={`${baseStyle} ${getButtonSize(size)} ${getButtonColor(
        type, disabled
      )} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && iconPosition === "LEFT" && <span className="mr-2">{icon}</span>}
      {iconPosition === "CENTER" && icon ? (
        <span className="flex justify-center">{icon}</span>
      ) : (
        text
      )}
      {icon && iconPosition === "RIGHT" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
